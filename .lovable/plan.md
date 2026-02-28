

## Ensure Light/Dark Mode Toggle Across All Pages

Currently, the `ThemeToggle` component is only rendered in the **landing page Navbar** (`src/components/landing/Navbar.tsx`). All authenticated pages (Lobby, SparkHistory, TokenShop, Profile) use `BottomNav` which has no theme toggle. The Auth, Onboarding, LiveCall, Chat, Transparency, Appeal, and Admin pages also lack any toggle.

### Approach

Rather than adding the toggle to every individual page, place it in two strategic locations:

1. **`src/components/BottomNav.tsx`** — Add a small `ThemeToggle` button integrated into the top-right corner of authenticated pages (or as an icon within the nav bar). This covers Lobby, SparkHistory, TokenShop, and Profile in one change.

2. **`src/pages/Auth.tsx`** — Add `ThemeToggle` to the top-right area (next to the "Back" link).

3. **`src/pages/Onboarding.tsx`** — Add `ThemeToggle` to the header area.

4. **`src/pages/LiveCall.tsx`** — Skip this page; adding a theme toggle during a live video call would be distracting and disruptive.

5. **Standalone pages** (`Transparency.tsx`, `Appeal.tsx`, `Admin.tsx`, `Chat.tsx`) — Add `ThemeToggle` to their header/top-bar areas.

### Implementation Detail

For authenticated pages with `BottomNav`, the cleanest approach is to add a **floating `ThemeToggle`** as a shared layout element rather than modifying every page. A small persistent toggle button positioned `fixed top-4 right-4` will cover all authenticated routes.

**Better approach**: Create a lightweight `AppHeader` component that renders a fixed top-right `ThemeToggle` on all pages except Landing (which already has it in Navbar). Then render `AppHeader` once in `App.tsx` outside the `<Routes>`.

### Files Changed

| File | Change |
|------|--------|
| `src/components/AppHeader.tsx` | **New** — Renders a fixed-position `ThemeToggle` on all routes except `/` (landing already has one) and `/call/:id` (avoid distraction) |
| `src/App.tsx` | Import and render `<AppHeader />` inside the router, above `<Routes>` |

This single-component approach avoids touching every page file individually.

