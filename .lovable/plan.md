

# Verity vNext — Real End-to-End Loop Implementation Plan

## Overview
Replace all simulated/mock flows with real Supabase + Agora-backed logic. After this update, the core loop works: Drop → Match → 45s Video Call → Spark/Pass → Chat.

---

## Phase 1: Database Migrations

### Migration 1: matchmaking_queue enhancements + user_blocks
```sql
-- Add drop_id and call_id to matchmaking_queue
ALTER TABLE public.matchmaking_queue ADD COLUMN drop_id uuid REFERENCES public.drops(id) ON DELETE CASCADE;
ALTER TABLE public.matchmaking_queue ADD COLUMN call_id uuid REFERENCES public.calls(id);
ALTER TABLE public.matchmaking_queue ADD CONSTRAINT matchmaking_queue_user_drop_unique UNIQUE(user_id, drop_id);
CREATE INDEX idx_matchmaking_queue_drop_status ON public.matchmaking_queue(drop_id, status, joined_at);

-- user_blocks table
CREATE TABLE public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
-- RLS: users manage own blocks
CREATE POLICY "Users can insert own blocks" ON public.user_blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can view own blocks" ON public.user_blocks FOR SELECT USING (auth.uid() = blocker_id);
CREATE POLICY "Users can delete own blocks" ON public.user_blocks FOR DELETE USING (auth.uid() = blocker_id);

-- Storage bucket for selfie verifications
INSERT INTO storage.buckets (id, name, public) VALUES ('verifications', 'verifications', false);
CREATE POLICY "Users can upload own selfies" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'verifications' AND (storage.foldername(name))[1] = 'selfies' AND (storage.foldername(name))[2] = auth.uid()::text);
CREATE POLICY "Users can view own selfies" ON storage.objects FOR SELECT USING (bucket_id = 'verifications' AND (storage.foldername(name))[2] = auth.uid()::text);
```

---

## Phase 2: Edge Function — `find-match` (real implementation)

Rewrite `supabase/functions/find-match/index.ts`:
- Authenticate user from JWT
- Create Supabase client with SERVICE_ROLE_KEY
- Validate drop exists and status is "live"
- Upsert user into matchmaking_queue (user_id, room_id, drop_id, status: "waiting")
- Use `FOR UPDATE SKIP LOCKED` in a single query to find oldest waiting user in same drop (excluding self, excluding blocked users in either direction via user_blocks)
- If match found: create `calls` row, update both queue entries to "matched" with call_id, return `{ status: "matched", call_id, agora_channel }`
- If no match: return `{ status: "queued" }`

---

## Phase 3: Edge Function — `agora-token` (real implementation)

Rewrite `supabase/functions/agora-token/index.ts`:
- Authenticate user from JWT
- Accept `{ call_id, channel }`
- Verify user is caller_id or callee_id on the call
- Generate real RTC token using `agora-token` npm package (via `npm:agora-token`)
- Use AGORA_APP_ID + AGORA_APP_CERTIFICATE secrets
- Return `{ token, uid, appId }` with ~10 min TTL

**Note:** AGORA_APP_ID and AGORA_APP_CERTIFICATE secrets must be added by user.

---

## Phase 4: Routing — `/call/:callId`

### `src/App.tsx`
- Change route from `/call` to `/call/:callId`

---

## Phase 5: Lobby + DropCard — Join Live Drop

### `src/pages/Lobby.tsx`
- Add `userTrust` from AuthContext
- Add `onJoin(drop)` handler that:
  1. Checks trust requirements (phone_verified, selfie_verified, safety_pledge_accepted)
  2. Opens matchmaking overlay with drop_id
  3. Calls `supabase.functions.invoke("find-match", { body: { drop_id, room_id } })`
  4. If matched: navigate to `/call/${call_id}?channel=${channel}`
  5. If queued: keep overlay open
- Pass `onJoin`, `userTrust` to DropCard

### `src/components/lobby/DropCard.tsx`
- Add `onJoin` prop
- When drop is live + user is RSVP'd + trust complete: show "Join live Drop" button
- When trust incomplete: show disabled button + "Complete verification" link
- Keep RSVP/Cancel for upcoming drops

### `src/components/lobby/MatchmakingOverlay.tsx`
- Add `drop_id` prop, remove simulated navigation
- Poll matchmaking_queue every 2s for user's row in this drop
- When `call_id` appears: fetch call, navigate to `/call/${callId}?channel=${channel}`
- "Leave queue" deletes queue row
- Show safety line: "Anonymous until mutual spark · Safety on"

---

## Phase 6: Agora Hook + Real Video

### New: `src/hooks/useAgoraCall.ts`
- Install `agora-rtc-sdk-ng` dependency
- Create/join Agora client with token from edge function
- Publish local audio+video tracks
- Subscribe to remote user tracks
- Expose: `localVideoRef`, `remoteVideoRef`, `isRemoteConnected`, `leave()`, `toggleMic()`, `toggleCamera()`
- Cleanup on unmount

### `src/components/call/VideoArea.tsx`
- Accept `localVideoRef`, `remoteVideoRef`, `isRemoteConnected` props
- Render real video elements (remote full-screen, local PiP)
- Show "Connecting…" placeholder when remote not yet connected

---

## Phase 7: LiveCall — Real Calls + Decisions

### `src/pages/LiveCall.tsx`
- Read `callId` from route params, `channel` from query string
- Fetch call row from Supabase by callId
- Determine role (caller vs callee)
- Phase flow:
  - `connecting`: invoke agora-token, join Agora
  - `live`: 45s countdown from call.started_at or now()
  - `deciding`: show Spark/Pass buttons
  - On choice: UPDATE calls set caller_decision or callee_decision
  - `waiting`: subscribe to call row via Realtime
  - When both decisions present: check is_mutual_spark (set by existing DB trigger)
  - `mutual-spark` or `no-spark` (never reveal partner's specific choice)
- On mutual spark: query sparks table by call_id to find spark row, navigate to `/chat/${sparkId}`
- Add Report button in top bar (creates reports row)

---

## Phase 8: SparkHistory — Real Data

### `src/pages/SparkHistory.tsx`
- Replace `mockSparks` with Supabase query: `sparks` where user_a or user_b = auth.uid, joined with profiles for partner display_name
- Show first name only from partner's profile
- "Archived" filter uses `is_archived` flag
- Clicking a spark navigates to `/chat/${sparkId}`

### `src/components/sparks/SparkCard.tsx`
- Update interface to match Supabase spark shape (id, call_id, user_a, user_b, created_at, is_archived, partner_name)
- Remove dependency on mock Spark type

---

## Phase 9: Chat — Real Messages

### `src/pages/Chat.tsx`
- Replace mockMessages/mockSparks with Supabase queries
- Load spark by sparkId, determine partner user_id
- Load messages by spark_id, ordered by created_at
- Subscribe to realtime inserts on messages for this spark_id
- Send: insert into messages (spark_id, sender_id, content)
- Report: insert into reports (reporter_id, reported_user_id, reason)
- Block: insert into user_blocks (blocker_id, blocked_id), archive spark, navigate to /sparks

### `src/components/chat/MessageBubble.tsx`
- Update interface: use `sender_id` string (compared to auth.uid) instead of "me"/"them"

---

## Phase 10: Onboarding — Expand to 8 Steps

### `src/pages/Onboarding.tsx`
- TOTAL_STEPS = 8
- Steps: 0-Welcome, 1-AgeGate, 2-SignIn, 3-PhoneVerify, 4-Selfie, 5-SafetyPledge (NEW), 6-Preferences (remove pledge from it), 7-DropReady (NEW)

### New: `src/components/onboarding/SafetyPledgeStep.tsx`
- Title: "One promise before you enter."
- 3 safety bullets + required checkbox
- On continue: write safety_pledge_accepted=true

### New: `src/components/onboarding/DropReadyStep.tsx`
- Title: "You're verified. Pick your first Drop."
- Show 3 soonest upcoming drops from Supabase
- RSVP on tap
- "RSVP & go to lobby" / "Skip" buttons
- On complete: mark onboarding_complete=true, navigate /lobby

### `src/components/onboarding/PreferencesStep.tsx`
- Remove safety pledge section (moved to SafetyPledgeStep)

### `src/components/onboarding/SelfieStep.tsx`
- Implement real camera capture via getUserMedia + canvas
- Upload to `verifications` storage bucket
- Set selfie_verified=true on successful upload

---

## Phase 11: ProtectedRoute — Enforce Onboarding

### `src/components/ProtectedRoute.tsx`
- If logged in but `!onboardingComplete`: redirect to `/onboarding`
- Exception: if current path is `/onboarding`, allow through

### `src/contexts/AuthContext.tsx`
- Add realtime subscription to `user_trust` for logged-in user to keep state fresh

---

## Phase 12: Auth.tsx — Redirect Logic

### `src/pages/Auth.tsx`
- After login: check userTrust.onboarding_complete
- If incomplete → `/onboarding`
- If complete → `/lobby`

---

## Required Secrets (user must add)
- `AGORA_APP_ID` — Agora project App ID
- `AGORA_APP_CERTIFICATE` — Agora App Certificate for token generation

## New Dependency
- `agora-rtc-sdk-ng` — Agora Web SDK for real-time video

## Files Created
- `src/hooks/useAgoraCall.ts`
- `src/components/onboarding/SafetyPledgeStep.tsx`
- `src/components/onboarding/DropReadyStep.tsx`

## Files Modified
- `supabase/functions/find-match/index.ts` (full rewrite)
- `supabase/functions/agora-token/index.ts` (full rewrite)
- `src/App.tsx` (route change)
- `src/pages/Lobby.tsx` (join flow)
- `src/components/lobby/DropCard.tsx` (join button)
- `src/components/lobby/MatchmakingOverlay.tsx` (real polling)
- `src/components/call/VideoArea.tsx` (real video)
- `src/pages/LiveCall.tsx` (full rewrite)
- `src/pages/SparkHistory.tsx` (Supabase data)
- `src/components/sparks/SparkCard.tsx` (new interface)
- `src/pages/Chat.tsx` (Supabase data + realtime)
- `src/components/chat/MessageBubble.tsx` (new interface)
- `src/pages/Onboarding.tsx` (8 steps)
- `src/components/onboarding/PreferencesStep.tsx` (remove pledge)
- `src/components/onboarding/SelfieStep.tsx` (real capture)
- `src/components/ProtectedRoute.tsx` (enforce onboarding)
- `src/contexts/AuthContext.tsx` (realtime trust)
- `src/pages/Auth.tsx` (redirect logic)

