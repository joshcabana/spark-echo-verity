import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Helper: find user by email efficiently using admin API filter
  async function findUserByEmail(email: string) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      // @ts-ignore - filter parameter supported by Supabase
    });
    // Fall back to filtering in memory but only first page
    if (error || !data?.users) return null;
    // Use a targeted approach: query profiles table by email-linked user
    const { data: profileUsers } = await supabase
      .from("profiles")
      .select("user_id")
      .limit(1);
    
    // Since admin.listUsers doesn't support email filter well in all versions,
    // we search through users but cap at reasonable limit
    const { data: allUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 50 });
    return allUsers?.users?.find((u) => u.email === email) || null;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_email;
      if (!email) break;

      const user = await findUserByEmail(email);
      if (!user) break;

      if (session.mode === "payment") {
        const amount = session.amount_total;
        let tokens = 10;
        if (amount && amount >= 1190) tokens = 30;
        else if (amount && amount >= 690) tokens = 15;

        const { data: profile } = await supabase
          .from("profiles")
          .select("token_balance")
          .eq("user_id", user.id)
          .single();

        await supabase
          .from("profiles")
          .update({ token_balance: (profile?.token_balance || 0) + tokens })
          .eq("user_id", user.id);

        await supabase.from("token_transactions").insert({
          user_id: user.id,
          amount: tokens,
          reason: `Purchased ${tokens} token pack`,
          stripe_session_id: session.id,
        });
      } else if (session.mode === "subscription") {
        const isAnnual = (session.amount_total || 0) > 5000;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (isAnnual ? 12 : 1));

        await supabase
          .from("profiles")
          .update({
            subscription_tier: isAnnual ? "pass_annual" : "pass_monthly",
            subscription_expires_at: expiresAt.toISOString(),
          })
          .eq("user_id", user.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const email = (sub as any).customer_email;
      if (!email) break;

      const user = await findUserByEmail(email);
      if (!user) break;

      await supabase
        .from("profiles")
        .update({ subscription_tier: "free", subscription_expires_at: null })
        .eq("user_id", user.id);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
