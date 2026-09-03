<!-- generated-by: gsd-doc-writer -->
# Finnvek.com implementation reference

## Overview

Finnvek.com is a small static Astro site for the Android apps created by Emma Hotakainen. It presents KnitTools, runcheck, dBcheck, and fonecheck; explains the person behind Finnvek; and publishes one shared privacy policy for the released apps.

The current source has three routes:

| Source | Route | Purpose |
|---|---|---|
| `src/pages/index.astro` | `/` | Brand hero and app overview |
| `src/pages/about.astro` | `/about/` | Creator and brand information |
| `src/pages/privacy.md` | `/privacy/` | Privacy policy for KnitTools, runcheck, and dBcheck |

The site is rendered as static HTML and client-side JavaScript. There are no Astro API routes, server-rendered pages, content collections, databases, or authentication flows in this repository.

## Runtime and dependencies

`package.json` declares:

- Node.js `>=22.12.0`
- Astro `^7.0.4`
- `@astrojs/sitemap` `^3.7.3`
- GSAP `^3.15.0`

`package-lock.json` uses lockfile version 3 and currently resolves Astro 7.0.4, `@astrojs/sitemap` 3.7.3, and GSAP 3.15.0.

Available npm commands:

| Command | Behavior |
|---|---|
| `npm run dev` | Starts the Astro development server |
| `npm run build` | Generates the static site in `dist/` |
| `npm run preview` | Serves the completed production build locally |
| `npm run astro -- <args>` | Runs the Astro CLI |

There are no lint, format, test, or deployment scripts in `package.json`.

## Configuration

### Astro

`astro.config.mjs` sets the canonical site origin to `https://finnvek.com`, enables `@astrojs/sitemap`, and configures two Google-hosted font families through Astro's font provider:

- IBM Plex Sans as `--font-body`, normal and italic, weights 400 through 700
- Epilogue as `--font-sans`, normal and italic, weights 400 through 500

Astro's default static output mode is used.

### TypeScript

`tsconfig.json` extends `astro/tsconfigs/strict`, includes generated Astro types and all project files, and excludes `dist`.

### Environment and external values

The current source does not read environment variables. Two external integrations are configured directly in source:

- Cloudflare Web Analytics in `src/layouts/BaseLayout.astro`
- the launch-notification endpoint `https://api.finnvek.com/subscribe` in `src/scripts/home-animations.ts`

No deployment configuration or CI workflow is present in this repository.

## Architecture

```text
Astro pages
  -> shared layouts
     -> BaseLayout: document metadata, fonts, analytics, global CSS
     -> PolicyLayout: privacy-page composition
  -> shared components
     -> SiteHeader: navigation and compact Finnvek logo
     -> SiteFooter: footer brand, links, and current-page state
  -> browser scripts
     -> site-header.ts: mobile menu and scroll-aware compact logo
     -> brand-link-animations.ts: shared Finnvek wordmark interactions
     -> home-animations.ts: home motion and notification form
  -> global.css: design tokens, layout, typography, states, breakpoints
```

Astro renders the pages and components at build time. The three TypeScript modules enhance the resulting HTML in the browser. Static files under `public/` are copied directly; imported files under `src/assets/` are handled by Astro or Vite.

## Directory structure

```text
src/
  assets/
    dbcheck-logo.svg
    emma-hotakainen-finnvek.png
  components/
    SiteFooter.astro
    SiteHeader.astro
  layouts/
    BaseLayout.astro
    PolicyLayout.astro
  pages/
    about.astro
    index.astro
    privacy.md
  scripts/
    brand-link-animations.ts
    home-animations.ts
    site-header.ts
  styles/
    global.css
public/
  .well-known/security.txt
  apple-touch-icon.png
  favicon-48x48.png
  favicon.svg
  fonts/
  images/
  robots.txt
```

Generated `.astro/` types, `dist/`, and `node_modules/` are ignored. The `first-font/` directory is also ignored; only its license file remains locally after the duplicate font binary was removed. The used copy of the font is `public/fonts/first.ttf`.

## Shared document shell

`src/layouts/BaseLayout.astro` owns the HTML document and imports `global.css`. Its responsibilities are:

- `lang="en"`, UTF-8, responsive viewport, Astro generator metadata, and theme color
- per-page title and description props with home-page defaults
- canonical URL derived from `Astro.url.pathname` and the configured `Astro.site`
- Open Graph title, description, type, and URL
- Twitter summary-card title and description
- SVG, 48-pixel PNG, and Apple touch icons
- preload of Astro's IBM Plex Sans and Epilogue font variables
- preload of local First and League Gothic files
- Cloudflare Web Analytics

The layout intentionally has no Open Graph or Twitter image metadata.

## Shared header

`src/components/SiteHeader.astro` accepts:

- `home?: boolean`, which gives the header zero document-flow height while the large home hero is visible
- `current?: 'about'`, which applies `aria-current="page"` to the About link

The header contains a compact Finnvek home link, a native menu button, and Apps, About, and Contact links. The inner header is fixed to the top of the viewport. On desktop the navigation remains visible. At 760 pixels and below it becomes a right-aligned hamburger menu.

`src/scripts/site-header.ts`:

- synchronizes the open class, `aria-expanded`, and the menu button's accessible label
- closes the menu after a navigation-link click, an outside pointer press, Escape, or a switch back to desktop width
- returns keyboard focus to the menu button when Escape closes the menu
- observes the home hero wordmark and reveals the compact Finnvek logo when less than 12 percent of the hero wordmark remains visible
- dispatches `finnvek:logo-visible` when the compact home logo first becomes visible

## Shared footer

`src/components/SiteFooter.astro` accepts `current?: 'about' | 'privacy'`. It renders:

- an animated Finnvek home link and the tagline `built to last`
- About, Contact, and Privacy Policy links
- the 2026 copyright year
- `aria-current="page"` for About or Privacy when requested by the page

The component is used by all three routes. Header and footer links share the `.site-link` color and focus treatment, while each container keeps its own typography.

## Home page

`src/pages/index.astro` is composed in this order:

1. Shared home header
2. Full-viewport Finnvek hero
3. Apps divider and KnitTools section
4. runcheck section
5. dBcheck section
6. fonecheck section
7. Shared footer

The hero contains the large text-rendered First-font wordmark, the headline `Software made for years. Not weeks.`, and a decorative vertical scroll cue.

### App sections

Each app uses the same two-column product structure with alternating image and text order on desktop. Product sections collapse to a single column at 900 pixels.

| App | Current visual | Destination | Motion marker |
|---|---|---|---|
| KnitTools | `/images/knittools.webp` plus a Teko name | `https://knittoolsapp.com` | roll-in and hover stamp |
| runcheck | inline root-level `runcheck-logo.svg` plus a Manrope name | `https://runcheckapp.com` | split hook-and-arrow reveal, settle glow, and shine sweep |
| dBcheck | imported `src/assets/dbcheck-logo.svg` plus a text name | `https://dbcheck.app` | segmented signal reveal and response |
| fonecheck | text-only name | none | normal text reveal |

The root-level `runcheck-logo.svg` is imported as raw markup so its hook and arrow groups can be animated independently. Reduced-motion mode renders the complete logo immediately and disables its shine sweep.

### Launch-notification form

The KnitTools form contains:

- a required email input
- a visually hidden `website` honeypot field
- a submit button and live error region

Submission is intercepted in `home-animations.ts` and sent as JSON to `https://api.finnvek.com/subscribe`:

```json
{
  "email": "trimmed input value",
  "source": "finnvek",
  "website": "honeypot value"
}
```

The browser aborts the request after ten seconds. The UI distinguishes server errors, request timeouts, and network failures. A successful response replaces the form controls with `You're in!`.

## About page

`src/pages/about.astro` uses `BaseLayout`, `SiteHeader`, and `SiteFooter`. Its main article contains:

- an About heading and creator introduction
- an Astro `Picture` generated from `src/assets/emma-hotakainen-finnvek.png`
- AVIF and WebP sources with PNG fallback at widths 360, 540, 720, and the source width
- an app list covering KnitTools, runcheck, dBcheck, and fonecheck
- additional copy about ownership, product decisions, advertising, research, and Turku

The portrait layout is two-column above 64rem and becomes a single-column reading order below that breakpoint.

## Privacy page

`src/pages/privacy.md` uses `PolicyLayout.astro`. The layout resolves title and description from direct props or Markdown frontmatter, then composes the shared header, a `.prose.privacy-policy` section, and the shared footer.

The policy currently covers:

- shared privacy principles and Firebase Crashlytics
- KnitTools local data, permissions, Ravelry, and Firebase backend behavior
- runcheck local data, Android access, M-Lab measurements, exports, and retention
- dBcheck local data, microphone and other permissions, Health Connect, exports, backups, and recordings
- legal bases, user rights, children, and policy changes

The policy's displayed revision date is 16 July 2026.

## Styling system

All site styles live in `src/styles/global.css`. The main tokens are:

- background `#08080A`
- footer surface `#0C0C0C`
- primary text `#F0F0EC`
- muted text `#9A9A95`
- dimmed text `#5F5F5A`
- borders `#2A2A2A` and `#1A1A1A`
- gold accent `#D9A24E`, stored in the legacy custom property `--red`
- dark gold `#A9782E`, stored as `--red-dark`
- wide content maximum 1180 pixels
- prose maximum 720 pixels
- default horizontal gutter 2.5rem and mobile gutter 1.25rem

The typography families are IBM Plex Sans for body copy, League Gothic for display headings, Epilogue for interface text, First for Finnvek wordmarks, Teko for KnitTools, and Manrope for runcheck.

## Motion

`src/scripts/home-animations.ts` registers GSAP ScrollTrigger and SplitText and controls:

- hero character reveal and temporary gold pulse
- desktop fine-pointer hero parallax after a short delay
- scroll-cue fade
- progressively drawn section divider
- product text and logo reveals
- app-specific hover and focus logo responses
- footer entrance
- notification-form success transition

`src/scripts/brand-link-animations.ts` provides the shared Finnvek character wave used by the compact header wordmark and footer wordmark. Fine-pointer devices trigger it by hover or focus. Coarse-pointer devices trigger inner-page headers on load and footer branding when it enters the viewport. The compact home logo triggers when it is revealed during scrolling.

When `prefers-reduced-motion: reduce` is active, the GSAP page and wordmark animations are skipped or resolved immediately. CSS also removes the animated scroll cue and structural header/menu transitions.

## Accessibility and input behavior

The implementation includes:

- semantic headings and page landmarks
- accessible names for brand and app-logo links
- empty alternative text or `aria-hidden` for decorative imagery inside already named links
- descriptive alternative text for the About portrait
- a native menu button with `aria-controls` and `aria-expanded`
- current-page states in shared navigation
- visible keyboard focus outlines on shared navigation and branded links
- visually hidden form labels and a live error message
- 44-pixel mobile menu and navigation targets
- reduced-motion handling

## Published static files

- `public/robots.txt` allows crawling and points to `https://finnvek.com/sitemap-index.xml`.
- `public/.well-known/security.txt` publishes the Finnvek security contact and canonical security URL.
- `public/favicon.svg`, `public/favicon-48x48.png`, and `public/apple-touch-icon.png` provide browser and device icons.
- `public/fonts/` contains the local First, League Gothic, Teko, and Manrope files used by CSS.
- `public/images/` contains the current KnitTools and runcheck raster images.

## Validation boundaries

The repository currently has no automated test suite, lint configuration, formatter configuration, or CI workflow. The available project-level validation is:

```bash
npm run build
git diff --check
```

Browser-based responsive and interaction checks are appropriate for navigation, motion, focus, and layout changes.
