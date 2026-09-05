<!-- generated-by: gsd-doc-writer -->
# Finnvek.com current implementation reference

Last source verification: 4 September 2026

## Purpose and authority

This document is a detailed map of the implementation currently present in the `finnvek-site` repository. It is intended to support code-review questions, UI decisions, accessibility reviews, content changes, security reviews, and release checks.

The live source is authoritative. This file explains where to look and which contracts connect the files, but it is not proof that a behavior still exists after later changes. When sources disagree, use this order:

1. Current tracked source and configuration
2. A fresh local production build and its generated output
3. This `PROJECT.md` reference
4. `UI-SPEC.md` and `README.md`
5. Historical plans or specifications outside this repository

The Git repository root is `finnvek-site/`. The parent file `../finnvek-site-spec.md` is outside this repository and is not implementation evidence. `UI-SPEC.md` is a useful companion for UI intent, but UI claims must still be checked against `src/styles/global.css`, the Astro markup, and the browser scripts.

## Product and repository scope

Finnvek.com is an English-language static website for Android apps created by Emma Hotakainen. The current site:

- presents KnitTools, runcheck, dBcheck, and fonecheck on the home page;
- explains the developer and Finnvek brand on the About page;
- publishes a shared privacy policy for KnitTools, runcheck, and dBcheck;
- provides a KnitTools launch-notification form;
- loads Cloudflare Web Analytics on every page;
- generates canonical metadata and an XML sitemap at build time.

The repository does not implement the Android apps or the subscription backend. It also contains no authentication, user accounts, database, server-rendered route, Astro API endpoint, content collection, CMS integration, middleware, service worker, client-side router, UI-framework island, automated deployment workflow, or test suite.

The privacy page proves which statements the website publishes. It does not prove that the separate Android applications still behave as described. App-specific privacy claims must be revalidated in the corresponding app repositories before a policy or release review treats them as current facts.

## Implemented routes

Astro file-based routing currently builds exactly three pages:

| Source | Built route | Layout path | Page title source | Authored browser bundles |
| --- | --- | --- | --- | --- |
| `src/pages/index.astro` | `/` | `BaseLayout` directly | `BaseLayout` default | shared header bundle plus home bundle |
| `src/pages/about.astro` | `/about/` | `BaseLayout` directly | explicit `About | Finnvek` prop | shared header bundle |
| `src/pages/privacy.md` | `/privacy/` | `PolicyLayout` then `BaseLayout` | Markdown frontmatter | shared header bundle |

There is no authored 404 page. There are no dynamic parameters, redirects, locale-prefixed routes, feeds, or endpoint files under `src/pages/`.

The footer links to `/privacy` without a trailing slash. The generated canonical URL and sitemap entry are `/privacy/`.

## Technology and dependency baseline

### Direct project requirements

`package.json` declares:

| Item | Declared value | Current role |
| --- | --- | --- |
| Package name | `finnvek` | npm project identity |
| Package version | `0.0.1` | local package metadata; not a site release version |
| Module mode | `type: module` | ESM configuration and scripts |
| Node.js | `>=22.12.0` | required runtime for Astro and Vite |
| `astro` | `^7.3.1` | static page, Markdown, image, SVG, script, style, and font build pipeline |
| `@astrojs/sitemap` | `^3.7.4` | generated sitemap index and URL set |
| `gsap` | `^3.15.0` | browser motion, ScrollTrigger, and SplitText |

`package-lock.json` uses lockfile version 3 and currently resolves the direct dependencies to Astro 7.3.1, `@astrojs/sitemap` 3.7.4, and GSAP 3.15.0. Reviews that change dependency ranges must inspect the resolved lockfile graph as well as `package.json`.

There are no `devDependencies`. Build tooling, image processing, Markdown handling, Vite, and their platform-specific binaries arrive transitively through Astro and its dependencies.

### Available commands

| Command | Exact script | Result |
| --- | --- | --- |
| `npm run dev` | `astro dev` | starts the local development server |
| `npm run build` | `astro build` | writes the static production artifact to `dist/` |
| `npm run preview` | `astro preview` | serves a previously built artifact locally |
| `npm run astro -- <args>` | `astro` | forwards arguments to the Astro CLI |

There is no npm script for linting, formatting, type-checking, unit tests, browser tests, accessibility tests, security scanning, or deployment. `astro check` is not configured as a script, and `@astrojs/check` is not a direct dependency. A passing `astro build` is therefore not evidence that a dedicated Astro type check or any browser-level behavior passed.

### Editor configuration

- `.vscode/extensions.json` recommends `astro-build.astro-vscode`.
- `.vscode/launch.json` starts `./node_modules/.bin/astro dev` through a Node terminal configuration named `Development server`.
- `tsconfig.json` extends `astro/tsconfigs/strict`, includes `.astro/types.d.ts` and all project files, and excludes `dist`.

## Astro configuration and build model

`astro.config.mjs` owns the project-wide Astro configuration:

- `site` is `https://finnvek.com`;
- `@astrojs/sitemap` is the only integration;
- no adapter is configured;
- no `output` override is configured, so the project uses Astro's static output;
- no custom `base`, trailing-slash policy, output directory, public directory, image service, Vite plugin, headers, redirects, prefetching, or experimental feature is configured.

The build is a static generation pipeline:

```text
src/pages files
  -> Astro layouts and components
  -> static HTML pages
  -> Vite browser-module bundles for authored scripts
  -> one generated global CSS asset
  -> optimized imported images and SVG assets
  -> copied public assets
  -> sitemap-index.xml and sitemap-0.xml
```

No application server is required to render the built pages. Runtime behavior in the browser comes from native DOM APIs, `fetch`, GSAP, and the externally loaded Cloudflare analytics script.

### Font configuration

Astro Font is configured with the Google provider for:

| Name | CSS variable | Configured weight range | Styles |
| --- | --- | --- | --- |
| IBM Plex Sans | `--font-body` | 400 through 700 | normal and italic |
| Epilogue | `--font-sans` | 400 through 500 | normal and italic |

`BaseLayout.astro` uses Astro's `<Font>` component with `preload` for both variables. A successful production build emits hashed local WOFF2 font assets and preload links. Browsers consume those built assets; the current HTML does not include a Google Fonts stylesheet URL.

First, League Gothic, Teko, and Manrope are separate repository-owned static font files declared with `@font-face` in `global.css`.

## Source and ownership map

| Path | Responsibility | Review when changing |
| --- | --- | --- |
| `package.json` | direct dependencies, Node engine, npm commands | toolchain, scripts, direct dependency policy |
| `package-lock.json` | exact resolved dependency graph | reproducibility, transitive risk, integrity |
| `astro.config.mjs` | canonical origin, sitemap, Astro Font | routing metadata, font build, deployment assumptions |
| `tsconfig.json` | strict Astro TypeScript baseline | source inclusion and editor diagnostics |
| `src/layouts/BaseLayout.astro` | complete HTML document shell | metadata, icons, fonts, analytics, global CSS |
| `src/layouts/PolicyLayout.astro` | privacy-page composition | frontmatter precedence, header/footer, prose wrapper |
| `src/components/SiteHeader.astro` | shared header markup and prop contract | navigation, home mode, accessible menu |
| `src/components/SiteFooter.astro` | shared footer markup and prop contract | links, current-page semantics, brand home link |
| `src/pages/index.astro` | home content and all app presentations | product status, outbound links, form markup, motion hooks |
| `src/pages/about.astro` | developer narrative and portrait | product descriptions, image pipeline, page metadata |
| `src/pages/privacy.md` | published app privacy policy | legal copy and cross-repository app behavior claims |
| `src/scripts/site-header.ts` | menu and compact-home-logo state | breakpoint parity, focus, event state, observer threshold |
| `src/scripts/brand-link-animations.ts` | shared Finnvek wordmark interactions | pointer modes, focus behavior, reduced motion |
| `src/scripts/home-animations.ts` | home motion and notification submission | selectors, data hooks, network state, GSAP timelines |
| `src/styles/global.css` | all authored site CSS | tokens, typography, layout, responsive behavior, focus states |
| `src/assets/` | build-processed portrait and dBcheck SVG | generated variants and imported component markup |
| `public/` | assets copied without source transformation | public URLs, security contact, fonts, icons, robots |
| `runcheck-logo.svg` | inline runcheck mark and internal shine animation | raw SVG safety, IDs, GSAP selectors, reduced motion |
| `README.md` | concise setup and repository introduction | keep aligned with actual commands and routes |
| `UI-SPEC.md` | UI maintenance companion | revalidate against live source before relying on it |

## Shared document shell

### `BaseLayout.astro`

`BaseLayout` accepts optional `title` and `description` string props. Its defaults are:

- title: `Finnvek | Apps by Emma Hotakainen`
- description: `Android apps by Emma Hotakainen, including KnitTools, runcheck, dBcheck, and fonecheck.`

It renders the only `<!doctype html>`, `<html>`, `<head>`, and `<body>` shell used by the site. The document contract is:

- language `en`;
- UTF-8 encoding;
- responsive viewport;
- Astro generator metadata;
- description metadata;
- theme color `#08080A`;
- SVG favicon, 48 by 48 PNG favicon, and 180 by 180 Apple touch icon;
- canonical URL created with `new URL(Astro.url.pathname, Astro.site)`;
- Open Graph type, title, description, and URL;
- Twitter summary card, title, and description;
- preloads for Astro Font variables, First, and regular League Gothic;
- imported global CSS;
- deferred Cloudflare Web Analytics beacon;
- one unwrapped page slot in `<body>`.

The layout does not currently provide an Open Graph image, Twitter image, structured data, manifest link, robots meta tag, locale metadata, skip link, CSP, or other response headers. Header policy cannot be inferred from deployment because no deployment configuration is tracked here.

### `PolicyLayout.astro`

`PolicyLayout` resolves metadata in this precedence order:

1. direct layout prop;
2. matching Markdown `frontmatter` field;
3. built-in fallback.

It composes `BaseLayout`, the standard `SiteHeader`, a `<section class="prose privacy-policy">` around the Markdown slot, and `SiteFooter current="privacy"`. The privacy wrapper is a `section`, not a `main` element.

Its built-in fallbacks are title `Finnvek` and description `Privacy policy for Finnvek, finnvek.com, knittoolsapp.com, and KnitTools.` The current Markdown route supplies both values in frontmatter, so neither fallback appears in the generated Privacy page.

## Shared navigation components

### Header prop contract and markup

`SiteHeader.astro` accepts:

```ts
interface Props {
  home?: boolean;
  current?: 'about';
}
```

- `home` defaults to `false` and adds `site-header--home`.
- `current="about"` sets `aria-current="page"` on the About link.
- There is no header `current="privacy"` state because Privacy is not in the header navigation.

The header contains:

- a compact `FINNVEK` link to `/` with `aria-label="Finnvek home"`;
- a native button with `aria-controls="primary-navigation"`, initial `aria-expanded="false"`, and an accessible open-state label;
- a labelled primary `<nav>`;
- Apps linking to `/#apps`;
- About linking to `/about/`;
- Contact linking to `mailto:contact@finnvek.com`.

The component imports both `brand-link-animations.ts` and `site-header.ts` into a shared browser module used by every route.

### Header layout and mobile menu

The header wrapper reserves `4.75rem` in normal mode and zero height on the home page. `.site-header-inner` is fixed to the viewport top with `z-index: 100`, a minimum height of `4.75rem`, and `1.75rem` padding.

At `760px` and below:

- header minimum height becomes `4.25rem`;
- inner padding becomes `0.75rem 1.25rem`;
- the hamburger button is displayed;
- navigation becomes an absolute, right-aligned vertical disclosure below the header;
- the closed menu uses opacity, visibility, pointer-event, and translate state;
- each mobile navigation link has a minimum height of `2.75rem`, or 44px.

`site-header.ts` keeps CSS and accessibility state synchronized:

- button click toggles `is-menu-open`, `aria-expanded`, and the accessible label;
- clicking a navigation anchor closes the menu;
- a pointer press outside the header closes it;
- Escape closes it and returns focus to the menu button;
- entering the `(min-width: 761px)` media query closes any mobile menu left open.

The menu does not trap focus and does not use the native popover or dialog APIs. Those are not current requirements encoded in the component.

### Home compact-logo transition

On the home page the compact header logo starts hidden and non-interactive while the large hero wordmark is visible. `site-header.ts` observes `.hero-wordmark` with thresholds `0` and `0.12`.

The header gains `is-logo-visible` when the hero wordmark is outside the viewport or its intersection ratio is below 0.12. On the transition from hidden to visible, the script dispatches `finnvek:logo-visible` on the compact logo. The shared brand animation listens for this event.

### Footer prop contract and behavior

`SiteFooter.astro` accepts `current?: 'about' | 'privacy'`. It renders:

- a `FINNVEK` brand link to `/` with `aria-label="Finnvek home"`;
- the tagline `built to last`;
- About, Contact, and Privacy Policy links;
- hard-coded copyright year 2026.

`current` applies `aria-current="page"` to About or Privacy. There is currently no CSS selector for `aria-current`; the state is semantic and does not receive a distinct persistent color. Header and footer `.site-link` elements become gold on hover, active press, or keyboard focus only.

The footer brand always navigates to the site home page. It does not scroll the current page to its top.

## Home page

### Content order and semantics

`src/pages/index.astro` renders in this order:

1. shared header in home mode;
2. hero section;
3. one horizontal divider with `id="apps"`;
4. KnitTools product section;
5. runcheck product section;
6. dBcheck product section;
7. fonecheck product section;
8. shared footer.

The home page does not currently wrap its content in a `<main>` landmark. Its `<h1>` is the hero statement; every product name is an `<h2>`. The Apps anchor is an `<hr>`, not a heading.

### Hero

The hero contains:

- a large text `FINNVEK` home link;
- the two-line heading `Software made for years. Not weeks.`;
- an italic, gold `years.` span;
- a decorative vertical scroll cue hidden from assistive technology.

Desktop layout uses a 12-column grid, full viewport minimum height, and `1.75rem` padding. The wordmark occupies columns 1 through 8 and the tagline columns 5 through the end. The scroll cue is centered at the bottom.

At `760px` and below, the hero becomes one column, uses `1.5rem 1.25rem` padding, and has a minimum height of `calc(100svh - 7rem)` with a `100vh` fallback. It is therefore intentionally shorter than a full mobile viewport.

### Product layout

Each `.product` has an outer `200px 1fr` grid and an inner two-column `.product-content`. Mirror sections reverse the visual order of lockup and text. At `900px` and below, both grids collapse to one column and the lockup precedes the copy.

The first section is the only one with a visible section label, `In the works`. Empty labels on the later sections are marked `aria-hidden="true"`.

| Product | Current status and visual | Destination | Active motion hooks |
| --- | --- | --- | --- |
| KnitTools | linked 500 by 500 WebP, Teko text name, launch form | `https://knittoolsapp.com` | `data-logo-roll`, `data-logo-stamp` |
| runcheck | root SVG injected as raw inline markup, Manrope text name | `https://runcheckapp.com` | `data-logo-runcheck`; SVG also owns its shine animation |
| dBcheck | imported SVG component, text name with muted `check` | `https://dbcheck.app` | `data-logo-signal` and internal part markers |
| fonecheck | text-only lockup and one description paragraph | none | generic name and text reveal only |

All current external app links open in the same browsing context. No `target` or `rel` attribute is supplied.

The fonecheck entry deliberately has no logo, product URL, or secondary action in current markup. A review must not infer those from the other product sections.

### KnitTools notification form

The form markup is owned by `index.astro`; its browser behavior is owned by `setupNotifyForm()` in `home-animations.ts`.

Markup contract:

- real visually hidden label for the email field;
- required `type="email"` input with `autocomplete="email"`;
- visually hidden `website` honeypot field;
- honeypot is removed from keyboard order with `tabindex="-1"` and disables autocomplete;
- submit button text `Notify me at launch`;
- separate hidden error paragraph with `role="alert"` and `aria-live="polite"`.

Submission state machine:

```text
submit
  -> prevent normal form navigation
  -> run native reportValidity()
  -> clear prior error
  -> disable button and show "Sending…"
  -> POST JSON with a 10-second AbortController timeout
     -> HTTP success and JSON { success: true }
        -> replace form children with "You're in!"
     -> JSON { error: string }
        -> show that string as text and re-enable button
     -> other HTTP or JSON shape
        -> show generic failure and re-enable button
     -> AbortError
        -> show timeout failure and re-enable button
     -> other thrown error
        -> show network failure and re-enable button
```

Request contract:

```http
POST https://api.finnvek.com/subscribe
Content-Type: application/json
```

```json
{
  "email": "trimmed input value",
  "source": "finnvek",
  "website": "honeypot value"
}
```

The endpoint, its CORS policy, validation, storage, rate limiting, abuse protection, and email lifecycle are outside this repository. The browser does not attach an authorization header and does not explicitly override Fetch's credentials mode. API error text is inserted with `textContent`, not as HTML.

On success, reduced-motion mode replaces the controls immediately. Otherwise, GSAP first fades the form children upward and then reveals the success message. The script does not persist subscription state locally, redirect the user, or move focus after success or failure.

The current privacy page describes the Android apps. It does not contain a website-specific section describing the notification email flow.

## About page

`src/pages/about.astro` provides an explicit title and description to `BaseLayout`, marks About current in both shared navigation components, and wraps its content in `<main>` and `<article>`.

The source contains:

- an About `<h1>`;
- an introductory first-person description of Emma Hotakainen and Finnvek;
- a portrait imported from `src/assets/emma-hotakainen-finnvek.png`;
- a list of the same four Android apps;
- copy about individual ownership, product decisions, no advertising, supporting articles, and Turku.

The portrait uses Astro's `<Picture>` component:

- AVIF and WebP sources;
- PNG fallback;
- widths 360, 540, 720, and source width 1085;
- constrained layout with `fit="contain"`;
- high quality;
- eager, high-priority loading because `priority` is set;
- alternative text `Emma Hotakainen seated inside a small aircraft.`;
- source aspect ratio 1085 by 1450.

The About article uses text and portrait columns above `64rem`. At `64rem` and below it becomes a single reading order: intro, portrait, details.

## Privacy page

`src/pages/privacy.md` is Markdown with frontmatter for the layout, title, and description. The displayed revision date is 16 July 2026.

Its current scope is explicitly limited to KnitTools, runcheck, and dBcheck. fonecheck appears elsewhere on the website but is not yet an app covered by this privacy policy.

The policy publishes sections covering:

- developer identity and contact;
- apps covered;
- advertising and behavioral-tracking statements;
- local storage, backup, device transfer, and deletion boundaries;
- Google Play Billing;
- Firebase Crashlytics;
- KnitTools local content, permissions, Ravelry, Firebase backend, retention, and deletion;
- runcheck local content, permissions, M-Lab network measurement, export, retention, and deletion;
- dBcheck local content, permissions, Health Connect, exports, backups, recordings, retention, and deletion;
- legal bases;
- user choices and data-subject rights;
- children;
- future policy changes.

The policy contains external references to Google, Firebase, Ravelry, Measurement Lab, Android Health Connect guidance, and the Finnish Office of the Data Protection Ombudsman. It also repeats `contact@finnvek.com` as the privacy contact.

Review boundary: changes to app permissions, SDKs, identifiers, storage, backup behavior, exports, remote services, billing, retention, or deletion behavior must trigger a privacy-page review, but those facts must be proven in the app repositories. This website repository can only prove the text and links that will be published.

## Browser scripts and event contracts

All authored TypeScript modules execute as top-level browser modules. The site does not use Astro view transitions or a client-side navigation lifecycle, so there is no mount/unmount abstraction.

### `site-header.ts`

Owns:

- mobile menu open state;
- accessible button state and label;
- close-on-link, outside-pointer, Escape, and desktop-transition behavior;
- focus return after Escape;
- home hero observer and compact-logo event dispatch.

Required selectors and event contracts:

| Producer | Consumer | Contract |
| --- | --- | --- |
| `SiteHeader.astro` | `site-header.ts` | `[data-site-header]`, `[data-menu-toggle]`, `.site-nav` |
| `index.astro` | `site-header.ts` | `.hero-wordmark` exists in home mode |
| `site-header.ts` | CSS | `is-menu-open`, `is-logo-visible` classes |
| `site-header.ts` | `brand-link-animations.ts` | `finnvek:logo-visible` event on compact logo |

### `brand-link-animations.ts`

This module registers GSAP SplitText and exits without creating animations when reduced motion is requested.

For each Finnvek wordmark it:

- splits visible text into `.split-char` elements;
- preserves an existing accessible name on the animated element;
- blocks a second play while the current timeline is active;
- moves characters from 3px below to their resting position;
- pulses character color to `#D9A24E` and back.

Trigger policy:

| Input context | Compact inner-page logo | Compact home logo | Footer brand |
| --- | --- | --- | --- |
| Fine pointer | focus or pointer enter | focus, pointer enter, or home reveal event | focus or pointer enter |
| Coarse pointer | automatic on load plus focus | home reveal event plus focus | first intersection at threshold 0.55 plus focus |

For the footer, the link itself retains `aria-label="Finnvek home"`; only its inner `.footer-wordmark` is split.

### `home-animations.ts`

This module registers GSAP ScrollTrigger and SplitText and then invokes eight setup functions:

| Function | Current responsibility |
| --- | --- |
| `setupNotifyForm()` | notification request and form states |
| `setupTopbarHeroReveal()` | hero wordmark, tagline, scroll-cue entrance, and gold pulse |
| `setupScrollCueFade()` | scrubbed cue fade over the first 25 percent of hero scrolling |
| `setupHeroMouseParallax()` | delayed fine-pointer hero movement on desktop |
| `setupSectionLines()` | one-way divider growth based on maximum observed scroll progress |
| `setupProductReveals()` | word, logo, name, and link reveal timelines per product |
| `setupLogoMotion()` | interactive logo-specific responses |
| `setupFooterReveal()` | one-time footer wordmark, tagline, and metadata entrance |

Hero timing and capability gates:

- character reveal begins at 0.15 seconds on a timeline delayed by 0.1 seconds;
- tagline reveal is positioned at 0.9 seconds;
- scroll-cue reveal is positioned at 1.4 seconds;
- wordmark gold pulse begins at 1.8 seconds;
- mouse parallax is registered after a 2.4-second delay;
- parallax requires `(min-width: 761px) and (pointer: fine)`;
- wordmark movement is at most 6px horizontally and 4px vertically;
- tagline movement uses the opposite direction at up to 5px horizontally and 3px vertically.

Product reveal behavior:

- text paragraphs and the first section label are split into words;
- words begin 12px low, blurred by 8px, and transparent;
- other annotated elements begin 16px low and transparent;
- the first product starts when its top reaches 95 percent of the viewport;
- later products start when their top reaches 75 percent;
- ScrollTrigger timelines are configured to run once;
- KnitTools rolls in from `x: 150` and `rotation: 240`;
- runcheck reveals the hook from above and the arrow from below, then pulses an SVG drop shadow;
- dBcheck reveals its divider, letters, and outer ticks in a staged signal sequence;
- product names follow logo-specific start offsets;
- fonecheck has no logo state and receives only text and name reveals.

Interactive logo behavior:

- KnitTools uses `mouseenter` to compress and spring the whole lockup;
- dBcheck uses `mouseenter` and `focus` to expand ticks and separate letters, then restores on `mouseleave`;
- runcheck has no additional hover timeline in this module;
- runcheck's inline SVG independently runs a five-second CSS shine sweep;
- the SVG shine stops under `prefers-reduced-motion: reduce`.

Footer reveal starts when the footer top reaches 92 percent of the viewport and runs once. It is separate from the wordmark character interaction in `brand-link-animations.ts`.

### Reduced-motion behavior

Reduced motion is enforced across three layers:

- `home-animations.ts` shows hero, product, divider, runcheck, and footer elements in their final states, skips parallax and logo interaction, and completes form success without a transition;
- `brand-link-animations.ts` does not split or animate shared wordmarks;
- `global.css` stops the scroll-cue animation and removes structural header/menu transitions;
- `runcheck-logo.svg` stops its internal shine animation.

Review all layers together when changing motion. A reduced-motion check that inspects only GSAP or only CSS is incomplete.

## Styling system

All authored site styling is global and lives in `src/styles/global.css`. There are no component-scoped `<style>` blocks, CSS modules, Tailwind configuration, CSS-in-JS layer, or separate theme files.

### Color tokens

| Token | Value | Current use |
| --- | --- | --- |
| `--color-bg` | `#08080A` | page background and theme color |
| `--color-surface-footer` | `#0C0C0C` | footer background |
| `--color-text` | `#F0F0EC` | primary text and interactive content |
| `--color-text-muted` | `#9A9A95` | secondary copy, labels, metadata |
| `--color-text-dimmed` | `#5F5F5A` | declared low-emphasis color; no current source consumer outside the declaration |
| `--color-border` | `#2A2A2A` | section and form structure |
| `--color-border-faint` | `#1A1A1A` | scroll cue and prose dividers |
| `--red` | `#D9A24E` | current gold accent under a legacy variable name |
| `--red-dark` | `#A9782E` | declared darker gold; no current source consumer outside the declaration |

Selection uses the gold accent as background and the page background as text color.

### Layout tokens

| Token | Default | Small-screen override | Purpose |
| --- | --- | --- | --- |
| `--container-wide` | `1180px` | none | products and About maximum width |
| `--container-prose` | `720px` | none | privacy reading width |
| `--gutter` | `2.5rem` | `1.25rem` at 640px and below | horizontal content gutter |

The footer is not constrained by `--container-wide`; `.footer-inner` spans the viewport with `1.75rem` horizontal padding.

### Typography ownership

| Role | Stack | Source |
| --- | --- | --- |
| body and prose | Astro Font IBM Plex Sans, then system fallback | built WOFF2 assets |
| interface/navigation/tagline | Astro Font Epilogue | built WOFF2 assets |
| editorial display headings | League Gothic | `public/fonts/league-gothic/` |
| Finnvek wordmarks | First | `public/fonts/first.ttf` |
| KnitTools name | Teko, then League Gothic | `public/fonts/teko/` |
| runcheck name | Manrope | `public/fonts/manrope/` |

Base body line height is 1.5. Product text uses 1.6. About body copy uses 1.65. Display faces use tighter line heights where their classes define them.

### Core interaction styles

- Generic anchors remove underlines and inherit bright text.
- `.site-link` changes from warm white to gold on hover, active, or keyboard focus.
- Header, footer-brand, product-lockup, About-link, and form controls each have explicit focus treatments.
- Product text links use a transparent underline border that becomes gold on hover or focus.
- The notification input uses an inset one-pixel focus outline.
- The notification button inverts to a light background with dark text on hover or focus.
- Mobile navigation and the notification button preserve at least 44px control height.
- `body` uses `overflow-x: clip`.
- Images are block-level, width-constrained, and keep automatic height.

No CSS rule currently gives a persistent visual style to `[aria-current="page"]`.

### Responsive matrix

| Condition | Implemented change |
| --- | --- |
| Above `64rem` | About uses text and portrait columns |
| `64rem` and below | About reads intro, portrait, details in one column; portrait max becomes 32rem |
| Above `900px` | products use outer label/content and inner lockup/text columns |
| `900px` and below | products and mirrored products become one column; lockup precedes text |
| `761px` and above | full navigation row; home desktop hero and fine-pointer parallax may run |
| `760px` and below | hamburger menu, shorter header, one-column mobile hero, shorter scroll cue |
| `640px` and below | 1.25rem gutter, constrained logo sizes, stacked footer, stacked notification form, 10px navigation text |
| reduced motion | structural transitions and authored animations are removed or resolved to final state |

When reviewing the 760/761 boundary, compare the CSS `max-width: 760px` rule with the script's `min-width: 761px` query. When reviewing products, keep the separate 900px layout boundary in sync with animation assumptions.

## Accessibility and semantic implementation

Currently implemented:

- English document language;
- semantic headings on every route;
- labelled primary navigation;
- native menu button with state and target relationship;
- Escape dismissal with focus return;
- semantic current-page attributes for About and Privacy where supported by the component;
- accessible labels for Finnvek and product-logo links;
- empty alternative text for the KnitTools image inside an already named link;
- hidden dBcheck and runcheck logo graphics inside already named links;
- descriptive About portrait alternative text;
- visible keyboard focus rules for the principal interactive elements;
- real notification-form labels, native email validity, and live error reporting;
- minimum 44px mobile navigation targets;
- reduced-motion handling across JS, CSS, and inline SVG.

Important current boundaries:

- the home route has no `<main>` landmark;
- the privacy route uses a section rather than `<main>`;
- there is no skip-navigation link;
- `aria-current` has no dedicated persistent visual style;
- the mobile disclosure does not trap focus;
- form success and error state changes do not programmatically move focus;
- no automated accessibility test is configured.

These are implementation facts, not automatic defect classifications. A review should assess them against the intended accessibility standard and user flow before proposing changes.

## Assets and publication behavior

### Build-processed assets

| Source | Import mode | Current output behavior |
| --- | --- | --- |
| `src/assets/emma-hotakainen-finnvek.png` | Astro image metadata and `<Picture>` | width-specific AVIF, WebP, and PNG variants |
| `src/assets/dbcheck-logo.svg` | Astro SVG component | component markup is inlined in the home HTML; the build also emits a hashed SVG asset copy |
| `runcheck-logo.svg` | Vite `?raw` import | entire SVG injected inline with `set:html` |

Because `runcheck-logo.svg` is inserted as trusted raw markup, changes to that file affect both DOM structure and executable SVG CSS. Keep `.rc-hook`, `.rc-arrow`, `.rc-shine`, clip paths, gradients, and reduced-motion behavior intact unless the corresponding TypeScript and accessibility behavior are changed together.

### Public assets copied as-is

| Public URL | Source | Current consumer |
| --- | --- | --- |
| `/favicon.svg` | `public/favicon.svg` | `BaseLayout` |
| `/favicon-48x48.png` | `public/favicon-48x48.png` | `BaseLayout` |
| `/apple-touch-icon.png` | `public/apple-touch-icon.png` | `BaseLayout` |
| `/fonts/first.ttf` | `public/fonts/first.ttf` | global First face and preload |
| `/fonts/league-gothic/leaguegothic-regular-webfont.woff` | `public/fonts/league-gothic/leaguegothic-regular-webfont.woff` | regular League Gothic face and explicit preload |
| `/fonts/league-gothic/leaguegothic-italic-webfont.woff` | `public/fonts/league-gothic/leaguegothic-italic-webfont.woff` | italic League Gothic face |
| `/fonts/teko/Teko-VariableFont_wght.ttf` | `public/fonts/teko/Teko-VariableFont_wght.ttf` | KnitTools name |
| `/fonts/manrope/Manrope-VariableFont_wght.ttf` | `public/fonts/manrope/Manrope-VariableFont_wght.ttf` | runcheck name |
| `/images/knittools.webp` | `public/images/knittools.webp` | KnitTools home visual |
| `/images/runcheck.webp` | `public/images/runcheck.webp` | no current markup or CSS consumer |
| `/robots.txt` | `public/robots.txt` | crawler policy |
| `/.well-known/security.txt` | `public/.well-known/security.txt` | security-contact publication |

`public/images/runcheck.webp` is currently unused by source but is still copied into `dist/images/`. Removing it changes the public artifact even though it does not change rendered markup.

The tracked `first-font/Befonts-License.txt` records commercial-use permission and its source link. `.gitignore` ignores the `first-font/` source directory for future untracked files while the already tracked license remains versioned.

## SEO, crawling, and security contact

`BaseLayout` owns canonical, Open Graph, and Twitter metadata. The sitemap integration currently emits:

- `https://finnvek.com/`
- `https://finnvek.com/about/`
- `https://finnvek.com/privacy/`

`public/robots.txt` allows all crawlers and points to `https://finnvek.com/sitemap-index.xml`.

`public/.well-known/security.txt` currently declares:

- contact `mailto:contact@finnvek.com`;
- expiry `2027-04-30T21:00:00Z`;
- preferred languages English and Finnish;
- canonical URL `https://finnvek.com/.well-known/security.txt`.

The security contact's fixed expiry date requires review before it passes. The repository does not contain security response procedures, a PGP key, acknowledgement policy, hiring URL, disclosure policy URL, or deployment header configuration.

## External services and network boundaries

| Service or destination | Trigger | Data visible from this repository | Boundary |
| --- | --- | --- | --- |
| Astro Google font provider | production build | configured family, style, and weight requests | build-time dependency; emitted fonts are local assets |
| Cloudflare Web Analytics | every rendered page load | public beacon script and static site token | processing behavior is outside this repository |
| `api.finnvek.com/subscribe` | KnitTools form submission | email, source `finnvek`, honeypot | backend, CORS, storage, retention, and abuse controls are external |
| app product websites | user follows an app link | normal browser navigation | destination sites are separate projects |
| `mailto:contact@finnvek.com` | user selects Contact or privacy email | handled by the user's mail client | no website-side contact form |
| privacy-policy references | user follows a cited policy link | normal browser navigation | external policy content can change independently |

There are no source reads of `import.meta.env`, `process.env`, or Astro environment APIs. `.env` and `.env.production` are ignored, but the current site does not consume them.

The repository includes no first-party server code. Do not answer backend-security, subscriber-retention, production-header, CDN-cache, DNS, or live-deployment questions from this code alone.

## Dormant and intentionally absent paths

The following details matter during cleanup and code review because they can be mistaken for active behavior:

- `home-animations.ts` queries `.topbar`, but current markup contains no element with that class. The guarded topbar opacity operations currently do nothing.
- Generic `data-logo-rise` and `data-logo-nudge` branches exist in `home-animations.ts`, but no current page markup supplies those attributes.
- `--color-text-dimmed` and `--red-dark` are declared but not consumed elsewhere in authored CSS.
- `public/images/runcheck.webp` is published but not referenced by current source.
- fonecheck has no link, image, logo-specific motion, form, or privacy-policy section.
- The header has no Privacy link and therefore no privacy current-state prop.
- The site has no persistent visual styling for `aria-current`.
- The project has no tracked deployment configuration despite the Cloudflare analytics integration.

These facts do not by themselves require removal or a fix. Confirm intended product and maintenance behavior before changing them.

## Change-impact guide

Use this map to frame review questions and avoid single-file changes that break cross-file contracts.

| Change | Primary files | Required adjacent review |
| --- | --- | --- |
| add or remove a route | `src/pages/`, relevant layout | title/description, canonical URL, navigation, footer current state, sitemap output |
| change shared metadata | `BaseLayout.astro` | all three built HTML files, canonical origin, social previews |
| change privacy metadata or wrapper | `privacy.md`, `PolicyLayout.astro` | frontmatter precedence, semantic wrapper, header/footer |
| change app name, status, claim, or URL | `index.astro`, `about.astro` | privacy scope where data behavior changes, product typography, external-link accessibility |
| add fonecheck publication or data flow | home/About source | destination, visual asset, motion hook, privacy coverage, metadata copy |
| change header layout or breakpoint | `SiteHeader.astro`, `global.css`, `site-header.ts` | 760/761 parity, open state, Escape, outside click, home-logo observer |
| change footer links or semantics | `SiteFooter.astro`, `global.css`, brand script | current prop union, focus state, mobile stacking, home-link behavior |
| change a design token | `global.css` `:root` | all route contexts, focus contrast, selection, SVG colors that are not tokenized |
| change typography | `astro.config.mjs`, `BaseLayout.astro`, `global.css`, `public/fonts/` | font ranges, fallback stacks, preload behavior, generated build assets, licenses |
| change portrait rendering | `about.astro`, source PNG | widths, formats, aspect ratio, loading priority, build-time optimization |
| change runcheck SVG | root SVG, `index.astro`, `home-animations.ts`, CSS | raw markup trust, group selectors, IDs, shine, GSAP reveal, reduced motion |
| change dBcheck SVG | `src/assets/dbcheck-logo.svg`, home script | data-part selectors, component output, reveal and focus response |
| change product animation hook | `index.astro`, `home-animations.ts` | initial hidden state, final static state, reduced motion, focus parity |
| change notification markup | `index.astro`, home script, global CSS | selector contract, native validity, payload, error region, small-screen stack |
| change subscription API contract | home script | external backend deployment, CORS, timeout/error semantics, privacy wording |
| change app privacy behavior | `privacy.md` plus app repository | prove app-side behavior first; website build only proves publication |
| change crawler or security files | `public/robots.txt`, `public/.well-known/security.txt` | built public path, canonical origin, expiry date |
| change dependencies | package manifest and lock | Node engine, resolved graph, build, npm audit, browser bundle behavior |

## Review questions by subsystem

### Architecture and build

- Does the change preserve static output, or does it introduce server behavior that now needs an adapter and deployment configuration?
- Does a new page belong in the sitemap and shared metadata model?
- Is code placed in `public/` expected to remain unprocessed, or should it be imported through `src/assets/`?
- Does a new browser feature require client JavaScript on every route or only on one page?
- Does the lockfile represent the dependency change actually being reviewed?

### UI and responsive behavior

- Which token, selector, or component owns the requested visual change?
- Does it work above and below the independent 64rem, 900px, 760px, and 640px boundaries?
- Does mirrored product ordering remain correct both visually and in DOM reading order?
- Does a fixed-header change preserve the Apps anchor offset and inner-page content spacing?
- Are focus, hover, active, coarse-pointer, and reduced-motion states all defined where relevant?
- Does the design remain coherent without inventing a one-off local style outside `global.css`?

### Interaction and accessibility

- Does markup still match every selector and data hook used by the browser modules?
- Can the mobile menu be opened, closed, and escaped with correct focus and accessible labels?
- Is meaningful link text or an accessible label retained when visible logo text is split or hidden?
- Does the full interaction remain understandable when GSAP is skipped for reduced motion?
- Are form errors and success observable without relying only on animation or color?
- Does a new route or major section need a main landmark, current-page state, or skip-link strategy?

### Content, privacy, and external services

- Is a product claim current in its owning app repository, not merely repeated from this site?
- Does a new SDK, permission, identifier, endpoint, export, or retention rule require policy changes?
- Does a new form or analytics flow collect data not currently described on the website?
- Can the external backend contract be verified outside this repository?
- Are external URLs, contact addresses, security expiry, and app availability still current?

### Security and resilience

- Is raw HTML or SVG still restricted to trusted repository content?
- Is remote error content inserted as text rather than HTML?
- Does an external request have a bounded timeout and a recoverable UI state?
- Are production headers and CSP being assumed even though they are not represented here?
- Does the generated artifact expose an unused or sensitive file copied from `public/`?
- Did dependency scanning complete, and were findings distinguished from a successful build?

## Validation strategy and proof boundaries

### Minimum source validation

For documentation-only changes:

```powershell
git diff --check
git diff -- PROJECT.md
```

For implementation changes:

```powershell
npm ci
npm run build
git diff --check
```

`npm ci` is the reproducible install path because `package-lock.json` is committed. `npm run build` must generate three HTML routes plus sitemap output. A source change that touches browser behavior or responsive layout also needs browser verification; a build alone cannot exercise pointer, focus, viewport, network, or reduced-motion state.

### Suggested browser matrix

At minimum, verify:

- home, About, and Privacy at a wide desktop width;
- product collapse at 900px and below;
- navigation immediately above and below 760px;
- footer and notification stacking at 640px and below;
- keyboard-only navigation and visible focus;
- Escape and outside-pointer menu closure;
- fine-pointer and coarse-pointer wordmark behavior;
- `prefers-reduced-motion: reduce`;
- notification validation, in-flight, success, API-error, malformed-response, timeout, and offline states;
- home scroll from hero wordmark to compact header logo;
- long Privacy content and anchor/link wrapping;
- no unintended horizontal overflow.

No automated harness for this matrix is currently committed.

### Verification snapshot from 4 September 2026

Environment used:

- Windows PowerShell
- Node.js 24.19.0
- npm 11.17.0

Observed dependency audit and remediation:

- before remediation, the lockfile resolved Astro 7.0.4 and `npm ci` reported six known vulnerabilities: one moderate finding in Astro and five high findings in the transitive `js-yaml`, `nanoid`, `postcss`, `sharp`, and `svgo` packages;
- a standalone `npm audit --json` later completed successfully. The earlier apparent non-completion was a slow npm registry audit response, not proof of a broken lockfile or an uninspectable dependency graph;
- the audit paths were all inside the Astro dependency graph: Astro brought in `js-yaml`, `sharp`, and `svgo`, while Astro's Vite path brought in `postcss` and then `nanoid`;
- `package.json` was updated within the existing major versions from Astro `^7.0.4` to `^7.3.1` and `@astrojs/sitemap` `^3.7.3` to `^3.7.4`;
- the lockfile was refreshed so the relevant resolved versions are Astro 7.3.1, `@astrojs/sitemap` 3.7.4, `js-yaml` 4.3.2, `nanoid` 3.3.18, `postcss` 8.5.28, `sharp` 0.35.4, and `svgo` 4.1.0. No override and no new direct dependency were added;
- `npm ci --no-audit` completed from the updated lockfile and installed 192 packages;
- a fresh separate `npm audit --json` completed with zero known vulnerabilities in every severity class. Its metadata reported 185 production dependencies, no development dependencies, 106 optional dependencies, and 290 dependencies in total;
- `npm outdated --json` returned an empty object, so npm reported no outdated direct dependency at that point;

Observed build results:

- `npm run build` completed successfully in static mode;
- exactly three pages were generated: `/`, `/about/`, and `/privacy/`;
- the sitemap contained the same three canonical URLs;
- the About portrait generated 12 optimized variants across AVIF, WebP, and PNG;
- all pages referenced the shared header JavaScript and global CSS bundle;
- only the home page referenced the additional home JavaScript bundle;
- the build copied the public security contact, robots file, icons, local fonts, and public images;
- no live deployment, API, cross-browser, mobile-device, visual-regression, or accessibility-runtime verification was performed.

The dated results above are evidence for that checkout and environment only. Re-run them after dependency, content, asset, configuration, or source changes. A successful local build is not proof that `https://finnvek.com` has been deployed or that the external subscription API is healthy.
