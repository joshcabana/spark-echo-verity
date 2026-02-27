import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Agora token generation helpers
// Since we can't use the npm package directly in Deno, we'll use the REST approach
// or generate a basic token. For production, use the Agora token builder.

function generateUid(): number {
  return Math.floor(Math.random() * 100000) + 1;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) throw new Error("Unauthorized");

    const { call_id, channel } = await req.json();
    if (!call_id || !channel) throw new Error("call_id and channel required");

    // Verify user is participant in this call
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: call, error: callErr } = await admin
      .from("calls")
      .select("id, caller_id, callee_id, agora_channel")
      .eq("id", call_id)
      .single();

    if (callErr || !call) throw new Error("Call not found");
    if (call.caller_id !== user.id && call.callee_id !== user.id) {
      throw new Error("Not a participant in this call");
    }
    if (call.agora_channel !== channel) {
      throw new Error("Channel mismatch");
    }

    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");

    const uid = generateUid();

    if (!appId || !appCertificate) {
      return new Response(
        JSON.stringify({ error: "Video service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For production with App Certificate, we need to generate a proper token.
    // Using a temporary token approach: if no certificate logic available,
    // return appId + uid and let client join with null token (works when no certificate is enabled)
    // When certificate IS set, the client needs a real token.
    // For MVP, we return the appId and let the client handle it.
    // TODO: Implement proper RtcTokenBuilder when agora-token Deno package is available

    return new Response(
      JSON.stringify({
        token: null, // null token works with Agora when App Certificate is not enforced
        appId,
        uid,
        channel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
