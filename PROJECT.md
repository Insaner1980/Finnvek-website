# Finnvek.com

Code-backed project summary for the current repository state in `/home/emma/dev/Finnvek-website/finnvek-site`.

This document is intentionally strict: it describes what is verifiably implemented in code today, not what earlier design notes or plans may have intended.

## Overview

- Public site URL configured in Astro: `https://finnvek.com`
- Site type: static Astro site
- Current routed pages in source: 1 (`src/pages/index.astro`)
- Current built pages: 1 (`/index.html`)
- HTML language: `en`
- Brand/contact values hard-coded in layout/footer:
  - Company name: `Finnvek`
  - Contact email: `contact@finnvek.com`
  - Locality: `Turku, Finland`
  - Footer coordinates: `60.4518° N · 22.2666° E`

## Runtime And Build Stack

### Declared and installed dependencies

Exact installed top-level package versions (`npm ls --depth=0`):

- `astro@6.1.5`
- `@astrojs/sitemap@3.7.2`
- `gsap@3.15.0`

### Node requirement

From `package.json`:

- `node >=22.12.0`

### Scripts

From `package.json`:

| Command | Action |
| --- | --- |
| `npm run dev` | Runs `astro dev` |
| `npm run build` | Runs `astro build` |
| `npm run preview` | Runs `astro preview` |
| `npm run astro` | Runs Astro CLI |

### Astro configuration

From `astro.config.mjs`:

- `site: 'https://finnvek.com'`
- `output: 'static'`
- `@astrojs/sitemap` integration enabled
- `fonts` config exists for:
  - `Sora` -> `--font-sora`
  - `DM Sans` -> `--font-dm-sans`
  - `DM Mono` -> `--font-dm-mono`

Important current-state note:

- The source UI does not use `Sora` or `DM Sans`.
- The emitted build CSS still uses fallbacks like `var(--font-dm-mono)`, but no explicit `--font-dm-mono` definition was found in built HTML/CSS.
- The actual visible typography is primarily driven by self-hosted `@font-face` rules in `src/styles/global.css`, not by any visible Astro-generated font variable definitions.

## Actual Source Structure

```text
src/
  components/
    Footer.astro
    Hero.astro
    LogoAnimated.astro
    LogoStatic.astro
    ProjectCard.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
  styles/
    global.css
  content/
    blog/.gitkeep
  content.config.ts

public/
  apple-touch-icon.png
  favicon.svg
  hero-bg.webp
  knittools-icon.webp
  og-image.png
  robots.txt
  fonts/
    geist-variable.woff2
    routed-gothic.ttf
    routed-gothic-half-italic.ttf
    syne-700.woff2
    syne-800.woff2
    syne-latin-ext.woff2
    teko-500.ttf
```

## Routing And Content Model

### Routes

Implemented route files:

- `src/pages/index.astro` -> `/`

No other pages are defined in `src/pages/`.

### Content collections

`src/content.config.ts` defines one Astro content collection:

- `blog`
  - loader: `glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' })`
  - schema:
    - `title: string`
    - `description: string`
    - `pubDate: date`
    - `updatedDate?: date`

Current actual content state:

- `src/content/blog/` contains only `.gitkeep`
- build emits a warning that no blog files match the configured pattern
- no page currently renders or links blog content

## Page Composition

The live page is composed as follows:

1. `BaseLayout.astro`
2. `Hero.astro`
3. A fixed descriptor paragraph: `Independent software / from Turku, Finland`
4. Notebook-style main area (`main.desk`) containing:
   - spiral ring decoration
   - main paper pad
   - `ProjectCard name="KnitTools"`
   - note text: `More apps on the drafting table`
5. A separate “sticker” aside listing four principles:
   - `Privacy by default / yours`
   - `No ads, no tracking / clean`
   - `Made to last / kept`
   - `Independent / self-funded`
6. `Footer.astro`

## Visual System Actually Implemented

### Theme direction

The current site is not dark-only.

It uses a light paper/desk visual system:

- desk background: `--bg-desk: #cec9be`
- paper background: `--bg-base: #f3f3ee`
- white paper accent: `--white: #fafaf7`
- primary text: `--color-primary: #0e0f10`
- accent: `--color-accent: #1DB4A5`

The page includes paper/grid/noise textures via layered CSS backgrounds and a `body::before` overlay.

### Layout

Desktop (`> 720px`):

- logo fixed vertically on the left using rotation
- descriptor fixed top-right
- content container `.desk` max width: `1200px`
- notebook stack width cap: `560px`
- torn-note sticker width: `380px`, positioned overlapping the notebook area via negative top margin

Mobile (`<= 720px`):

- logo becomes normal horizontal block near top
- descriptor remains fixed, smaller
- sticker becomes full-width below notebook content

### Fonts actually defined in CSS

Self-hosted fonts from `src/styles/global.css`:

- `Geist`
- `Syne`
- `Teko`
- `Routed Gothic` regular
- `Routed Gothic` italic

How they are used:

- Base body/headings: `Geist`
- Main product title: `Teko`
- Descriptor: `Routed Gothic`, then `Syne`, then system fallback
- Various labels/meta rows/footer: `Routed Gothic` with `var(--font-dm-mono)` / `DM Mono` / monospace fallback chain

Important precision note:

- There is no self-hosted `DM Mono` font file in `public/fonts/`.
- Current UI text that references `DM Mono` only does so through fallback font-family chains.

## Components And Behavior

### `Hero.astro`

- Only wraps `LogoAnimated.astro`
- Desktop logo container:
  - `position: fixed`
  - `width: 98.9vh`
  - `transform: rotate(-90deg) translateX(-100%)`
- Mobile logo container:
  - `position: relative`
  - `width: calc(100% - 2rem)`
  - no rotation

### `LogoAnimated.astro`

- Inline SVG wordmark for `FINNVEK`
- SVG `viewBox`: `0 0 402 62`
- Letters animate in using CSS keyframes, not GSAP
- Both turquoise dots animate via CSS keyframes, moving in from the right on both desktop and mobile
- Replay mechanism:
  - clicking the logo toggles `.replay`
  - animation restarts by removing and reapplying animation styles

### `ProjectCard.astro`

Current rendered product content:

- Title: `KnitTools`
- Description:
  - `A pocket companion for knitters. Counts your rows, reads your patterns,`
  - `and keeps your stash quietly in order. With voice and AI that speaks knitter.`
  - `In eleven languages.`
- Spec row:
  - `Android`
  - `11 languages`
  - `Coming soon`
- CTA area contains:
  - waitlist form
  - external link to `https://knittoolsapp.com`

Waitlist form behavior:

- One visible state in markup from first render: email input + submit button
- No collapsed “open later” trigger state exists in current code
- Validation is client-side with a regex
- On valid submit:
  - email is stored in browser `localStorage`
  - key: `fv_waitlist_email`
  - form enters visual success state
  - button text changes to `You're in!`
  - input and button are disabled
- On invalid submit:
  - button text changes to `Check your email`
- On reload:
  - saved email is restored from `localStorage`
  - form is immediately shown in success state

Critical implementation note:

- The waitlist form does not submit to a backend.
- No `fetch`, XHR, form `action`, or third-party form endpoint is implemented.
- The current behavior is local-browser-only persistence.

### `Footer.astro`

Footer content:

- `Finnvek`
- `60.4518° N · 22.2666° E`
- `contact@finnvek.com`
- `Turku, Finland`

Footer layout:

- centered on desktop and mobile
- wraps on small screens
- coordinates move to their own row on mobile

### `LogoStatic.astro`

- Present in the repository
- Not referenced anywhere in `src/`
- Currently unused

## Animation Model Actually Used

Current implementation uses:

- CSS keyframe animations
- minimal vanilla DOM scripting for replay and waitlist state

No current source file imports or uses GSAP.

That means:

- `gsap` is installed as a dependency
- but it is not used by the current shipped source under `src/`

Implemented visual motion:

- logo letters slide in from the right
- F and E letters briefly “squish” after dot impact
- turquoise dots bounce from the right
- generic `.reveal` fade-up animation for descriptor, sticker, footer, and note text
- waitlist button pressed/success state transitions

Not implemented in current source:

- cursor grid reveal
- card border trace animation
- scroll-triggered GSAP sequences
- app icon stamp/drop animation

## SEO And Metadata

From `BaseLayout.astro`:

- canonical URL: `https://finnvek.com/`
- description: `Independent software from Turku, Finland.`
- Open Graph:
  - title
  - description
  - type `website`
  - url `https://finnvek.com`
  - image `https://finnvek.com/og-image.png`
  - image size `1200x630`
- Twitter card: `summary_large_image`
- theme-color: `#0A0A0F`
- favicon: `/favicon.svg`
- Apple touch icon: `/apple-touch-icon.png`
- JSON-LD organization schema:
  - name
  - url
  - description
  - email
  - locality/country

## Build Output And Verified Behavior

Verified with `npm run build` on 2026-04-22:

- build succeeds
- output mode is `static`
- output directory is `dist/`
- one page is built: `/index.html`
- sitemap is generated:
  - `dist/sitemap-0.xml`
  - `dist/sitemap-index.xml`

`public/robots.txt` currently contains:

- `User-agent: *`
- `Allow: /`
- `Sitemap: https://finnvek.com/sitemap-index.xml`

## Current Mismatches / Cleanup Candidates

These are not guesses; they are direct mismatches between repository code/config and the previously documented state:

- `PROJECT.md` previously described a dark editorial design, but current CSS implements a light paper/desk theme.
- `PROJECT.md` previously described GSAP-driven animations, but current source uses CSS keyframes and vanilla JS only.
- `gsap` remains installed but unused in `src/`.
- `astro.config.mjs` still contains Google-font configuration for `Sora`, `DM Sans`, and `DM Mono`, but current UI does not visibly use `Sora` or `DM Sans`.
- `LogoStatic.astro` is unused.
- `public/hero-bg.webp` is present in the repo and copied to `dist/`, but no current source file references it.
- Blog collection infrastructure exists, but there are no blog entries and no rendered blog route.
- No hosting provider is provable from committed runtime config alone. The site is suitable for static hosting, but no Cloudflare-specific adapter or deployment config is committed in this repo.

## Short Truth Summary

As of the current codebase, this repository is a one-page static Astro marketing site for Finnvek with a notebook/paper visual style, one showcased product (`KnitTools`), a purely local `localStorage`-based waitlist interaction, SEO metadata and sitemap generation, and no backend or additional routed content pages.
