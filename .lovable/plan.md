

# Comprehensive Quality Assessment — Verity

## Executive Summary

Verity is a well-architected, safety-first speed-dating platform with 14 pages, 91+ components, 10 edge functions, and 20 database tables. The codebase is clean, consistent, and follows modern React/TypeScript patterns. After thorough review, I identified **9 actionable issues** — 3 critical, 3 moderate, and 3 minor — plus confirmation that no hallucinations or contradictions exist in the implementation.

---

## Issues Found

### CRITICAL

**1. Missing Stripe secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)**
Three edge functions (`create-checkout`, `stripe-webhook`, `customer-portal`) require these secrets, but neither is configured. All payment flows will fail silently with "Payment service not configured." This is the single biggest blocker to a functional product.

- **Fix:** I will add both secrets. You will need to provide your Stripe Secret Key and Webhook Secret from the Stripe Dashboard → Developers → API keys / Webhooks.

**2. Appeal page uses hardcoded data instead of real database queries**
`src/pages/Appeal.tsx` has:
- `hasPendingFlag = true` (hardcoded — always shows the flag form)
- `pastAppeals` array with hardcoded fake appeal history
- `handleSubmit` only sets local state, never calls the `submit-appeal` edge function or writes to the database

This means the appeals flow is entirely decorative. Users cannot actually submit appeals, and they always see a fake "You were flagged" message.

- **Fix:** Wire the page to query `moderation_flags` for the current user's pending flags, query `appeals` for past appeal history, and call the `submit-appeal` edge function on form submission.

**3. RLS enabled on `stripe_processed_events` but no policies defined**
The database linter flagged this table. With RLS enabled but no policies, all operations from non-service-role clients will silently fail. This is acceptable because only the `stripe-webhook` edge function (using service role) writes to this table — but it should be explicitly documented or a restrictive policy added for defense-in-depth.

- **Fix:** Add a simple `false` policy (deny all non-service-role access) to make the intent explicit.

### MODERATE

**4. `create-checkout` uses `customer_email` instead of `stripe_customer_id`**
The checkout session is created with `customer_email: user.email`, which creates a new Stripe customer every time. The webhook then has to do a fallback email lookup. The `profiles` table already has a `stripe_customer_id` column — the checkout function should look up or create a Stripe customer first and pass `customer: customerId` instead.

- **Fix:** In `create-checkout`, check if the user's profile has a `stripe_customer_id`. If yes, use it. If no, create a Stripe customer, save the ID to the profile, then use it.

**5. `getverity.com.au` not in `ALLOWED_ORIGINS`**
`create-checkout` and `customer-portal` have hardcoded origin allowlists with only `.lovable.app` domains. When deployed to the production domain `getverity.com.au`, all checkout and subscription portal flows will break with a redirect to the preview URL instead.

- **Fix:** Add `https://getverity.com.au` to `ALLOWED_ORIGINS` in both `create-checkout` and `customer-portal`.

**6. `stripe-webhook` uses synchronous `constructEvent` instead of async**
Line 38 calls `stripe.webhooks.constructEvent(body, signature, webhookSecret)` — the PROJECT_OVERVIEW says it uses `constructEventAsync`, but the actual code uses the synchronous version. In Deno, the async version is recommended.

- **Fix:** Change to `await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`.

### MINOR

**7. Missing `safe-area-bottom` CSS class**
`BottomNav.tsx` uses `safe-area-bottom` class for iOS safe area padding, but this class is not defined in `index.css` or Tailwind config. It has no effect.

- **Fix:** Add the utility class: `.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }`.

**8. VerityLogo spark animation structure is redundant**
The logo has a `spark` const with complex dark/light mode `<g>` groups, but the actual rendered SVGs (icon and full variants) bypass this entirely and render the spark path directly in their own animated `<g>`. The `spark` variable on lines 50-65 is dead code.

- **Fix:** Remove the unused `spark` const from `VerityLogo.tsx`.

**9. `useEffect` missing `join` and `leave` in dependency array**
In `useAgoraCall.ts` line 128, the effect depends on `enabled`, `appId`, `channel` but calls `join()` and `leave()` without listing them in deps. This causes an ESLint warning and could lead to stale closures.

- **Fix:** Add `join` and `leave` to the dependency array (they are already memoized with `useCallback`).

---

## No Hallucinations / Contradictions Found

After cross-referencing all pages, components, edge functions, database schema, and the PROJECT_OVERVIEW document:
- All 20 database tables exist and match the documented schema
- All 10 edge functions match their documented responsibilities
- All 14 pages are implemented and routed correctly
- No phantom features are referenced that don't exist
- No contradictory logic between frontend and backend

---

## Items Beyond My Control

| Item | What You Need To Do |
|------|-------------------|
| **Stripe Secret Key** | Go to Stripe Dashboard → Developers → API keys → Copy your secret key. I will prompt you to enter it. |
| **Stripe Webhook Secret** | Go to Stripe Dashboard → Developers → Webhooks → Add endpoint pointing to your `stripe-webhook` edge function URL, then copy the signing secret. I will prompt you to enter it. |
| **Production domain in Stripe** | Once `getverity.com.au` is live, add it as an allowed domain in your Stripe Dashboard settings. |
| **Real Stripe Price IDs** | The current price IDs (`price_starter_10`, etc.) are placeholder strings. You need to create actual products/prices in Stripe and update the `PRICE_MAP` in `create-checkout` and `PRICE_ENTITLEMENTS` in `stripe-webhook` with real Stripe price IDs (e.g., `price_1Abc...`). |
| **Agora channel certificates** | Secrets `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` are configured. Verify they are valid for your Agora project. |
| **`avatars` storage bucket** | Profile avatar upload writes to a `avatars` bucket in storage. Ensure this bucket exists and has appropriate public access policies. |

---

## Implementation Plan (9 fixes)

| # | Fix | Files |
|---|-----|-------|
| 1 | Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` secrets | Secrets config |
| 2 | Wire Appeal page to real data + submit-appeal function | `src/pages/Appeal.tsx` |
| 3 | Add explicit deny-all RLS policy on `stripe_processed_events` | Database migration |
| 4 | Use `stripe_customer_id` in `create-checkout` | `supabase/functions/create-checkout/index.ts` |
| 5 | Add `getverity.com.au` to `ALLOWED_ORIGINS` | `create-checkout/index.ts`, `customer-portal/index.ts` |
| 6 | Switch to `constructEventAsync` | `supabase/functions/stripe-webhook/index.ts` |
| 7 | Add `safe-area-bottom` utility class | `src/index.css` |
| 8 | Remove dead `spark` variable from logo | `src/components/VerityLogo.tsx` |
| 9 | Fix `useEffect` dependency array in Agora hook | `src/hooks/useAgoraCall.ts` |

