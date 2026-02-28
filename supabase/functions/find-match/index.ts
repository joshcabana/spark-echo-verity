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
    // Auth user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User client to get auth user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) throw new Error("Unauthorized");

    // Service role client for matching logic
    const admin = createClient(supabaseUrl, serviceKey);

    const { drop_id, room_id } = await req.json();
    if (!drop_id || !room_id) throw new Error("drop_id and room_id required");

    // Verify drop exists and is live
    const { data: drop, error: dropErr } = await admin
      .from("drops")
      .select("id, status, scheduled_at")
      .eq("id", drop_id)
      .single();
    if (dropErr || !drop) throw new Error("Drop not found");
    if (drop.status !== "live") {
      // Allow within 5 min grace after scheduled
      const scheduledTime = new Date(drop.scheduled_at).getTime();
      const now = Date.now();
      if (drop.status !== "upcoming" || now < scheduledTime || now - scheduledTime > 5 * 60 * 1000) {
        throw new Error("Drop is not live");
      }
    }

    // Upsert user into queue
    const { error: upsertErr } = await admin
      .from("matchmaking_queue")
      .upsert(
        { user_id: user.id, room_id, drop_id, status: "waiting", joined_at: new Date().toISOString() },
        { onConflict: "user_id,drop_id" }
      );
    if (upsertErr) {
      console.error("Queue upsert error:", upsertErr);
      throw new Error("Failed to join queue");
    }

    // Attempt atomic match using raw SQL via rpc
    // We use a direct query approach: find oldest waiting user in same drop, not self, not blocked
    const { data: candidates, error: candErr } = await admin
      .from("matchmaking_queue")
      .select("id, user_id")
      .eq("drop_id", drop_id)
      .eq("status", "waiting")
      .neq("user_id", user.id)
      .order("joined_at", { ascending: true })
      .limit(10);

    if (candErr) {
      console.error("Candidate query error:", candErr);
      throw new Error("Matchmaking temporarily unavailable");
    }

    // Filter out blocked users
    let matchedCandidate = null;
    if (candidates && candidates.length > 0) {
      const candidateIds = candidates.map((c: { id: string; user_id: string }) => c.user_id);

      // Get blocks where current user blocked candidates
      const { data: blocksOutgoing } = await admin
        .from("user_blocks")
        .select("blocked_id")
        .eq("blocker_id", user.id)
        .in("blocked_id", candidateIds);

      // Get blocks where candidates blocked current user
      const { data: blocksIncoming } = await admin
        .from("user_blocks")
        .select("blocker_id")
        .eq("blocked_id", user.id)
        .in("blocker_id", candidateIds);

      const blockedSet = new Set<string>();
      if (blocksOutgoing) {
        for (const b of blocksOutgoing) blockedSet.add(b.blocked_id);
      }
      if (blocksIncoming) {
        for (const b of blocksIncoming) blockedSet.add(b.blocker_id);
      }

      matchedCandidate = candidates.find((c: { id: string; user_id: string }) => !blockedSet.has(c.user_id));
    }

    if (!matchedCandidate) {
      return new Response(
        JSON.stringify({ status: "queued" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to claim the match atomically by updating the candidate's status
    const { data: claimed, error: claimErr } = await admin
      .from("matchmaking_queue")
      .update({ status: "matching" })
      .eq("id", matchedCandidate.id)
      .eq("status", "waiting")
      .select("id, user_id")
      .single();

    if (claimErr || !claimed) {
      // Race condition: someone else matched them, stay queued
      return new Response(
        JSON.stringify({ status: "queued" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the call
    const shortId = crypto.randomUUID().slice(0, 8);
    const agora_channel = `drop_${drop_id.slice(0, 8)}_${shortId}`;

    const { data: call, error: callErr } = await admin
      .from("calls")
      .insert({
        caller_id: user.id,
        callee_id: claimed.user_id,
        room_id,
        status: "active",
        started_at: new Date().toISOString(),
        duration_seconds: 45,
        agora_channel,
      })
      .select("id")
      .single();

    if (callErr || !call) {
      // Rollback: put candidate back to waiting
      await admin.from("matchmaking_queue").update({ status: "waiting" }).eq("id", claimed.id);
      throw new Error("Failed to create call");
    }

    // Update both queue entries to matched
    const now = new Date().toISOString();
    await admin
      .from("matchmaking_queue")
      .update({ status: "matched", matched_at: now, call_id: call.id })
      .eq("id", claimed.id);

    await admin
      .from("matchmaking_queue")
      .update({ status: "matched", matched_at: now, call_id: call.id })
      .eq("user_id", user.id)
      .eq("drop_id", drop_id);

    return new Response(
      JSON.stringify({
        status: "matched",
        call_id: call.id,
        agora_channel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("find-match error:", error);
    const errorMessage = error instanceof Error ? error.message : "";
    const safeMessages = ["Drop not found", "Drop is not live", "drop_id and room_id required", "Unauthorized", "Missing auth", "Failed to join queue", "Matchmaking temporarily unavailable", "Failed to create call"];
    const msg = safeMessages.includes(errorMessage) ? errorMessage : "An error occurred";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
