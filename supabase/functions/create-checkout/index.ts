import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const urlRegex = /^https?:\/\/.{1,2000}$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const body = await req.json();

    // Validate inputs
    const price_id = typeof body.price_id === "string" ? body.price_id.trim() : "";
    if (!price_id || price_id.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid price_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const customer_email = typeof body.customer_email === "string" ? body.customer_email.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customer_email && !emailRegex.test(customer_email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const origin = req.headers.get("origin") || "";
    const success_url = body.success_url && urlRegex.test(String(body.success_url)) ? String(body.success_url) : `${origin}/tokens?success=true`;
    const cancel_url = body.cancel_url && urlRegex.test(String(body.cancel_url)) ? String(body.cancel_url) : `${origin}/tokens`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      mode: price_id.includes("sub") ? "subscription" : "payment",
      success_url,
      cancel_url,
      ...(customer_email ? { customer_email } : {}),
    });

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
