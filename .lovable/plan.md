

# Verity vNext — Landing + Lobby Update Plan

## What Changes

### 1. HeroSection.tsx — New master positioning
- Badge: "Verified 18+ speed dating" instead of "The standard since 2025"
- Headline: "Real chemistry in **45 seconds.** Mutual spark only. **Dignity always.**"
- Sub-headline updated to reference Drops model
- CTA: "Join your first Drop" → `/onboarding`
- Trust line: "Verified 18+ · Anonymous until mutual spark · Nothing stored"

### 2. Navbar.tsx — Minor copy update
- "Join" button → "Get verified" linking to `/onboarding`

### 3. StatsSection.tsx — No structural changes
- Keep as-is (data is strong and on-brand)

### 4. FeaturesSection.tsx — Update to reflect Drops model
- Update feature cards: replace "Curated Themed Rooms" with "Scheduled Drops" concept
- Add "Friendfluence Drops" as a feature
- Update copy on AI Safety to mention 30s ephemeral buffer only on report

### 5. InnovationsSection.tsx — Add 2026 innovations
- Add "Chemistry Replay Vault" (private 8s highlight, Verity Pass)
- Add "Friendfluence Drops" (Bring a Friend room type)
- Keep existing innovations that still apply (Spark Reflection, Voice Intro, Guardian Net)

### 6. CTASection.tsx — Updated copy
- Headline: "Your next Drop is waiting."
- CTA button: "Get verified" → `/onboarding`

### 7. Footer.tsx — Add Privacy link, update Join → Get verified

### 8. Lobby.tsx — Enhanced Drops lobby
- Add "Bring a Friend" share action on Friendfluence drops (generates invite link)
- Add estimated wait time display per drop (based on RSVP count and capacity)
- Header subtitle: reinforce "Verified 18+ Speed Dating Drops"
- Add a "Next Drop starting soon" live pulse indicator when a drop is within 5 minutes

### 9. DropCard.tsx — Polish
- Add wait estimate text (e.g., "~2 min wait" based on queue position)
- Friendfluence drops get a share/invite button that copies a link
- Live drops show a pulsing gold dot

### 10. MatchmakingOverlay.tsx — Minor copy polish
- Update copy to reference "Drop" language

## Files Modified (no new files)
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/Navbar.tsx`
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/InnovationsSection.tsx`
- `src/components/landing/CTASection.tsx`
- `src/components/landing/Footer.tsx`
- `src/pages/Lobby.tsx`
- `src/components/lobby/DropCard.tsx`
- `src/components/lobby/MatchmakingOverlay.tsx`

## No Database Changes
All existing schema is sufficient. No new tables or migrations needed for this phase.

## Implementation Order
1. Landing page components (Hero → Navbar → Features → Innovations → CTA → Footer)
2. Lobby + DropCard polish
3. MatchmakingOverlay copy update

