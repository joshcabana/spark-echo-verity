

# Verity vNext — Drops + Onboarding Implementation Plan

## Scope (This Phase)
Transform the always-on Lobby into a **Drops model** (scheduled sessions) and add a **6-screen onboarding wizard** with progress persistence. Update Landing page copy. Show results after Lobby + Onboarding are complete.

---

## Database Changes (Single Migration)

New tables with RLS:

- **`drops`** — id, room_id (FK rooms), title, description, scheduled_at, duration_minutes, region, timezone, max_capacity, is_friendfluence, status (upcoming/live/ended), created_at
  - RLS: anyone can SELECT; admins can ALL

- **`drop_rsvps`** — id, drop_id (FK drops), user_id, friend_invite_code, rsvp_at, checked_in boolean
  - RLS: users can INSERT/SELECT/DELETE own; admins can ALL

- **`user_trust`** — id, user_id (unique), dob date, phone_verified boolean, selfie_verified boolean, safety_pledge_accepted boolean, onboarding_step integer, onboarding_complete boolean, preferences jsonb (interested_in, age_range, state, city, rooms), created_at, updated_at
  - RLS: users can INSERT/SELECT/UPDATE own

- **`push_subscriptions`** — id, user_id, endpoint text, p256dh text, auth text, created_at
  - RLS: users can INSERT/SELECT/DELETE own

- **`reports`** — id, reporter_id, reported_user_id, call_id, reason text, buffer_url text, status text (pending/reviewed/resolved), created_at, reviewed_at, reviewed_by
  - RLS: users can INSERT own; admins can ALL; users can SELECT own

- **`moderation_events`** — id, call_id, risk_score numeric, action_taken text, details jsonb, created_at
  - RLS: admins only

Enable realtime on `drops`, `drop_rsvps`.

Seed 3-5 initial drops across rooms for the next week (Australian timezones AEST/AEDT).

---

## New Files

### Onboarding Wizard
- **`src/pages/Onboarding.tsx`** — Master wizard container with progress bar (6 steps), manages step state, persists to `user_trust` table, ~90s completion target
- **`src/components/onboarding/WelcomeStep.tsx`** — "Meet someone real in 45 seconds" + 3 value bullets + Continue
- **`src/components/onboarding/AgeGateStep.tsx`** — DOB picker with 18+ hard gate, stores to user_trust.dob
- **`src/components/onboarding/SignInStep.tsx`** — Email OTP primary (supabase.auth.signInWithOtp), Google/Apple secondary via lovable.auth.signInWithOAuth
- **`src/components/onboarding/PhoneVerifyStep.tsx`** — Phone input + OTP verification (supabase.auth.signInWithOtp phone channel), required
- **`src/components/onboarding/SelfieStep.tsx`** — Liveness placeholder (camera prompt + "Later" skip allowed, sets selfie_verified flag)
- **`src/components/onboarding/PreferencesStep.tsx`** — Safety pledge toggle + interested_in (Men/Women/Everyone), age range slider, state/city dropdowns (Australian states), up to 3 room selections, then "Find Your First Drop" conversion CTA

### Drops-Based Lobby
- **`src/components/lobby/DropCard.tsx`** — Scheduled drop card: room name, countdown timer, RSVP count, capacity bar, RSVP/Cancel button, "Bring a Friend" link for friendfluence drops, live indicator when active
- **`src/components/lobby/DropCountdown.tsx`** — Elegant countdown component (days/hours/minutes/seconds)
- **`src/components/lobby/DropsFilter.tsx`** — Filter pills: All / Today / This Week / My RSVPs
- Update **`src/pages/Lobby.tsx`** — Replace static room cards with drops feed from Supabase. Show upcoming/live drops sorted by time. Header: "Upcoming Drops" serif headline. Keep BottomNav. Add "Your next Drop" hero card at top for RSVP'd drops. Matchmaking overlay triggers when drop goes live and user is RSVP'd.
- Update **`src/components/lobby/LobbyHeader.tsx`** — New headline "Upcoming Drops" with subtitle about scheduled sessions

### Updated Existing Files
- **`src/App.tsx`** — Add `/onboarding` route, redirect new users from auth to onboarding
- **`src/contexts/AuthContext.tsx`** — Add `userTrust` to context, fetch from user_trust table on auth change, expose `onboardingComplete` boolean
- **`src/pages/Auth.tsx`** — After successful signup/login, check onboarding status → redirect to `/onboarding` if incomplete, else `/lobby`
- **`src/components/landing/HeroSection.tsx`** — Update CTA from "Join the circle" to link to `/onboarding`
- **`src/data/rooms.ts`** — Keep for reference but Lobby now reads rooms from DB

---

## Implementation Order

1. Database migration (new tables + seed drops)
2. AuthContext update (add userTrust)
3. Onboarding wizard (all 6 screens)
4. Drops-based Lobby rebuild
5. Route wiring + redirects
6. Landing page CTA update

---

## Technical Notes

- Email OTP uses `supabase.auth.signInWithOtp({ email })` — no password needed for onboarding flow
- Phone verification uses `supabase.auth.signInWithOtp({ phone })` with AU format validation
- Progress saved to `user_trust.onboarding_step` on each step completion so users can resume
- Drops countdown uses `date-fns` differenceInSeconds with 1s interval
- RSVP inserts to `drop_rsvps`, optimistic update via TanStack Query
- Friendfluence drops have `is_friendfluence: true` flag, share generates unique `friend_invite_code`
- All new components use existing design tokens: `font-serif` headlines, `text-primary` for gold, `bg-card` cards, `border-border`, Framer Motion entrance animations
- Australian states dropdown: NSW, VIC, QLD, SA, WA, TAS, NT, ACT

