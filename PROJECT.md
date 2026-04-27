# Finnvek.com

Code-backed project summary for the current repository state in `/home/emma/dev/Finnvek-website/finnvek-site`.

This document is intentionally strict: it describes what is verifiably implemented in code today, not what earlier design notes or plans may have intended.

Last verified against the codebase: 2026-04-27.

## Overview

- Public site URL configured in Astro: `https://finnvek.com`
- Site type: static Astro site
- Routed pages in source: 2 (`src/pages/index.astro`, `src/pages/privacy.astro`)
- HTML language: `en`
- Brand/contact values hard-coded in pages/footer:
  - Company name: `Finnvek`
  - Contact email: `contact@finnvek.com`
  - Locality on privacy page: `Turku, Finland`
  - Footer year string: `2026`

## Runtime And Build Stack

### Declared dependencies (`package.json`)

- `astro@^6.1.9`
- `@astrojs/sitemap@^3.7.2`
- `gsap@^3.15.0`

### Node requirement

- `node >=22.12.0`

### Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | `astro dev` |
| `npm run build` | `astro build` |
| `npm run preview` | `astro preview` |
| `npm run astro` | Astro CLI |

### Astro configuration (`astro.config.mjs`)

- `site: 'https://finnvek.com'`
- `output`: not set (defaults to `static`)
- `@astrojs/sitemap` integration enabled
- `fonts` config (Astro fonts API, Google provider):
  - `Boldonse` -> `--font-display`, weights `[400]`, normal style
  - `Newsreader` -> `--font-body`, weights `'400 700'` (variable range), styles `['normal', 'italic']`

`BaseLayout.astro` preloads both font CSS variables via `<Font cssVariable="..." preload />` and additionally preloads the local logo font at `/fonts/first.ttf`.

## Actual Source Structure

```text
src/
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    privacy.astro
  scripts/
    home-animations.ts
  styles/
    global.css

public/
  apple-touch-icon.png
  favicon.svg
  finnvek-about.webp
  finnvek-logo.svg
  knittools-phone.png
  laptop.webp
  robots.txt
  fonts/
    first.ttf
```

There is no `src/components/` directory; page-level markup is inline in the `.astro` files. There is no `src/content/` directory and no `content.config.ts`; Astro content collections are not used.

The repository root also contains parallel `*-v1-archive` artifacts (`src-v1-archive/`, `public-v1-archive/`, `astro.config-v1-archive.mjs`, `package-v1-archive.json`, `tsconfig-v1-archive.json`, `routed-gothic-ttf-v1.0.0/`). These are archived snapshots of the previous design and are not part of the current build.

## Routing And Content Model

### Routes

- `src/pages/index.astro` -> `/`
- `src/pages/privacy.astro` -> `/privacy/`

### Content collections

None.

## Page Composition

### Index page (`/`)

`src/pages/index.astro` renders inside `BaseLayout` and contains:

1. `<header class="masthead">`
   - Inline SVG `FINNVEK` wordmark (`[data-hero-logo]`, `viewBox="0 28 1000 150"`, `textLength="1000"` so the word stretches edge-to-edge of the SVG, font-family `--font-logo-stack` -> `'First', system-ui, sans-serif`, font-size 200px)
   - `.masthead-tagline` with two `<span>` lines:
     - `Independent software` (uppercase, large, letter-spacing 0.18em, scaled `clamp(2.5rem, 4vw, 4.5rem)`, top-margin `-0.55em` so it overlaps the bottom of the wordmark)
     - `from Turku, Finland.` (uppercase, smaller, letter-spacing 0.22em, dimmed)
2. `<section class="about" data-about>` — two-column grid (`1fr 1fr`):
   - `.about-content`: `<h2 class="section-heading">About</h2>`, four paragraphs, and a `.signature` `— Emma`. Each text element carries `data-about-line`.
   - `.about-image`: `<img src="/laptop.webp" width="448" height="557" loading="lazy" />` of "a dark workspace: laptop, coffee mug, and open notebook with a pencil." Also tagged `data-about-line`.
3. `<hr class="section-divider" data-section-line />` — 1px horizontal rule between sections
4. `<section class="knittools" data-knittools>` — two-column grid (`1fr 1fr`):
   - `.knittools-image` (`[data-knittools-image][data-parallax-wrap]`): `<img src="/knittools-phone.png" width="862" height="1825" loading="lazy" />`
   - `.knittools-content`: eyebrow `Coming soon`, `<h2>KnitTools</h2>`, description paragraph, `<dl class="info-table">` with `Status / Coming soon`, `Platform / Android`, `Languages / 11`, `<form class="notify-form" data-notify-form>` (email input + `Notify me at launch` button), and `<a class="link-primary" href="https://knittoolsapp.com">knittoolsapp.com →</a>`. Each child carries `data-knittools-line`.
5. `<footer class="site-footer">`:
   - `.footer-brand`: `FINNVEK` (logo font) + lowercase tagline `built to last`
   - `.footer-meta`: `mailto:contact@finnvek.com`, `© 2026`, `/privacy`

The page imports `../scripts/home-animations` via a `<script>` block.

### Privacy page (`/privacy/`)

`src/pages/privacy.astro` renders inside `BaseLayout` (with overridden `title` and `description`) and contains:

- `<header class="site-header">` with the SVG-asset logo at `/finnvek-logo.svg`
- `<div class="page"><section class="prose">` with `<h1>Privacy</h1>` and the placeholder text `Privacy policy coming with product launch.`
- A bespoke footer (`.footer-brand` plain "Finnvek" + `.footer-meta` containing `Turku, Finland`, `2026`, `contact@finnvek.com`, `/privacy`)

Mismatch note: the privacy footer markup does not match the index footer markup. There is no `.site-header`, `.page`, `.footer-facts`, or `.footer-links` selector in `src/styles/global.css`, so this page renders unstyled for those wrappers (only `.prose`, `.site-footer`, `.footer-inner`, `.footer-meta` get styled). The page also does not import `home-animations`.

## Visual System Actually Implemented

### Theme

Dark, black-and-white-only — no accent color is defined in the current CSS (the previous turquoise `--color-accent` is gone).

CSS custom properties on `:root` in `src/styles/global.css`:

- `--color-bg: #08080A`
- `--color-surface-footer: #0C0C0C`
- `--color-text: #F0F0EC`
- `--color-text-muted: #9A9A95`
- `--color-text-dimmed: #5F5F5A`
- `--color-border: #2A2A2A`
- `--color-border-faint: #1A1A1A`
- `--container-wide: 1180px`
- `--container-prose: 720px`
- `--gutter: 2.5rem` (collapses to `1.25rem` at `<= 640px`)
- `--font-display-stack: var(--font-display), 'Boldonse', sans-serif`
- `--font-body-stack: var(--font-body), Newsreader, Georgia, serif`
- `--font-logo-stack: 'First', system-ui, sans-serif`

There are no paper, grid, or noise textures in the current CSS.

### Fonts actually used

- Local `@font-face` "First" loaded from `/fonts/first.ttf` (`font-display: swap`) — used by the wordmark SVG `<text>` and the footer wordmark.
- `Boldonse` is configured in `astro.config.mjs` and exposed as `--font-display`, but **no selector in `global.css` references `--font-display-stack` or `--font-display`**. The variable is currently unused at the CSS layer.
- `Newsreader` (`--font-body`) is the body default and is also explicitly applied to the masthead tagline, section headings, paragraphs, signature, eyebrow, info table, notify form, link-primary, footer wordmark line-height context, and prose.
- Section headings use `--font-body-stack` at weight 700 (Newsreader bold), not the Boldonse display face.
- Font fallback chains resolve to `Georgia, serif` for body and `system-ui, sans-serif` for the logo face.

### Layout

Desktop (`> 900px`):

- `.about` and `.knittools` share `max-width: 1180px`, `padding: 0 var(--gutter)`, two-column grid `minmax(0, 1fr) minmax(0, 1fr)`, gap `clamp(2.5rem, 6vw, 5rem)`.
- `.about` top margin `clamp(8rem, 16vw, 14rem)`.
- `.about-content` max-width `36rem`; `.about-image` justify-self `end`, max-width `28rem`.
- `.section-heading` `clamp(2.5rem, 7vw, 6.5rem)`, weight 700, letter-spacing `-0.02em`.
- `.section-divider` 1px line, full container width minus gutters, `transform-origin: left center` (animated via `data-section-line`).
- `.knittools` top margin `clamp(4rem, 8vw, 7rem)`; `.knittools-image` justify-self `start`, max-width `22rem`, inner img capped at 280px.
- `.notify-form` is a single bordered grid (`1fr auto`) with input and button flush; max-width `30rem`.
- `.site-footer` has its own background `#0C0C0C`, top margin `clamp(8rem, 16vw, 14rem)`, padding `clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem)`. `.footer-inner` is a flex row with `space-between`, `align-items: flex-end`.

Tablet/small desktop (`<= 900px`):

- `.about` and `.knittools` collapse to a single column with 2.5rem gap; `.about-image` and `.knittools-image` left-align, max-width 24rem.

Mobile (`<= 640px`):

- `--gutter` drops to `1.25rem`.
- `.masthead-tagline` font-size `0.7rem` with letter-spacing `0.18em`.
- `.about` top margin `5rem`.
- `.section-heading` `clamp(2rem, 9vw, 3rem)`.
- `.footer-inner` becomes a vertical stack, left-aligned.
- `.info-row` becomes `1fr 1fr`.
- `.notify-form` becomes single column; the input gets a bottom border instead of right border.

## Behavior

### Notify form (`src/scripts/home-animations.ts`, `setupNotifyForm`)

- Listens for `submit` on `[data-notify-form]`
- Calls `notifyForm.reportValidity()` and bails on invalid input
- On valid submit:
  - replaces the form's children with a single `<span>You're in!</span>`
  - adds class `is-complete` for styling
  - if motion is allowed, plays a short GSAP timeline that fades the controls out, swaps content, then fades the success state in
- `prefers-reduced-motion: reduce` skips the GSAP timeline and applies the success state directly

Critical implementation note:

- The notify form does not submit to a backend.
- No `fetch`, XHR, form `action`, or third-party form endpoint is implemented.
- Submitted email values are not persisted anywhere — neither to a server nor to `localStorage`. Once the form is replaced, the email is gone.

### Animations (`src/scripts/home-animations.ts`)

Uses `gsap` with the `ScrollTrigger` and `SplitText` plugins. All scroll-triggered effects are gated by `prefers-reduced-motion: reduce`.

Implemented sequences:

- `setupMastheadReveal` — on load, fades and slides the wordmark down from `y: -12`, then fades the masthead tagline up from `y: 8` (overlapping by 0.4s).
- `setupAboutReveal` — once-fired ScrollTrigger at `top 80%`. SplitText splits each text-bearing `[data-about-line]` (heading, paragraphs, signature) into words; words animate from `autoAlpha: 0, y: 12, blur(8px)` to visible with a `0.015s` stagger. The about image fades and rises from `y: 18, scale: 0.98` in parallel.
- `setupSectionLines` — for every `[data-section-line]`, scales the divider from `scaleX: 0` to `1` based on scroll progress between `top bottom` and `top 40%`, with monotonic-only progression (it never shrinks back).
- `setupKnittoolsReveal` — once-fired ScrollTrigger at `top 75%`. The phone image scales+fades in (`0.96 -> 1`); SplitText words on eyebrow/heading/description fade in with blur cleanup; remaining `[data-knittools-line]` elements (info table, form, link) slide in from `y: 16` with a 0.06s stagger.
- `setupParallax` — gated to `(min-width: 901px)` via `gsap.matchMedia()`. Applies a scrubbed `y: -18` translate to the KnitTools phone image as the wrap scrolls past.

There is no longer a separate `clock.ts` module, no `[data-logo-dot]` SVG circles, no `[data-reveal]` generic helper, and no eyebrow-on-hero animation — the index page no longer has a hero h1, only the wordmark masthead and the two content sections.

## SEO And Metadata

From `BaseLayout.astro`:

- canonical URL: built dynamically from `Astro.url.pathname` and `Astro.site`
- default title: `Finnvek. Software that's built to last.`
- default description: `Independent software from Turku, Finland. One developer, building products with care. First app: KnitTools, coming soon.`
- privacy page overrides title to `Privacy. Finnvek` and description to `Finnvek privacy policy.`
- Open Graph: `type: website`, `title`, `description`, `url`. **No `og:image` is emitted.**
- Twitter card: `summary` (text-only) with title and description. **No `twitter:image` is emitted.**
- theme-color: `#08080A`
- favicon: `/favicon.svg`
- Apple touch icon: `/apple-touch-icon.png` (180×180)
- No JSON-LD organization schema is emitted by the current layout.

`public/robots.txt`:

- `User-agent: *`
- `Allow: /`
- `Sitemap: https://finnvek.com/sitemap-index.xml`

## Current Mismatches / Cleanup Candidates

These are direct mismatches between repository code/config and current shipped behavior. They are not guesses.

- **Boldonse is configured but unused.** `astro.config.mjs` declares `Boldonse` as `--font-display` and `BaseLayout` preloads it, but no rule in `src/styles/global.css` consumes `--font-display(-stack)`. Either start using it for headings/eyebrows or drop it to save a font request.
- **`privacy.astro` footer markup doesn't match its CSS.** It uses `.site-header`, `.page`, `.footer-facts`, `.footer-links`, none of which exist in `global.css`. The `.footer-brand` element is also a plain `<div>` text "Finnvek" rather than the index page's logo-font wordmark + tagline structure. Either align it with the index footer or add styles for these selectors.
- **`finnvek-about.webp` is in `public/` but no page references it.** The about section uses `/laptop.webp` instead. Confirm which is the keeper and remove the other to avoid asset rot.
- **`public/finnvek-logo.svg` is only referenced from `privacy.astro`.** The index page uses an inline `FINNVEK` SVG `<text>` rendered with the local "First" font.
- **OG/Twitter images removed.** The page no longer ships any social preview image. If you want link-unfurl previews, add `og:image` and `twitter:image` (and switch the Twitter card back to `summary_large_image`) plus an asset in `public/`.
- **No `dist/` is currently checked into the working tree** (it is gitignored / untracked). Provider-side build still works via `npm run build`.
- **Loose markdown design specs at the repo root** (`finnvek-redesign*.md`, `finnvek-v2-*.md`, `finnvek-rollback-spec.md`, `finnvek-updates-spec.md`, `finnvektieto.md`, `finnvek-design-changes.md`, `finnvek-preview-spec.md`, `finnvek-v2-refinement-patch-01.md`, `hero-update.md`, `section-headings-update.md`, `typography-update.md`, `og-image-template.html`, `finnvek-logo-animation.html`, plus loose binaries `icon_splash_screen.webp`, `row-counter-knittools.png`, `laptop.png`, and the `first-font/` directory) are not used by the build. They live here as design notes / source assets and could move into a `docs/` or `design-notes/` folder.
- **Parallel `*-v1-archive` artifacts** (`src-v1-archive/`, `public-v1-archive/`, `astro.config-v1-archive.mjs`, `package-v1-archive.json`, `tsconfig-v1-archive.json`, `routed-gothic-ttf-v1.0.0/`) are kept as snapshots of the previous design and are not wired into the current build.
- **`README.md` is still the unmodified Astro minimal starter template.**
- **No hosting provider is provable from committed runtime config alone.** No provider-specific adapter or deployment config is committed.

## Short Truth Summary

This repository is a small static Astro 6 site for Finnvek with two routes (`/` and `/privacy/`). The visual system is dark and monochrome — no accent color — built around three faces: a local custom font "First" (`first.ttf`) used for the giant edge-to-edge `FINNVEK` wordmark and the footer logo, `Newsreader` for everything else, and `Boldonse` declared but currently unused. The home page is a wordmark masthead with an overlapping uppercase tagline, a two-column About section with a laptop image, a 1px scrubbed divider, a two-column KnitTools section with a phone image and a non-persistent in-page notify form, and a contact-strip footer. GSAP + ScrollTrigger + SplitText drive the load and scroll reveals; the parallax effect is desktop-only (≥901px). There is no backend, no content collections, no localStorage persistence, no JSON-LD, and no social preview image.
