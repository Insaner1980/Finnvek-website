# Finnvek.com — Standalone HTML Preview

## Task

Build a single standalone HTML file that renders the Finnvek.com landing page according to the design described below. The output is a visual preview, not production code. Deliver everything — HTML, CSS, JavaScript — inline in one `.html` file.

## Constraints

- Single `.html` file. No build step, no framework, no external files other than fonts and GSAP from CDN.
- Load the Figtree font from Google Fonts via `<link>` tag.
- Load GSAP and ScrollTrigger from a CDN (e.g. cdnjs) via `<script>` tag. Use the latest stable version.
- No localStorage, no backend calls, no form submission logic beyond a fake "success" state swap.
- Must render correctly when the HTML file is opened directly in a browser.
- Must not cause horizontal scroll at any viewport width.

## Brand

- Brand name: **Finnvek**
- Tagline: Independent software from Turku, Finland
- First product: **KnitTools** (Android knitting companion app, coming soon)
- Owner/voice: Emma (one developer, but the brand represents the studio, not the individual — Emma signs off the about text as a personal touch)

## Design tokens

### Colors

```css
:root {
  --color-bg: #08080A;
  --color-surface-footer: #0C0C0C;
  --color-text: #F0F0EC;
  --color-text-muted: #9A9A95;
  --color-text-dimmed: #5F5F5A;
  --color-accent: #4A9D94;
  --color-accent-hover: #5FBCB1;
  --color-border: #252525;
}
```

Background is near-black. Footer has a slightly lighter surface (subtle but visible). Accent is a muted turquoise — used only for: the two dots inside the FINNVEK logo, inline links, the `KnitTools` word inside the about paragraph, the notify button text, and the `knittoolsapp.com →` link.

### Typography

Single typeface: **Figtree** (Google Fonts). Load weights 300, 400, 500, 600.

Fallback stack: `'Figtree', system-ui, -apple-system, sans-serif`.

Hierarchy:

| Element | Weight | Size (desktop) |
|---|---|---|
| Hero line | 500 | `clamp(2rem, 3.2vw, 3rem)` |
| Section heading (`Finnvek`, `KnitTools`) | 500 | `clamp(2rem, 3vw, 2.75rem)` |
| Body paragraph | 400 | 1rem, line-height 1.65 |
| Eyebrow labels | 500 | 0.75rem, uppercase, letter-spacing 0.12em, muted color |
| Product meta labels | 400 | 0.875rem, muted color |
| Emma signature | 400 italic | 0.95rem, muted color |
| Footer text | 400 | 0.8125rem, muted/dimmed |

No serif anywhere. No display fonts. Hierarchy comes from weight and size only.

## Page layout

Outer container: `max-width: 1100px`, centered. Horizontal padding: 2rem desktop, 1.25rem mobile.

### Alternating side rhythm (desktop ≥769px)

The page alternates which side sections sit on:

1. **Header (logo)** — left edge of container
2. **Hero** — left edge of container, `max-width: 720px`
3. **About section** — right edge of container, `max-width: 640px` (use `margin-left: auto`)
4. **KnitTools section** — left edge of container, two-column internal layout
5. **Footer** — full viewport width with its own background surface, content centered within max-width

On mobile (≤768px), all side alignment collapses. Everything becomes full-width centered content within the padded container.

### Vertical rhythm

- Header top padding: 2.25rem
- Header → Hero: 8rem
- Hero → About: 6rem
- Above each section heading line (see below): 6–8rem of empty space
- Line → heading: 4rem
- Heading → body: 2rem
- KnitTools content → Footer: 6rem
- Footer internal padding: 4rem top, 3rem bottom

Mobile spacing scales to roughly 60% of these values.

## Content

### Header

Inline SVG wordmark **FINNVEK** where the horizontal crossbars of the letters `F` and `E` are replaced by small turquoise-accent circles (about 12% of letter height, in `var(--color-accent)`). The rest of the letters are in `var(--color-text)`.

Approximate SVG: a viewBox of roughly `0 0 402 62`, letters stroked as solid paths, two circles positioned where the F and E crossbars would be.

Width on desktop: 184px. Mobile: 132px. Add `data-logo-dot` attribute (or class) to the two circle elements so they can be targeted for the load animation.

### Hero section

```
[eyebrow] Independent software from Turku, Finland

Software that's built to last.
```

The eyebrow is a small uppercase label above the hero line. The hero line itself is a single line, medium weight, no color accents on any word.

### About section (right side)

```
Finnvek

Finnvek is independent software from Turku, Finland. I'm one
developer, working on my own projects.

It exists because some ideas were worth following, and I had
the freedom to follow them. The kind of ideas that stay
interesting for years, not weeks. The kind I care about enough
to build carefully, without shortcuts or rushed releases.

Every product is its own thing. No ads, no tracking. Made to
work well, and to keep working for a long time.

The first one is [KnitTools]. More are on the way.

— Emma
```

- Heading `Finnvek` at 2–2.75rem.
- Paragraphs in body text style.
- `[KnitTools]` is an inline span with `color: var(--color-accent)` — not an actual link in this preview.
- `— Emma` signature on its own line, italic, muted color, small vertical margin above.
- Entire block aligned to right edge of container with `margin-left: auto`.

### KnitTools section (left side)

Two-column grid: phone image on left, info column on right. Gap: 5.5rem. On tablet/mobile, collapse to single column (image above text).

**Image column:** Use a placeholder for the phone image. A dark rounded rectangle (aspect ratio roughly 9:19, width ~300px) with a lighter-grey inner rectangle representing a phone screen. Label it with simple text like "KnitTools preview" at low opacity. This is a visual placeholder — the real image is not required.

**Info column (in order, top to bottom):**

1. Eyebrow label: `COMING SOON`
2. Heading: `KnitTools`
3. Description paragraph: `KnitTools is a pocket companion for knitters. It counts your rows, reads your patterns, and keeps your stash quietly in order, with voice and AI that speaks knitter. In eleven languages, for Android.`
4. Thin horizontal divider (1px, `var(--color-border)`, full width of info column)
5. Product meta as a definition list:
   - `Status` → `Coming soon`
   - `Platform` → `Android`
   - `Languages` → `11`
   
   Styled as rows with label on the left (muted, 0.875rem) and value on the right (default text color, 0.875rem). 1px border-bottom separator between rows, `var(--color-border)`.
6. Notify form: email input + button side by side. Email input has a 1px bottom border (`var(--color-border)`), transparent background, default text color. Button text: `Notify me at launch`, in `var(--color-accent)` text color, transparent background, no border. On submit (prevent default), replace form contents with the text `You're in!` styled in `var(--color-accent)`.
7. External link: `knittoolsapp.com →` as a link in `var(--color-accent)` (href can be `https://knittoolsapp.com`).

### Footer

Full viewport width, background `var(--color-surface-footer)` (slightly lighter than page background — subtle shift).

Content stays within 1100px max-width, padded inside.

Layout: brand name on the left, contact/meta on the right. Desktop uses flexbox with space-between. Mobile stacks vertically, centered.

Content:
- Left: `Finnvek` (brand name, 1rem, text color) with `Turku, Finland · 2026` below it (small, dimmed color)
- Right: `contact@finnvek.com` (mailto link, muted color, no underline until hover) and `Privacy` (link to `#`, muted color)

## Section heading lines — the distinctive element

This is the key visual element of the redesign. A thin 1px horizontal line appears above each section heading (About and KnitTools — not hero, not footer). The line enters from the **opposite side** of the page from where the section's content is aligned.

### Geometry

- Line height: 1px
- Line color: `var(--color-border)`
- The line originates from the viewport edge (not the container edge) — it must break out of the 1100px container to touch the actual left or right edge of the screen.
- The line ends 2rem before the section's heading text.

### For the About section (content on the right)

- Line originates at the **right** edge of the viewport.
- Line extends leftward.
- Line ends ~2rem to the right of where the `Finnvek` heading's right edge sits. In practice: use `width: calc(50% - 2rem)` on an element anchored to the right edge of a full-width wrapper.
- Line sits 4rem above the heading.

### For the KnitTools section (content on the left)

- Line originates at the **left** edge of the viewport.
- Line extends rightward.
- Line ends ~2rem to the left of where the `KnitTools` heading's left edge sits. Use `width: calc(50% - 2rem)` anchored to the left.
- Line sits 4rem above the `COMING SOON` eyebrow (which sits above the heading). So vertical order is: line → 4rem gap → eyebrow → small gap → heading.

### Mobile behavior (≤640px)

- All lines originate from the **left** edge of the viewport.
- Width: `40vw`.
- Vertical gap below line to heading: 2.5rem.
- No alternating direction — same left-side origin for both section lines.

### Avoiding horizontal scroll

Use one of these patterns to make a line that touches the viewport edge without breaking layout:

- Wrap the line in a full-width container: `<div class="line-wrap"><div class="line"></div></div>` where `.line-wrap` is `width: 100%` on `body` (which is full viewport width naturally).
- For the right-origin line: `.line-wrap` with `display: flex; justify-content: flex-end;` and `.line { width: calc(50% - 2rem); }`.
- For the left-origin line: `.line-wrap` with `display: flex; justify-content: flex-start;` and `.line { width: calc(50% - 2rem); }`.

Do not use `100vw` — it causes horizontal scroll when a scrollbar is present. Use `100%` on full-width parents instead.

### Line animation (draw on scroll)

Using GSAP + ScrollTrigger:

- Line starts at `transform: scaleX(0)` with `transform-origin` anchored to the entry side:
  - About line (right-origin): `transform-origin: right center`
  - KnitTools line (left-origin): `transform-origin: left center`
- When the line element scrolls into view (ScrollTrigger: `start: 'top 80%'`), animate `scaleX` from 0 to 1.
- Duration: 0.8s, ease: `power2.out`.
- On mobile (≤768px), both lines animate with `transform-origin: left center` since both originate from the left.

Respect `prefers-reduced-motion: reduce` — if set, render lines at their final state with no animation.

## Additional animations (keep simple for preview)

- On page load: fade the whole page in (opacity 0 → 1, 0.4s).
- Logo dots (the two turquoise circles in FINNVEK): after 0.3s delay, fade them in with a short scale bounce (scale 0 → 1.15 → 1, 0.6s, ease `back.out(2)`).
- Hero block: fade up on load (y: 20 → 0, opacity 0 → 1, 0.6s, ease `power2.out`, 0.5s delay).
- About and KnitTools sections: fade up when scrolled into view (y: 30 → 0, opacity 0 → 1, 0.6s, `power2.out`, triggered at `top 75%`).

All animations respect `prefers-reduced-motion: reduce`.

## Deliverable

One HTML file. Open in browser → should render the page fully styled, with the Figtree font loaded, the layout alternating sides on desktop, section heading lines animating in from opposite edges, and a subtle footer surface distinction.

Keep all CSS inside a `<style>` tag in the head. Keep all JavaScript (GSAP setup and animation code) inside a `<script>` tag at the end of the body. Load GSAP, ScrollTrigger plugin, and Figtree font via CDN links in the head.

File name: `finnvek-preview.html`.
