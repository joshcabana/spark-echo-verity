

## Mobile Dark Mode Testing — Complete ✓

All sections (Hero, Stats, Features, Innovations, CTA, Footer) render correctly on 375px in dark mode. No layout or contrast issues found.

## Task 1: Add Spark Entrance Animation

**File: `src/index.css`** — Add a `@keyframes sparkEntry` rule:
```css
@keyframes sparkEntry {
  0% { transform: scale(0) rotate(-90deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

**File: `src/components/VerityLogo.tsx`** — Wrap both inline spark `<path>` elements (lines 79-82 and 108-111) in a `<g>` with the animation applied:
```jsx
<g style={{ transformOrigin: "38px 11px", animation: "sparkEntry 0.8s ease-out both" }}>
  <path d="M38 4 ..." fill="#D4AF37" />
</g>
```

This applies to both the `icon` and `full` SVG variants.

## Task 2: Generate Favicon

**Approach:** Create a backend function using Lovable AI image generation to produce a 512×512 PNG of the V + gold spark on a transparent/dark background, then save it as `public/favicon.png`.

**Simpler alternative (recommended):** Since SVG-to-PNG generation at build time isn't available, create a small static React utility page or simply use the existing icon SVG inline in a `<link>` tag. The most practical approach:

**File: `index.html`** — Replace the current favicon with an inline SVG data URI generated from the icon-only VerityLogo SVG (V shape in charcoal + gold starburst). This gives a crisp favicon at any size without needing a separate image file.

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M4 6 C4 6 8 5 13 12 L24 38 L35 12 C40 5 44 6 44 6 L42 8 C42 8 39 8 36 14 L24 42 L12 14 C9 8 6 8 6 8 Z' fill='%23212121'/><path d='M38 4 L39.2 8.5 L43 6.5 L40.5 10 L45 10.8 L40.8 12.5 L44 15.5 L39.5 14 L39.8 18.5 L38 14.5 L36.2 18.5 L36.5 14 L32 15.5 L35.2 12.5 L31 10.8 L35.5 10 L33 6.5 L36.8 8.5 Z' fill='%23D4AF37'/></svg>">
```

Keep the existing PNG fallback for older browsers.

### Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Add `@keyframes sparkEntry` animation |
| `src/components/VerityLogo.tsx` | Wrap spark paths in animated `<g>` elements |
| `index.html` | Add inline SVG favicon data URI |

