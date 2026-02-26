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
    const { room_id, user_id } = await req.json();

    // In production, query matchmaking_queue for another waiting user in the same room
    // For now, return a simulated match
    const channel = `verity-${room_id}-${Date.now()}`;

    return new Response(
      JSON.stringify({
        matched: true,
        channel,
        call_id: crypto.randomUUID(),
        message: "Match found",
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
