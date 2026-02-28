

## Light/Dark Mode Polish — CSS Variable Alignment

Most of the infrastructure is already in place (next-themes provider, ThemeToggle component, VerityLogo with `currentColor`, smooth transitions). The only work needed is fine-tuning CSS variable values to match the exact requested hex codes.

### Current vs Requested Values

| Token | Current (Light) | Requested | Change |
|-------|----------------|-----------|--------|
| `--background` | `0 0% 98%` (#FAFAFA) | `0 0% 100%` (#FFFFFF) or `0 0% 97%` (#F8F9FA) | Update to `0 0% 97%` |
| `--card` | `0 0% 100%` (#FFFFFF) | `0 0% 95%` (#F3F3F3) | Update |
| `--border` | `0 0% 90%` (#E6E6E6) | `0 0% 90%` (#E5E5E5) | ✓ Already matches |

| Token | Current (Dark) | Requested | Change |
|-------|---------------|-----------|--------|
| `--background` | `0 0% 4%` (#0A0A0A) | `0 0% 7%` (#121212) | Update |
| `--card` | `0 0% 9%` (#171717) | `0 0% 13%` (#212121) | Update |
| `--border` | `0 0% 15%` (#262626) | `0 0% 15%` (#262626) | ✓ Already matches |

### Files to Change

**`src/index.css`** — Adjust ~8 CSS variable values in `:root` and `.dark` blocks to match the exact hex codes. Update related variables (`--popover`, `--secondary`, `--muted`, `--sidebar-*`, gradients, shadows) to stay consistent with the new base values.

### Already Implemented (No Changes Needed)
- ✅ `next-themes` with `attribute="class"`, `enableSystem`, `defaultTheme="dark"` — handles localStorage + system preference
- ✅ `ThemeToggle` with Sun/Moon icons in the navbar
- ✅ `VerityLogo` uses `currentColor` for V + text, hardcoded `#D4AF37` for spark
- ✅ Smooth `transition: background-color 0.3s ease, color 0.3s ease` on `html` and `body`
- ✅ Gold `#D4AF37` as `--primary` / `--accent` in both themes
- ✅ All components use semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-card`, etc.)

