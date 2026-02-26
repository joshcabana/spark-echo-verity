import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claims.claims.sub;
    const { spark_id, days } = await req.json();

    // Verify user is member of this spark
    const { data: spark, error: sparkError } = await supabase
      .from("sparks")
      .select("*")
      .eq("id", spark_id)
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .single();

    if (sparkError || !spark) {
      return new Response(JSON.stringify({ error: "Spark not found" }), { status: 404, headers: corsHeaders });
    }

    // Deduct tokens
    const tokenCost = days === 1 ? 1 : days === 3 ? 2 : 4;
    const { data: profile } = await supabase
      .from("profiles")
      .select("token_balance, subscription_tier")
      .eq("user_id", userId)
      .single();

    const isFreeWithPass = profile?.subscription_tier !== "free";
    const actualCost = isFreeWithPass ? 0 : tokenCost;

    if (!isFreeWithPass && (profile?.token_balance || 0) < actualCost) {
      return new Response(
        JSON.stringify({ error: "Insufficient tokens" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extend spark expiry
    const currentExpiry = spark.expires_at ? new Date(spark.expires_at) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    await supabase.from("sparks").update({ expires_at: newExpiry.toISOString() }).eq("id", spark_id);

    if (actualCost > 0) {
      await supabase.from("profiles").update({ token_balance: (profile?.token_balance || 0) - actualCost }).eq("user_id", userId);
      await supabase.from("token_transactions").insert({ user_id: userId, amount: -actualCost, reason: `Spark extension: ${days} days` });
    }

    return new Response(
      JSON.stringify({ success: true, new_expiry: newExpiry.toISOString(), tokens_spent: actualCost }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
