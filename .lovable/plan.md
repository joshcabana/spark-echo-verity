

# Comprehensive Project Examination — Spark Echo Verity

## Primary Objectives and Intended Outcomes

Verity is a verified, anonymous speed-dating platform that replaces swipe-based dating with scheduled 45-second video "Drops" and a mutual-spark reveal mechanic. Six core objectives:

1. **Authentic first impressions** — live voice/video instead of curated profiles
2. **Zero ghosting by design** — mutual-spark gate; no rejection signals ever sent
3. **Safety first** — AI moderation, phone+selfie verification, safety pledge, user blocking
4. **Privacy by default** — anonymous until mutual spark; call content never stored
5. **Radical transparency** — public safety/moderation stats on a dedicated page
6. **Intention over addiction** — no infinite scroll, no streaks, no dopamine loops

## Strategic Plan, Methodology, and Milestones

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind/shadcn-ui (frontend), Lovable Cloud / Supabase (backend), Agora RTC (video), Stripe (payments), Framer Motion (animations).

**Timeline (relative to current date Feb 27, 2026):**

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 — Core Platform | Done | Auth, onboarding, lobby, drops, RSVP, matchmaking, 45s video calls, spark/pass, chat |
| Phase 2 — Safety & Infra | Done | AI moderation scaffold, user blocking, selfie storage, admin dashboard, transparency page, appeals |
| Phase 3 — Payments | Done | Token shop, Stripe checkout, subscriptions, customer portal, webhook handler |
| Phase 4 — Innovations | Roadmap | Spark Reflection, Voice Intro, Guardian Net, Chemistry Replay, Friendfluence Drops |
| Security Hardening | Done | 5 critical fixes across edge functions + DB migration for idempotency |

## Current Progress

### Completed

- **19 database tables** with RLS enabled on all, appropriate policies for user-scoped, admin-scoped, and public data
- **10 edge functions**: `find-match`, `agora-token`, `ai-moderate`, `admin-moderation`, `submit-appeal`, `spark-extend`, `create-checkout`, `customer-portal`, `check-subscription`, `stripe-webhook`
- **12 pages**: Landing, Auth, Onboarding (8-step flow), Lobby, LiveCall, SparkHistory, Chat, TokenShop, Admin (5 sections), Transparency, Appeal, NotFound
- **Security hardening complete**:
  - `create-checkout`: JWT auth + price ID allowlist + server-side URL construction
  - `customer-portal`: origin allowlist for return_url (no more open redirect)
  - `agora-token`: real RTC token generation via `RtcTokenBuilder` with 10-min expiry
  - `stripe-webhook`: idempotency via `stripe_processed_events` table + `stripe_customer_id` on profiles for deterministic lookup
  - `ai-moderate`: auth-gated with call participation verification
  - All edge functions return generic errors to clients; log details server-side
- **Realtime subscriptions** for drops, RSVPs, calls, and messages
- **Storage bucket** (`verifications`) with private access and user-scoped RLS for selfie uploads

### In Progress / Known Gaps

1. **AI moderation is a stub** — `ai-moderate` returns `Math.random() * 0.3` and never flags (score > 0.6 is unreachable). The Lobby footer still says "AI-moderated in real time" (line 237 of Lobby.tsx) even though line 179 was corrected to "Safety first". The Lovable AI key is now configured; wiring real moderation is the next logical step.

2. **Admin page uses entirely mock data** — All moderation queue items, appeals, analytics KPIs, charts, user lists, and alerts in `Admin.tsx` are hardcoded arrays (lines 21-55). None are wired to real database queries.

3. **Transparency page likely uses static data** — needs verification, but the PROJECT_OVERVIEW noted this.

4. **`stripe-webhook` email fallback is fragile** — `listUsers({ page: 1, perPage: 50 })` scans only the first 50 users by email. For >50 users this silently fails to find the match.

5. **Lobby.tsx line 237 inconsistency** — says "AI-moderated in real time" while line 179 correctly says "Safety first". These two claims contradict each other.

6. **`any` type usage** — widespread across Lobby.tsx (drops, rsvpCounts), AuthContext (profile), and edge function responses. Causes ESLint failures.

7. **Bundle size** — Vite warns about >2.5 MB bundle; Admin and LiveCall should use dynamic imports.

8. **No dedicated profile page** — BottomNav "Profile" goes to `/lobby`, user icon goes to `/tokens`. There is no `/profile` route.

## Challenges and Mitigations

| Challenge | Status | Mitigation |
|-----------|--------|------------|
| Payment security (open redirects, unauthenticated checkout) | Resolved | JWT auth + price allowlist + origin allowlist on create-checkout and customer-portal |
| Webhook idempotency (double-crediting) | Resolved | `stripe_processed_events` table with PK on event_id |
| Agora stub tokens | Resolved | Real `RtcTokenBuilder.buildTokenWithUid` with 10-min expiry |
| AI moderation stub | Open | Function is auth-gated but returns random safe scores; needs real provider integration |
| Admin mock data | Open | All admin sections use hardcoded arrays; need to wire to real DB queries |
| User lookup fragility in webhook | Open | `listUsers` only checks first 50; should use Supabase admin API with email filter or store mapping at signup |
| Bundle size (>2.5 MB) | Open | Needs code-splitting with `React.lazy` for heavy routes |
| TypeScript `any` usage | Open | Needs typed Supabase response models throughout |

## Adjustments Made

1. Security hardening was promoted from a later sprint to immediate — all 5 critical findings resolved before any public launch
2. "AI safety on" claim changed to "Safety first" in the lobby header (though the footer text still claims real-time AI moderation)
3. `stripe_customer_id` mapping added to profiles for deterministic webhook processing instead of email-only lookup
4. Customer portal rewritten with JWT auth (previously accepted email from request body)

## Recommended Next Steps (Priority Order)

1. **Fix Lobby.tsx line 237** — change "AI-moderated in real time" to match the "Safety first" claim
2. **Wire Admin dashboard to real data** — replace mock arrays with Supabase queries for moderation_flags, appeals, profiles, and platform_stats
3. **Implement real AI moderation** — use the configured Lovable AI key to power `ai-moderate` with actual content analysis
4. **Fix webhook user lookup** — use Supabase admin `listUsers` with email filter parameter instead of scanning first 50
5. **Add code splitting** — `React.lazy` for Admin, LiveCall, TokenShop routes
6. **Create /profile page** — dedicated profile management with display name, avatar, verification status

