

# Security Hardening Plan — 5 Remaining Findings

## 1. `create-checkout` — Auth + Price Allowlist + URL Allowlist (HIGH)

**File:** `supabase/functions/create-checkout/index.ts` — full rewrite

- Add JWT authentication (same pattern as customer-portal: parse Authorization header, getUser)
- Use authenticated user's email instead of accepting `customer_email` from body
- Hardcode an allowlist of valid Stripe price IDs (or use a `price_id → { tokens, mode }` map):
  ```
  const PRICE_MAP = {
    "price_starter_10": { mode: "payment" },
    "price_popular_15": { mode: "payment" },
    "price_value_30": { mode: "payment" },
    "price_pass_monthly": { mode: "subscription" },
    "price_pass_annual": { mode: "subscription" },
  };
  ```
  Reject any price_id not in the map. Derive `mode` from the map instead of `price_id.includes("sub")`.
- For `success_url` / `cancel_url`: build them server-side from an allowlisted origin list (the published URL + preview URL). Do NOT accept arbitrary URLs from the client. Remove `urlRegex` acceptance.
- Remove `customer_email` from request body entirely.

## 2. `customer-portal` — Open Redirect Fix (HIGH)

**File:** `supabase/functions/customer-portal/index.ts` — lines 70-72

Replace the `return_url.startsWith("http")` check with an origin allowlist:
```typescript
const ALLOWED_ORIGINS = [
  "https://spark-echo-verity.lovable.app",
  "https://id-preview--a81e90ba-a208-41e2-bf07-a3adfb94bfcb.lovable.app",
];
const origin = req.headers.get("origin") || "";
const safeReturnUrl = (typeof return_url === "string" && ALLOWED_ORIGINS.some(o => return_url.startsWith(o)))
  ? return_url
  : `${ALLOWED_ORIGINS[0]}/tokens`;
```

## 3. `agora-token` — Real Token Generation + Generic Errors (MED/HIGH)

**File:** `supabase/functions/agora-token/index.ts` — full rewrite

- Import `npm:agora-token` to use `RtcTokenBuilder` and `RtcRole`
- Generate a real token with ~10 min expiry using `buildTokenWithUid`
- Replace the catch block's `error.message` leak with a generic `"An error occurred"` message; log the real error with `console.error`

## 4. `stripe-webhook` — Idempotency + Customer ID Mapping (MED/HIGH)

**File:** `supabase/functions/stripe-webhook/index.ts` — significant rewrite

**New migration:** Create `stripe_processed_events` table for idempotency:
```sql
CREATE TABLE public.stripe_processed_events (
  event_id text PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.stripe_processed_events ENABLE ROW LEVEL SECURITY;
-- No user-facing RLS needed; only service role writes
```

**Also add** `stripe_customer_id text` column to `profiles` table.

**Webhook logic changes:**
- On event receipt, INSERT into `stripe_processed_events`. If conflict (already exists), return `{ received: true }` immediately (idempotent).
- In `checkout.session.completed`: look up user by `session.customer` (Stripe customer ID) against `profiles.stripe_customer_id`. If not found, fall back to expanding the customer object to get email, then query `auth.admin.listUsers` with proper filter. Store `stripe_customer_id` on the profile for future lookups.
- For `customer.subscription.deleted`: use `sub.customer` (always present) to look up by `stripe_customer_id`.
- Use the price ID → entitlement map (same as create-checkout) instead of amount thresholds for token grants.

## 5. `ai-moderate` — Remove False Safety Claim (HIGH integrity)

**File:** `src/pages/Lobby.tsx` — line 179

Change `"AI safety on"` to `"Safety first"` — this is accurate (safety pledge, blocking, reporting exist) without implying real-time AI moderation that doesn't exist yet.

The `ai-moderate` function itself is auth-gated and behind a call participation check, so it's not a direct exploit vector. The stub logic stays as-is until real AI moderation is wired, but the UI must not claim active AI moderation.

---

## Implementation Order

1. DB migration: `stripe_processed_events` table + `stripe_customer_id` on profiles
2. `create-checkout` rewrite (auth + allowlist)
3. `customer-portal` open redirect fix
4. `agora-token` real token generation
5. `stripe-webhook` idempotency + customer ID mapping
6. Lobby.tsx copy fix

## Required Secrets

No new secrets needed — `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` all already configured.

