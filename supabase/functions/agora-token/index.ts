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
    const { channel, uid } = await req.json();

    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");

    if (!appId || !appCertificate) {
      return new Response(
        JSON.stringify({
          token: "placeholder-token",
          appId: appId || "AGORA_APP_ID_NOT_SET",
          channel,
          uid,
          message: "Using placeholder — add AGORA_APP_ID and AGORA_APP_CERTIFICATE secrets",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // In production, use agora-access-token npm package to generate RTC token
    // For now return placeholder
    return new Response(
      JSON.stringify({ token: "placeholder-token", appId, channel, uid }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
