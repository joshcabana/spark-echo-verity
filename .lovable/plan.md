

# Implementation Plan — Profile Page + TokenShop Wiring + AI Moderation Testing

## 1. Create `/profile` page

**New file:** `src/pages/Profile.tsx`

- Display user's avatar (from `profiles.avatar_url`) with upload capability using the existing `verifications` storage bucket (or create a public `avatars` bucket)
- Editable display name field (updates `profiles.display_name`)
- Verification status badges from `user_trust` (phone, selfie, safety pledge)
- Token balance from `profiles.token_balance`
- Subscription tier + expiry from `profiles.subscription_tier` / `profiles.subscription_expires_at`
- "Manage subscription" button that invokes `customer-portal` edge function
- Sign out button
- Uses `useAuth()` context for initial data, `useMutation` for updates

**New migration:** Create public `avatars` storage bucket with user-scoped RLS policies for upload/read.

**Edit:** `src/App.tsx` — add lazy-loaded `/profile` route  
**Edit:** `src/components/BottomNav.tsx` — change Profile tab path from `/lobby` to `/profile`  
**Edit:** `src/pages/Lobby.tsx` — change user icon navigation from `/tokens` to `/profile`

## 2. Wire TokenShop to real Stripe checkout

**Edit:** `src/pages/TokenShop.tsx`

- Import `useAuth` to get real `profile.token_balance` and `profile.subscription_tier`
- Add `price_id` to each token pack config: `"price_starter_10"`, `"price_popular_15"`, `"price_value_30"`
- Replace `handleBuyTokens` with `supabase.functions.invoke("create-checkout", { body: { price_id } })` → redirect to `data.url`
- Replace `handleSubscribe` with same invoke using `billingCycle === "monthly" ? "price_pass_monthly" : "price_pass_annual"`
- Wire "Manage subscription" button to invoke `customer-portal` → redirect to `data.url`
- Handle `?success=true` query param on mount to show `PurchaseSuccess`
- Add loading states during checkout creation

## 3. AI moderation testing

Since end-to-end testing of `ai-moderate` requires two authenticated users in a live call (participation check), this cannot be fully automated. The function is already deployed. Instead, the plan confirms the wiring is complete and suggests manual verification steps post-implementation.

## Implementation Order

1. DB migration: `avatars` storage bucket
2. Create `Profile.tsx`
3. Update routing (`App.tsx`, `BottomNav.tsx`, `Lobby.tsx`)
4. Wire `TokenShop.tsx` to real checkout

