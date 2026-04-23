# Finnvek.com — Blueprint Redesign Spec

## Goal

Redesign Finnvek.com from the current dark minimalist layout to a **light "blueprint paper" aesthetic**, inspired by technical drawings. Keep the existing vertical `FINNVEK` logo (unchanged), rebuild the rest as a single, quiet paper sheet with minimal content and no visible frames.

The design philosophy is **"one drawing"**: the blueprint feel should come from the paper grid, the typography, and a few deliberate technical-drawing gestures — **not** from boxing every element in a frame. 

---

## Preserve — do not touch

These are working and must remain untouched unless explicitly listed as a change below:

- **`src/components/LogoAnimated.astro`** — the logo SVG, its GSAP timeline animation, and the rotation/sizing logic. The only change allowed is the fill colour of the letters (see "Theme inversion" below).
- **`src/layouts/BaseLayout.astro`** — SEO meta tags, Open Graph, Twitter card, JSON-LD Organization schema, favicon, apple-touch-icon, og-image references, canonical URL, font preloads.
- **`astro.config.mjs`** — sitemap config, font system config, integrations.
- **`public/fonts/`** — all existing self-hosted fonts (Geist, Teko, Syne, DM Mono). Continue to use these via the existing `@font-face` declarations in `global.css`. **Do not import from Google Fonts.** The `Audiowide` font (used by the logo) is already embedded in the logo SVG and does not need to be loaded separately.
- **`src/content/blog/`** and **`src/content.config.ts`** — leave the blog collection alone.
- **`public/favicon.svg`**, **`public/apple-touch-icon.png`**, **`public/og-image.png`** — do not regenerate.
- **`public/robots.txt`** — leave as is.
- **`public/knittools-icon.webp`** — keep the file; whether to render it is decided in the "Open questions" section below.
- **Sitemap generation** — continues to work via `@astrojs/sitemap`.
- Cloudflare Pages deployment target (static `dist/` output).

---

## Theme inversion — dark to light

Update the colour tokens in `src/styles/global.css`. The rest of the palette updates naturally if components use these variables.

```css
:root {
  /* Paper surface */
  --bg-base: #f3f3ee;          /* was #141416 */
  --bg-paper-2: #eceae2;        /* new — subtle paper tone */

  /* Ink */
  --color-primary: #0e0f10;     /* was #EDEDF0 — now dark ink on light paper */
  --color-secondary: #1b1d1f;   /* new — slightly softer ink for body text */
  --color-muted: #7a7e85;       /* was #8E8E9F — "pencil" tone */
  --color-dimmed: #a8abaf;      /* was #5A5A6A — "soft pencil" tone */

  /* Accent (unchanged — Finnvek turquoise) */
  --color-accent: #1DB4A5;
  --color-accent-hover: #24D4C2;

  /* Rules & grid */
  --color-border: #c9ccd1;       /* was #1E1E28 */
  --color-border-soft: #dddfe2;  /* was #2A2A35 */
  --grid: #e5e6de;               /* new — fine paper grid */
  --grid-major: #d3d4cb;         /* new — major 120px grid */
}
```

**Critical:** verify that `LogoAnimated.astro`'s letter fill uses `var(--color-primary)` (or the equivalent CSS variable). If it is hardcoded to the previous light colour, change it to use the variable. The turquoise dots remain `#1DB4A5`. The logo must render as dark letters + turquoise dots on the light paper.

**Selection colour:** update `::selection` background to `var(--color-accent)` with text colour `var(--bg-base)`.

---

## Background — paper grid

Replace the current solid `--bg-base` body background with a four-layer grid pattern plus a subtle paper texture. Add to `src/styles/global.css`:

```css
body {
  background-color: var(--bg-base);
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px),
    linear-gradient(var(--grid-major) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-major) 1px, transparent 1px);
  background-size: 24px 24px, 24px 24px, 120px 120px, 120px 120px;
  background-position: 0 0;
}

body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background-image:
    radial-gradient(transparent 60%, rgba(0,0,0,0.04)),
    repeating-linear-gradient(180deg, rgba(0,0,0,0.010) 0 1px, transparent 1px 4px);
  mix-blend-mode: multiply;
}
```

**Remove** the cursor grid reveal effect from `src/pages/index.astro`. On the light theme the paper grid is always visible, so the mouse-mask reveal is no longer needed. Delete the related JS (cursor tracking, rAF loop) and CSS mask.

---

## Layout structure

The page is a single `<main>` element (max-width ~1200px, centered) with:

1. **Top rail** — a row of monospace text, no frame.
2. **Layout grid** — two columns: drafting margin (left, 100px desktop / 60px mobile) + content (right, flexible).
3. **Footer** — a single line of text, no frame.

The `FINNVEK` logo lives in the drafting margin column as before. The rest of the content flows in the right column.

### Container

```css
.sheet {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 28px 24px;
  z-index: 2;
}

.layout {
  position: relative;
  display: grid;
  grid-template-columns: 100px 1fr;  /* left margin + content */
  min-height: 88vh;
}
```

---

## Section 1 — Top rail

A simple two-part monospace row above the layout. **No border, no background, no frame.**

- **Left:** a small turquoise pulsing dot (5px) + `60.4518° N · 22.2666° E`
- **Right:** `LAST UPDATED 2026.04`

```css
.toprail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding: 4px 2px 14px;
}
```

The pulse animation: 2.2s infinite, opacity 0.35 ↔ 1.

---

## Section 2 — Drafting margin (left column)

The existing `Hero.astro` currently places the logo as the left sidebar. Keep this behaviour. **Do not change the logo's size, rotation, position, or animation** — it must continue to fill the vertical space from top to bottom of the viewport as it does currently.

**Additions around the logo** (inside the 100px left column):

1. **Top label** (above the logo): `FIG.` (small, pencil colour) with `001` (bold, ink colour) below it. Centered. DM Mono, ~9.5px letter-spacing 0.3em.

2. **Scale tick bar** (between top label and the logo, vertical): a thin vertical axis line with ~13 tick marks distributed evenly, every 4th one longer ("major"). Ticks animate in one after another (scaleX 0→1, 180ms duration, 50ms stagger) on page load.
   - **Mobile (≤720px): hide the scale bar entirely** (`display: none`).

3. **Bottom label** (below the logo): `SCALE` + `1 : 1` in the same style as the top label.

4. A thin vertical rule on the right edge of the margin column (1px, `--color-border-soft`) visually separates it from the content.

The margin column CSS:

```css
.margin {
  padding: 6px 0 14px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;  /* label / ticks / logo / label */
  gap: 14px;
  border-right: 1px solid var(--color-border-soft);
}
```

---

## Section 3 — Content column

All following blocks live in the right column of `.layout` inside a vertically-stacked grid with `gap: 56px` between major sections.

### 3a. Hero tagline

Remove the existing top-right-corner placement of the "INDEPENDENT SOFTWARE FROM TURKU, FINLAND" subtitle. **Replace it with a hero block at the top of the content column**:

- Multi-line tagline:
  ```
  Independent software
  from Turku, Finland
  ```
- Font: **Syne, weight 600**, `clamp(16px, 2.8vw, 26px)`, uppercase, letter-spacing 0.18em, line-height 1.45, colour `--color-primary`, max-width ~20ch.
- The word **`Finland`** can optionally be in turquoise (`--color-accent`). Final decision is open (see Open questions).
- Padding: `padding-top: 14vh; padding-bottom: 8vh;` on desktop. Mobile: reduce to `padding-top: 8vh; padding-bottom: 4vh;`.

### 3b. Section label — "— 01 Catalog"

A minimal inline row. No frame.

- Turquoise em-dash + ink-coloured `01` + pencil-coloured `Catalog`
- DM Mono, 10.5px, letter-spacing 0.28em, uppercase

```html
<div class="slabel">
  <span class="dash">—</span>
  <span class="num">01</span>
  <span>Catalog</span>
</div>
```

### 3c. KnitTools block — rewrite `ProjectCard.astro`

**Remove the current card frame entirely.** The KnitTools section is now plain content on the paper, not a boxed card.

Also remove:
- The turquoise SVG border trace animation around the card
- The "Coming soon" badge pill (info now lives in the specs row)
- The external link arrow in the top-right
- The waitlist trigger → expanding form flow — replace with a static underlined inline input (see below)

**Retain or remove the 72px KnitTools icon?** See Open questions. The v3 mockup omits it; proceed without the icon for now, but keep `knittools-icon.webp` in `public/` so it can be re-added if decided.

**New structure (in order):**

1. **Title** — `KnitTools`
   - Font: **Teko, weight 500**, `clamp(56px, 11vw, 96px)`, line-height 0.9, letter-spacing 0.005em, colour `--color-primary`

2. **Description** — one paragraph:
   > A pocket companion for knitters. Counts your rows, reads your patterns, and keeps your stash quietly in order. With *voice and AI that speaks knitter* — in eleven languages.
   - The phrase `voice and AI that speaks knitter` is wrapped in an `<em>` with a turquoise highlight:
     ```css
     .product-desc em {
       font-style: normal;
       background: linear-gradient(transparent 62%, rgba(29,180,165,0.18) 62%);
       padding: 0 2px;
     }
     ```
   - Font: **Geist, weight 400**, `clamp(15px, 1.8vw, 17px)`, line-height 1.7, colour `--color-secondary`, max-width 56ch.

3. **Spec row** — single inline line of text (not a grid):
   ```
   Platform Android · 11 languages · Status Coming soon · Stores Google Play + Amazon
   ```
   - DM Mono, 11px, letter-spacing 0.14em, uppercase, colour `--color-muted`
   - The values (`Android`, `11`, `Coming soon`, `Google Play + Amazon`) are wrapped in `<b>` with colour `--color-primary` and font-weight 500
   - The `·` separators use colour `--color-dimmed`

4. **CTA row** — flex-wrap, no frame:
   - Left: `Learn more → knittoolsapp.com` as an external link with `target="_blank"` and `rel="noopener"`.
     - Style: DM Mono 12px uppercase, underlined (`border-bottom: 1px solid var(--color-primary)`), hover turns both text and underline to `--color-accent`. The `→` arrow is turquoise.
   - Right: inline waitlist form — **input and button sharing a single bottom underline**, no box:
     ```css
     .waitlist {
       display: flex;
       border-bottom: 1px solid var(--color-primary);
       flex: 1;
       min-width: 260px;
       max-width: 460px;
     }
     .waitlist input {
       border: none; background: transparent; flex: 1;
       font-family: 'DM Mono', monospace; font-size: 13px;
       color: var(--color-primary); padding: 8px 0; outline: none;
     }
     .waitlist button {
       border: none; background: transparent;
       font-family: 'DM Mono', monospace; font-size: 12px;
       letter-spacing: 0.18em; text-transform: uppercase;
       color: var(--color-primary); padding: 8px 0 8px 14px;
       cursor: pointer;
     }
     ```
   - Button text: `Join the waitlist →`. On success: change to `You're on the list` in turquoise.
   - Use `localStorage` (key: `fv_waitlist_email`) to remember the submitted email and persist the "on the list" state across visits. Same behaviour as the existing implementation, just the visual wrapper is different.
   - The form `action` is still a placeholder (`#`) — backend TBD, same as before.

### 3d. Section label — "— 02 Notes"

Same styling as 3b, with `02` and `Notes`.

### 3e. Principles list (new block)

A plain `<ol>` list, no frame, no `§` symbol, no heading — the section label above is the only framing.

**Four items:**

| # | Title | Suffix | Ref |
|---|-------|--------|-----|
| 01 | Privacy by default | · yours | A-01 |
| 02 | No ads, no tracking | · clean | A-02 |
| 03 | Made to last | · kept | A-03 |
| 04 | Independent | · self-funded | A-04 |

Each list item uses `grid-template-columns: 40px 1fr auto` (number / title+suffix / ref code). Items are separated by a 1px solid rule in `--color-border-soft`; the first item has no top rule.

- Number prefix (`::before`, counter-based): DM Mono 11px, pencil colour
- Title: **Geist, weight 500**, `clamp(17px, 2vw, 20px)`, ink colour
- Suffix (`<em>` inline after title): DM Mono, pencil colour, font-size 0.75em, letter-spacing 0.08em, `margin-left: 10px`
- Ref code (`A-01` etc.): DM Mono 10px, soft-pencil colour, letter-spacing 0.14em
- Max-width 640px

On mobile (≤720px), the suffix moves below the title (display: block) and the ref code drops below, pushed right with padding-left to align under the title column.

---

## Section 4 — Construction lines (overlay)

Two thin horizontal dashed turquoise lines animate in from left to right, starting at the heights of the logo's F and E dots. These tie the logo visually into the content column.

Positioning: `.construction` is a positioned overlay inside `.layout`, spanning from the right edge of the margin column to the right edge of the content area.

```css
.construction {
  position: absolute;
  pointer-events: none;
  z-index: 3;
  top: 0;
  left: calc(100px + 28px - 8px);  /* margin-w + sheet padding - slight bleed */
  right: calc(28px - 8px);
  bottom: 0;
}

.cline {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background-image: repeating-linear-gradient(to right,
    var(--color-accent) 0 3px, transparent 3px 9px);
  opacity: 0.45;
  transform: scaleX(0);
  transform-origin: left;
  animation: draw-line 1.1s cubic-bezier(0.65, 0, 0.25, 1) forwards;
}

.cline.e-line { top: 19%; animation-delay: 2.55s; }  /* E dot is near top of vertical logo */
.cline.f-line { top: 64%; animation-delay: 2.85s; }  /* F dot is near bottom */

@keyframes draw-line { to { transform: scaleX(1); } }
```

**The top positions (19% and 64%) are approximations that worked in the v3 mockup.** Since the real `LogoAnimated.astro` has a fixed vertical layout (logo fills ~96vh), the construction lines should align visually with the dots. Fine-tune these values against the live logo.

**Important:** the animation timing (2.55s and 2.85s delays) is chosen to start just after the corresponding dot animation in the logo completes. If the logo's GSAP timeline timing is different, sync the delays accordingly (E dot currently drops at t=2.3s in the logo timeline, F at t=2.0s — construction lines should start ~0.25s after each).

**Mobile:** the lines must still render but the left inset adjusts to `calc(60px + 16px - 8px)` to match the narrower margin column and sheet padding.

---

## Section 5 — Footer — rewrite `Footer.astro`

**Remove the current minimal right-aligned copyright string.** Replace with a single line above a thin top rule.

```html
<footer class="foot">
  <span class="fv">F<span class="d">·</span>V</span>
  <span>Finnvek</span>
  <span class="sep"></span>
  <a href="mailto:contact@finnvek.com">contact@finnvek.com</a>
  <span class="sep"></span>
  <span>Turku, Finland</span>
</footer>
```

Styling:
- Top: `border-top: 1px solid var(--color-border-soft); padding-top: 16px; margin-top: 44px;`
- Flex row, gap 18px, wraps on narrow screens
- DM Mono 11px, letter-spacing 0.16em, uppercase, muted colour
- `.fv` mark: small inline-flex box with dark bg (`--color-primary`), paper-coloured text, Audiowide 13px — the middle `·` in turquoise. Padding 4px 10px.
- `.sep` dots: 4px bullet points in `--color-dimmed`
- Email link: no underline by default, `border-bottom: 1px dotted var(--color-border)`, hover solid

**No Policy link in the footer for now.** Privacy page is planned to live on finnvek.com (centralised privacy hosting for all Finnvek apps), but that is a later task — leave the footer without a Policy link until the privacy page is created.

**`© 2026 Finnvek` and the `·` separator-style copyright line are dropped.** The single line containing `Finnvek`, the email, and `Turku, Finland` carries all the information.

---

## Animation sequence (page load)

| Time | Event |
|------|-------|
| 0.0s | Top rail fades/slides in |
| 0.0s – 0.8s | Scale-bar ticks animate in one by one |
| 0.3s – 2.0s | Logo letters drop in (existing animation — F, I, N, N, V, E, K) |
| 2.0s | F dot drops + squish (existing) |
| 2.3s | E dot drops + squish (existing) |
| 2.55s | `e-line` construction line draws across |
| 2.85s | `f-line` construction line draws across |
| 3.0s | Hero tagline reveals |
| 3.2s | Section 01 label reveals |
| 3.3s | KnitTools block reveals |
| 3.5s | Section 02 label reveals |
| 3.6s | Principles reveal |
| 3.8s | Footer reveals |

All reveals use the same keyframe: `opacity: 0 → 1` + `translateY(8px → 0)`, 600ms, cubic-bezier(0.2, 0.7, 0.2, 1).

Remove the existing card-border trace animation (3.2s GSAP strokeDashoffset) and the card icon stamp/drop animation (2.5s GSAP) since the card is gone.

---

## Mobile (≤720px)

Key differences:

- Sheet padding reduces to `12px 16px 18px`.
- Left margin column drops from 100px → 62px.
- Scale-bar ticks: `display: none`.
- Top rail letter-spacing reduces slightly, font-size 9px.
- Hero padding shrinks.
- KnitTools title: `font-size: 62px`.
- Spec row reflows naturally (it's already a flex-wrap).
- CTA row stacks: `Learn more` link on its own line, waitlist form full-width below.
- Principles list: suffix and ref code drop below the title on their own lines.
- Footer: email and location wrap naturally onto additional lines.

At ≤380px (very narrow), further reduce the margin column to 54px and shrink labels.

---

## Removals summary

Explicitly remove from the existing codebase:

1. Cursor grid reveal effect (JS + CSS) — no longer needed on the light theme.
2. Card border trace SVG + its GSAP animation — the card has no border.
3. Card icon stamp/drop animation — no icon (pending Open Q1 decision).
4. "Coming soon" badge inside the card — info now in the inline spec row.
5. Waitlist expanding-form flow (trigger → open → confirm) — replaced with static inline underlined input.
6. The hero-bg.webp image reference in public/ is already unused, leave the file but ensure no CSS references it.
7. Right-aligned top-corner subtitle ("INDEPENDENT SOFTWARE FROM TURKU, FINLAND") — moves into the content column as the new hero tagline.
8. Existing `Footer.astro` copyright line — replaced with the new footer structure.

---

## Open questions (decide before or during implementation)

1. **Construction-line top positions (19% / 64%)** need fine-tuning against the real logo's rendered dot positions. Adjust visually after first build.

2. **Hand-drawn animation style for construction lines and ticks** — deferred to a later iteration. Do not implement Rough.js or SVG turbulence filters in this pass.

---

## Files expected to change

- `src/styles/global.css` — palette, paper grid, texture, all new section styles
- `src/pages/index.astro` — top rail markup, layout grid, section wiring, remove cursor grid JS
- `src/components/Hero.astro` — remove the top-corner subtitle, add the new hero tagline block + drafting margin labels
- `src/components/ProjectCard.astro` — rewrite without frame (see 3c)
- `src/components/Footer.astro` — rewrite (see Section 5)

## Files expected to stay untouched

- `src/components/LogoAnimated.astro` (except possibly ensuring the letter fill uses `var(--color-primary)`)
- `src/components/LogoStatic.astro` (unused)
- `src/layouts/BaseLayout.astro`
- `astro.config.mjs`
- `src/content.config.ts`
- `src/content/blog/`
- `public/fonts/`
- `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og-image.png`, `public/knittools-icon.webp`, `public/robots.txt`

---
