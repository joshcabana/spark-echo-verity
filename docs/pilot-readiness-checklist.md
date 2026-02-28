# Verity Pilot Readiness Checklist

Date: February 28, 2026

## Build And Quality Gates

- [ ] `npm ci` succeeds
- [ ] `npm run lint` succeeds with zero errors
- [ ] `npm run test` succeeds
- [ ] `npx tsc -b` succeeds
- [ ] `npm run build` succeeds

## Core Flow Smoke (Pass/Fail)

### Onboarding And Access

- [ ] Unauthenticated user navigating to `/lobby` is redirected to `/auth`
- [ ] Authenticated user without onboarding completion is redirected to `/onboarding`
- [ ] Completed onboarding user can access `/lobby`

### Matchmaking

- [ ] User can join live drop and receive `queued` status
- [ ] Two users in same live drop produce exactly one call pair
- [ ] No duplicate call records are created for the same pair in the same drop window

### Live Call Moderation

- [ ] Moderation function is invoked every 15 seconds during live phase
- [ ] Transcript snippets are sent when browser speech APIs are available
- [ ] Metadata-only fallback works without errors when speech APIs are unavailable

### Payments

- [ ] Authenticated request to `customer-portal` returns a valid session URL
- [ ] Invalid `return_url` input always falls back to allowlisted default URL
- [ ] Stripe webhook duplicate event IDs do not re-credit tokens

## Truthfulness And UX

- [ ] Landing safety copy matches implemented behavior
- [ ] Guardian Net UI clearly marked preview/beta
- [ ] Spark Extend UI clearly marked preview/beta
- [ ] Appeal voice-note controls clearly marked coming soon
- [ ] `PROJECT_OVERVIEW.md` table/function counts match schema and code

## External Operational Checks (Manual)

- [ ] Supabase secrets configured in target environment (`STRIPE_*`, `AGORA_*`, `LOVABLE_API_KEY`)
- [ ] Stripe webhook endpoint configured and events subscribed
- [ ] `platform_stats` scheduled aggregation job deployed
- [ ] CI/deploy pipelines use npm as canonical package manager
