
# Security Hardening Plan — Status: ✅ All Complete

## Summary

All 5 security findings identified during the pre-launch audit have been resolved. The implementation was completed as part of the "Enhance security and infra" commit.

---

## 1. `create-checkout` — Auth + Price Allowlist + URL Allowlist (HIGH) ✅ Done

**File:** `supabase/functions/create-checkout/index.ts` — full rewrite

- ✅ JWT authentication added (parses Authorization header, calls `getUser`)
- ✅ User's email derived from the authenticated session (not from request body)
- ✅ Hardcoded `PRICE_MAP` allowlist — invalid price IDs rejected with 400
- ✅ `success_url` / `cancel_url` built server-side from `ALLOWED_ORIGINS`; no arbitrary client URLs accepted
- ✅ `customer_email` removed from request body

## 2. `customer-portal` — Open Redirect Fix (HIGH) ✅ Done

**File:** `supabase/functions/customer-portal/index.ts` — lines 73-76

- ✅ `return_url` validated against `ALLOWED_ORIGINS`; falls back to `${ALLOWED_ORIGINS[0]}/tokens`

## 3. `agora-token` — Real Token Generation + Generic Errors (MED/HIGH) ✅ Done

**File:** `supabase/functions/agora-token/index.ts` — full rewrite

- ✅ Uses `npm:agora-token@2.0.4` with `RtcTokenBuilder` and `RtcRole`
- ✅ Real token generated with 10-minute expiry via `buildTokenWithUid`
- ✅ Call-participation check: only verified call participants receive a token
- ✅ Error handler uses generic `"An error occurred"` message; real error logged with `console.error`

## 4. `stripe-webhook` — Idempotency + Customer ID Mapping (MED/HIGH) ✅ Done

**File:** `supabase/functions/stripe-webhook/index.ts` — significant rewrite  
**Migration:** `20260227121650_809f5cc5-7272-4a9b-9512-bc15c53c4b76.sql`

- ✅ `stripe_processed_events` table created (primary key on `event_id`) for idempotency
- ✅ Duplicate webhook events return `{ received: true }` immediately
- ✅ `stripe_customer_id` column added to `profiles` with index
- ✅ Profile lookup uses `stripe_customer_id` first; falls back to email lookup and stores ID for future calls
- ✅ Entitlements derived from `PRICE_ENTITLEMENTS` map (consistent with `create-checkout` `PRICE_MAP`)

## 5. `ai-moderate` — Remove False Safety Claim (HIGH integrity) ✅ Done

**File:** `src/pages/Lobby.tsx` — line 179

- ✅ Changed from `"AI safety on"` to `"Safety first"` — accurate without implying real-time AI moderation that is not yet wired

---

## Implementation Order (Completed)

1. ✅ DB migration: `stripe_processed_events` table + `stripe_customer_id` on profiles
2. ✅ `create-checkout` rewrite (auth + allowlist)
3. ✅ `customer-portal` open redirect fix
4. ✅ `agora-token` real token generation
5. ✅ `stripe-webhook` idempotency + customer ID mapping
6. ✅ Lobby.tsx copy fix

## Required Secrets

No new secrets needed — `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` all already configured.

