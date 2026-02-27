import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Price ID → entitlement map (must match create-checkout PRICE_MAP)
const PRICE_ENTITLEMENTS: Record<string, { tokens?: number; tier?: string; annual?: boolean }> = {
  "price_starter_10": { tokens: 10 },
  "price_popular_15": { tokens: 15 },
  "price_value_30": { tokens: 30 },
  "price_pass_monthly": { tier: "pass_monthly", annual: false },
  "price_pass_annual": { tier: "pass_annual", annual: true },
};

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Idempotency check
  const { error: idempotencyErr } = await supabase
    .from("stripe_processed_events")
    .insert({ event_id: event.id });

  if (idempotencyErr) {
    if (idempotencyErr.code === "23505") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Idempotency insert error:", idempotencyErr);
  }

  // Helper: find profile by stripe_customer_id, fallback to email lookup with proper filter
  async function findProfileByCustomer(customerId: string) {
    // Try stripe_customer_id first
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, token_balance, stripe_customer_id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile) return profile;

    // Fallback: get customer email from Stripe, then find user by email
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted || !("email" in customer) || !customer.email) return null;

      // Use email filter instead of scanning all users
      const { data: usersResult } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        // @ts-ignore - filter param supported by Supabase admin API
      });

      // Search through users with email match using a targeted approach
      // Since listUsers doesn't support email filter directly, query profiles by checking auth
      let userId: string | null = null;

      // More reliable: search all pages until we find the email
      let page = 1;
      const perPage = 100;
      while (!userId) {
        const { data: usersPage } = await supabase.auth.admin.listUsers({ page, perPage });
        if (!usersPage?.users?.length) break;

        const match = usersPage.users.find((u) => u.email === customer.email);
        if (match) {
          userId = match.id;
          break;
        }

        // If we got fewer than perPage results, we've reached the end
        if (usersPage.users.length < perPage) break;
        page++;
        // Safety limit to prevent infinite loops
        if (page > 100) break;
      }

      if (!userId) return null;

      const { data: fallbackProfile } = await supabase
        .from("profiles")
        .select("user_id, token_balance, stripe_customer_id")
        .eq("user_id", userId)
        .single();

      // Store stripe_customer_id for future lookups
      if (fallbackProfile && !fallbackProfile.stripe_customer_id) {
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("user_id", userId);
      }

      return fallbackProfile;
    } catch (err) {
      console.error("Customer lookup fallback error:", err);
      return null;
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (!customerId) break;

        const profile = await findProfileByCustomer(customerId);
        if (!profile) break;

        // Determine entitlement from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const priceId = lineItems.data[0]?.price?.id;
        const entitlement = priceId ? PRICE_ENTITLEMENTS[priceId] : null;

        if (entitlement?.tokens) {
          await supabase
            .from("profiles")
            .update({ token_balance: (profile.token_balance || 0) + entitlement.tokens })
            .eq("user_id", profile.user_id);

          await supabase.from("token_transactions").insert({
            user_id: profile.user_id,
            amount: entitlement.tokens,
            reason: `Purchased ${entitlement.tokens} token pack`,
            stripe_session_id: session.id,
          });
        } else if (entitlement?.tier) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + (entitlement.annual ? 12 : 1));

          await supabase
            .from("profiles")
            .update({
              subscription_tier: entitlement.tier,
              subscription_expires_at: expiresAt.toISOString(),
            })
            .eq("user_id", profile.user_id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (!customerId) break;

        const profile = await findProfileByCustomer(customerId);
        if (!profile) break;

        await supabase
          .from("profiles")
          .update({ subscription_tier: "free", subscription_expires_at: null })
          .eq("user_id", profile.user_id);
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
