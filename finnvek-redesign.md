# Finnvek.com Visual Redesign

Visual refresh of finnvek.com. All text content, links, SEO metadata, and the KnitTools app icon remain unchanged. Only layout, sizing, and visual styling change.

## Background Image

A new background image file is in `public/` as `hero-bg.webp`

Apply it as a **fixed full-page background** on `<body>`:

```css
body {
  background-color: var(--bg-base); /* fallback */
  background-image: url('/hero-bg.webp');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}
```

The image stays fixed while content scrolls over it. The existing `--bg-base` (#0A0A0F) remains as fallback.

Do NOT add any gradient overlay on top of the background image.

## Hero Section

Reduce hero height so the project card is visible without scrolling on 14" laptop screens:

- Change `min-height` to `55vh` (from whatever it currently is)
- Padding: `48px 24px 32px`
- Keep vertical centering (flexbox)

### Subtitle

Increase the subtitle ("Independent software from Turku, Finland") size:

- Font size: `24px` (currently smaller, likely ~16px)
- Font: Sora, weight 400
- Color: `var(--color-muted)` (unchanged)

## Logo

The logo SVG component stays the same but increase its rendered size. The current logo container/SVG width should increase proportionally — approximately 20% larger than current. The exact approach depends on how LogoAnimated.astro controls sizing (might be SVG width, might be a container). Scale it up so it feels more prominent in the hero.

All logo animations (letter fade-in, dot bounce, squish, click-to-replay) remain unchanged.

## Project Card

Make the card background slightly translucent so the dot-pattern background image is faintly visible through it:

```css
.project-card {  /* or whatever the actual selector is */
  background: rgba(19, 19, 26, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

Replace the current solid `var(--bg-card)` / `#13131A` with the rgba version above. Keep all other card styles (border, border-radius, hover effects, padding) unchanged.

## Section Label ("PROJECTS")

The label sits directly on the dot-pattern background, so it needs better contrast:

- Change color from `var(--color-dimmed)` to `var(--color-muted)`
- Add text-shadow for readability against the background:

```css
text-shadow: 0 0 20px rgba(10, 10, 15, 0.9), 0 0 40px rgba(10, 10, 15, 0.8);
```

## "More apps coming soon" Text

Same treatment as the section label — it also sits directly on the background:

- Change color from `var(--color-dimmed)` to `var(--color-muted)`
- Add the same text-shadow:

```css
text-shadow: 0 0 20px rgba(10, 10, 15, 0.9), 0 0 40px rgba(10, 10, 15, 0.8);
```

## Footer

The footer background should only cover the text area, not stretch full-width. The dot-pattern background should be visible around the footer text.

Remove any full-width background from the footer container. Instead, wrap the footer content (logo + info line) in a centered container with:

```css
.footer-info {  /* the line with © 2026 Finnvek · contact@finnvek.com · Turku, Finland */
  background: rgba(10, 10, 15, 0.85);
  padding: 10px 20px;
  border-radius: 8px;
  width: fit-content;
  margin: 0 auto;
}
```

The footer logo (LogoStatic) above the info line does NOT get a background — it floats directly on the dot pattern. It already has opacity hover (0.7 -> 1.0) which is enough.

## Summary of What Does NOT Change

- All text content (subtitle, KnitTools description, footer text)
- KnitTools app icon (knittools-icon.webp)
- Logo SVG paths and animations
- Color palette CSS custom properties
- Font families (Sora, DM Sans, DM Mono)
- Card hover effects (translateY, border brighten)
- Arrow hover effect
- Staggered fade-up page load animations
- SEO metadata, JSON-LD, OG tags
- Sitemap, robots.txt
- Any responsive breakpoints that exist
