

## Logo Integration Plan

### Challenge
The uploaded image is a single sheet containing all logo variants (light/dark × primary/icon/horizontal). Individual variants cannot be extracted from a composite image. The app currently uses only dark mode (no light/dark toggle exists).

### Approach
1. **Create an inline SVG `VerityLogo` component** (`src/components/VerityLogo.tsx`) that reproduces the logo mark (stylized V with coral-orange spark) and "VERITY" wordmark. The SVG will use the exact brand colours from the image:
   - Deep navy `#1B2A4A` for V-shape (light backgrounds)
   - White/silver `#E8EBF0` for V-shape (dark backgrounds — current app theme)
   - Coral-orange `#E85D35` for the spark
   - The component accepts `variant` prop: `"full"` (icon + text), `"icon"` (icon only)
   - Uses `currentColor` or explicit fills that match the dark theme; since the app is dark-only, the dark-mode palette is primary

2. **Copy uploaded image to `public/og-logo.png`** for use as the Open Graph image and as a reference asset.

3. **Copy uploaded image to `public/favicon.png`** — since we cannot crop the icon-only variant from the sheet, I'll use the full image temporarily and note that you'll need to upload a separate icon-only PNG for the favicon/publish settings.

4. **Replace all text-based "Verity" logos** across these files:
   - `src/components/landing/Navbar.tsx` — replace text link with `<VerityLogo />` inside a `<Link to="/">`
   - `src/components/landing/Footer.tsx` — replace text with `<VerityLogo />`
   - `src/pages/Lobby.tsx` — replace header text with `<VerityLogo variant="icon" />`
   - `src/pages/Auth.tsx` — replace `<h1>Verity</h1>` with `<VerityLogo />`

5. **Responsiveness**: SVG scales perfectly at any size. The component will accept `className` for sizing via Tailwind (`h-8`, `h-6`, etc.). Alt text handled via `aria-label`.

### Files Changed
| File | Change |
|------|--------|
| `src/components/VerityLogo.tsx` | **New** — SVG logo component |
| `src/components/landing/Navbar.tsx` | Replace text with `<VerityLogo />` |
| `src/components/landing/Footer.tsx` | Replace text with `<VerityLogo />` |
| `src/pages/Lobby.tsx` | Replace header text with icon variant |
| `src/pages/Auth.tsx` | Replace h1 text with logo |
| `public/favicon.png` | Copy uploaded image (temporary — user needs to provide icon-only crop for proper favicon) |
| `index.html` | Add favicon link tag |

### Important Note
Since the uploaded image is a composite sheet (not individual assets), the SVG component will be hand-crafted to match the design. For a pixel-perfect match, you would ideally provide the individual logo files (e.g., separate dark-mode horizontal PNG/SVG). The SVG I create will faithfully reproduce the V-spark-wordmark design with the exact colour values from the image.

