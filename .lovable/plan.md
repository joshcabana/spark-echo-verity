

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
  - `stripe-webhook`: idempotency via `stripe_processed_events` table + `stripe_customer_id` on profiles for deterministic lookup + paginated user search fallback
  - `ai-moderate`: auth-gated with call participation verification
  - All edge functions return generic errors to clients; log details server-side
- **Realtime subscriptions** for drops, RSVPs, calls, and messages
- **Storage bucket** (`verifications`) with private access and user-scoped RLS for selfie uploads
- **Admin dashboard wired to real data** — moderation_flags, appeals, profiles, platform_stats, rooms, runtime_alert_events all queried live
- **Transparency page wired to real data** — platform_stats queried live for stats, gender balance, safety report
- **Code splitting implemented** — React.lazy for LiveCall, SparkHistory, Chat, TokenShop, Admin, Transparency, Appeal
- **Lobby footer text fixed** — "AI-moderated in real time" → "Safety first" to match header claim

### In Progress / Known Gaps

1. **AI moderation is a stub** — `ai-moderate` returns `Math.random() * 0.3` and never flags. The Lovable AI key is configured; wiring real moderation is the next logical step.

2. **`any` type usage** — widespread across Lobby.tsx (drops, rsvpCounts), AuthContext (profile), and edge function responses.

3. **No dedicated profile page** — BottomNav "Profile" goes to `/lobby`, user icon goes to `/tokens`. There is no `/profile` route.

4. **Settings section in Admin uses static defaults** — not wired to a settings table or config store.

## Challenges and Mitigations

| Challenge | Status | Mitigation |
|-----------|--------|------------|
| Payment security (open redirects, unauthenticated checkout) | Resolved | JWT auth + price allowlist + origin allowlist on create-checkout and customer-portal |
| Webhook idempotency (double-crediting) | Resolved | `stripe_processed_events` table with PK on event_id |
| Agora stub tokens | Resolved | Real `RtcTokenBuilder.buildTokenWithUid` with 10-min expiry |
| AI moderation stub | Open | Function is auth-gated but returns random safe scores; needs real provider integration |
| Admin mock data | Resolved | All admin sections wired to real Supabase queries |
| User lookup fragility in webhook | Resolved | Paginated search through all users instead of first 50 only |
| Bundle size (>2.5 MB) | Resolved | Code-splitting with `React.lazy` for 7 heavy routes |
| TypeScript `any` usage | Open | Needs typed Supabase response models throughout |

## Recommended Next Steps (Priority Order)

1. **Implement real AI moderation** — use the configured Lovable AI key to power `ai-moderate` with actual content analysis
2. **Create /profile page** — dedicated profile management with display name, avatar, verification status
3. **Fix TypeScript `any` usage** — add proper types for drops, rsvpCounts, profile in AuthContext
4. **Wire Admin settings to a config table** — persist moderation thresholds and call duration settings
