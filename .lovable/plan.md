

## Update VerityLogo SVG to Match New Brand Mark

The uploaded image shows a dramatically different logo: a stylized V with angular wing-like extensions and a detailed multi-pointed starburst/spark in gold, replacing the current simple V-stroke + circle.

### What Changes

**`src/components/VerityLogo.tsx`** — Complete SVG path replacement:

1. **New V shape**: Angular, wing-tipped V with curved horns extending outward at the top and a rounded pointed base. Rendered as a filled shape (not a stroke) using `currentColor` so it adapts to light (#212121) and dark (#F3F3F3) themes automatically.

2. **New spark**: Replace the simple gold circle with a detailed multi-pointed starburst centered over the V intersection, filled with `#D4AF37`.

3. **Dark mode glow**: Add an optional SVG `<filter>` with a subtle golden outer glow that activates in dark mode via a CSS class (`dark` parent detection), matching the right-side version in the image.

4. **Both variants updated**: The `"icon"` variant gets the new mark alone; the `"full"` variant keeps the mark + "VERITY" wordmark text.

### Files Changed

| File | Change |
|------|--------|
| `src/components/VerityLogo.tsx` | Replace SVG paths for both icon and full variants |

No other files need changes — all consumers already reference `<VerityLogo />` with the correct props.

