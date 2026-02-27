# Spark Echo Verity – Project Examination

## Primary objectives and intended outcomes
- Deliver a verified, safety-first speed-dating experience built around 45-second anonymous video drops and a mutual Spark/Pass reveal model.
- Reduce swipe fatigue by replacing profiles and infinite scroll with scheduled “Drops,” human voice/eye contact, and dignity-preserving privacy defaults.
- Embed trust and accountability via real-time AI safety, transparent metrics, and a fair appeals pipeline.
- Prove a path to sustainable revenue through token packs and Verity Pass subscriptions without introducing dark-pattern engagement loops.

## Strategy, methodology, and timeline
- Approach: Pair a lightweight React + Supabase + Agora stack with real-time safety and clear governance (appeals, admin moderation, transparency). Ship in weekly slices that move end-to-end user value, not isolated components.
- Resources:
  - Frontend: React 18, Vite, React Router, React Query, shadcn/ui + Tailwind, Framer Motion for motion, Sonner for toasts.
  - Backend: Supabase Postgres + RLS, edge functions for matchmaking (`find-match`), video auth (`agora-token`), AI moderation (`ai-moderate`), appeals (`submit-appeal`), payments (`create-checkout`, `customer-portal`, `stripe-webhook`), and drop/tokens management.
  - Third parties: Agora for low-latency video; Stripe for token packs and subscriptions; (placeholder) AI moderation provider to be wired into `ai-moderate`.
- Timeline and milestones (dates relative to current week of Feb 24, 2026):
  - ✅ Foundation (done): Landing narrative, auth/onboarding shell, Supabase schemas for drops/calls/appeals/reports, Stripe/Agora functions scaffolded, transparency page.
  - 🟠 Current sprint (Feb 24–Mar 7): Harden trust gates (phone/selfie/pledge in `AuthContext` + onboarding), stabilize drop RSVP + matchmaking queue (`find-match`), ensure Agora token issuance flow works in LiveCall.
  - 🔜 Next sprint (Mar 8–Mar 21): Replace `ai-moderate` stub with production provider, tune safety thresholds, wire reporting → appeals dashboard, and validate Guardian Net + Safe Exit in live calls.
  - 🔜 Pilot & telemetry (Mar 22–Apr 4): Run limited Drops, track spark conversion/appeals/moderation rates, and surface real metrics on Transparency/Admin.
  - 🔜 Monetization hardening (Apr 5–Apr 18): Finalize token shop pricing guardrails, verify subscription lifecycle via `stripe-webhook`, and add retention hooks (Spark History → Chat → Voice Intro flow).

## Current progress and status
- Completed
  - Landing/marketing story with safety/privacy positioning (Hero, Stats, Features, Innovations sections).
  - Drop discovery and RSVP flow in `Lobby` using Supabase queries, filters, and realtime updates; matchmaking queue + call creation handled by `find-match`.
  - Live call loop (`LiveCall` + `useAgoraCall`): Agora credential issuance, 45s timer, Spark/Pass capture, mutual-spark reveal, Guardian Net, Safe Exit, and reporting.
  - Token monetization scaffolding: Token shop UI, Stripe checkout/session creation, subscription checks, and customer portal endpoints.
  - Governance surface: Transparency dashboard, Admin moderation/appeals/analytics views, and `submit-appeal` edge function.
- In progress
  - AI moderation is stubbed (random score in `ai-moderate`); needs provider integration and policy tuning.
  - Trust signals (phone/selfie/safety pledge) enforced in lobby matchmaking but require full onboarding completion to unblock Drops.
  - Observability for real metrics: Transparency/Admin currently show static data; needs wiring to Supabase aggregates.
- Upcoming
  - Spark reflection/voice-intro/chemistry replay flows after mutual spark.
  - Friendfluence/room-level social joining and more granular drop scheduling controls.

## Challenges and mitigations
- Lint/type debt: ESLint currently fails on `any` usage across onboarding/lobby/live-call and on Fast Refresh warnings. Mitigation: add typed Supabase response models and move shared constants out of component files; outside scope of this doc.
- AI safety placeholder: `ai-moderate` returns random scores; production requires a vetted moderation provider, rate limits, and human-review feedback loop.
- Dependency drift: package-lock and package.json were initially out of sync (npm ci fails); npm install (no lockfile changes) works locally. Plan to regenerate lockfile with the intended toolchain to stabilize CI.
- Performance: Vite build emits a >2.5 MB bundle warning; consider chunking heavy routes (Admin, LiveCall) with dynamic imports.
- Configuration sensitivity: Agora/Stripe/Supabase environment variables are mandatory for LiveCall and checkout flows; ensure deployment secrets are present per environment before pilots.

## Adjustments made to stay on track
- Centered the product on scheduled Drops with mutual-spark reveal to minimize rejection harm and dopamine loops.
- Added transparency and appeals surfaces early (before GA) to build trust and provide governance for AI decisions.
- Gated live participation behind verification signals (phone, selfie, safety pledge) to reduce fraud and bad actors during pilot.

## Progress validation
- Lint: `npm run lint` currently fails on pre-existing TypeScript `any` usage and Fast Refresh warnings (no changes made in this work).
- Tests: `npm run test` passes (Vitest).
- Build: `npm run build` succeeds with bundle-size warnings noted above.
