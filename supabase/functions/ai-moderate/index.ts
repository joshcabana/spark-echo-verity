import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { call_id, clip_data } = await req.json();

    // In production: send clip_data to AI moderation API (e.g. Google Vision, custom model)
    // Returns safety score and any flags
    const score = Math.random() * 0.3; // Simulated low-risk score
    const flagged = score > 0.6;

    return new Response(
      JSON.stringify({
        safe: !flagged,
        score,
        reason: flagged ? "Potential policy violation detected" : null,
        call_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
