# Typography System Update

## Goal

Replace the current typography system with a new three-font hierarchy. Remove all unused font files and references.

## New Font System

| Role | Font | Source | Weight |
|------|------|--------|--------|
| Logo | First | Already installed locally | Existing |
| Hero, headings, display | Boldonse | Google Fonts | 400 (only weight available) |
| Body, paragraphs, footer, all other text | Newsreader | Google Fonts | 400, 500, 600 |

## Tasks

### 1. Remove unused fonts

Delete the following font files from `public/fonts/`:
- `geist-variable.woff2`
- `teko-500.ttf`
- `syne-700.woff2`
- `syne-latin-ext.woff2`

Remove all `@font-face` declarations for Geist, Teko, and Syne from `src/styles/global.css`.

Remove DM Mono from the Astro font configuration if it is no longer used. Verify by searching the codebase for any remaining usage before removing.

Remove any preload links for the deleted fonts from `BaseLayout.astro`.

### 2. Install new fonts via Google Fonts

Add Boldonse and Newsreader to the Astro font system in `astro.config.mjs`, or load them directly via `<link>` tags in `BaseLayout.astro`.

Boldonse: weight 400 only (no other weights available).
Newsreader: weights 400, 500, 600. Variable font is preferred if Astro font system supports it.

Preload Boldonse and Newsreader 400 in `BaseLayout.astro` for performance.

### 3. Update CSS custom properties

In `src/styles/global.css`, replace the current font tokens with:

```css
:root {
  --font-display: 'Boldonse', sans-serif;
  --font-body: 'Newsreader', Georgia, serif;
  /* Remove --font-geist, --font-teko, --font-syne, --font-dm-mono */
}
```

The logo continues to use the First font as before. Do not change the logo's font reference.

### 4. Apply fonts globally

Replace font-family declarations throughout the codebase:

- All `h1`, `h2`, `h3`, `.hero`, `.display`, headings, KnitTools card title → `var(--font-display)`
- `body`, `p`, `.body-text`, footer text, descriptions, labels → `var(--font-body)`
- Logo → unchanged (First)

### 5. Apply line-height rules

In `src/styles/global.css`:

```css
/* Display text: tight line-height */
h1, h2, h3, .hero, .display {
  line-height: 1;
}

/* Body text: airy line-height for readability */
body, p, .body-text {
  line-height: 1.5;
}
```

Verify that no element-specific overrides in component files break this rule. If an existing component has its own `line-height` set, evaluate whether it should be removed in favor of the global rule.

### 6. Verification checklist

After implementation, verify:

- [ ] Site renders correctly on desktop (Chrome, Firefox)
- [ ] Site renders correctly on mobile (responsive breakpoints intact)
- [ ] Logo (First) is unchanged in appearance
- [ ] Hero text uses Boldonse and is visually painokas
- [ ] All paragraph text uses Newsreader and reads comfortably
- [ ] No broken font references in browser console
- [ ] No leftover `@font-face` rules pointing to deleted files
- [ ] No leftover font files in `public/fonts/` for removed fonts
- [ ] Page weight is reduced after removing unused fonts (check Network tab)
- [ ] Line-heights look correct: tight on headings, airy on body

## Notes

Boldonse has only one weight (400). Do not attempt to use bold, light, or italic variants — they don't exist. If a heavier or lighter visual hierarchy is needed in headings, achieve it through font-size and letter-spacing differences, not weight.

Newsreader is a variable font with optical sizing. Use the variable version if Astro's font system supports it; this provides better rendering at different sizes.
