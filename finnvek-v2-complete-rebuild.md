# Finnvek.com v2 — Complete Rebuild Spec

**Scope:** This document is the single source of truth for rebuilding Finnvek.com from scratch as a one-page editorial site. Previous Phase 1 and Phase 2 specs (foundation with dot grid, 3D Three.js logo) are obsolete and should be ignored. This spec replaces them entirely.

---

<context_and_why_rebuild>

The existing Finnvek.com repository has gone through multiple design iterations that did not land. Rather than continue patching, we are starting from a clean Astro project with a new visual direction: minimalist editorial, inspired by but not copying sirnik.co. Quiet, confident, warm. No grid patterns, no 3D logos, no blueprint ornamentation.

The site is a one-page introduction to Finnvek — one developer in Turku, Finland, making independent software. The first product, KnitTools, is featured. That's the entire site.

</context_and_why_rebuild>

<brand_values_reminder>

- Privacy by default
- No ads, no tracking
- Made to last
- Independent

These inform technical choices (self-hosted fonts, no analytics, no external resources on page load) and tone choices (quiet, not marketing-loud).

</brand_values_reminder>

---

<tech_stack>

- **Framework:** Astro, latest stable version. Before starting, check https://astro.build for the current version and scaffold with `npm create astro@latest`. Choose: empty template, TypeScript (strict), install dependencies.
- **Styling:** Pure CSS with custom properties. No Tailwind, no Sass, no CSS-in-JS.
- **JavaScript:** Minimal. One small script for the live clock in the header. That's it. No frameworks (no React, no Vue, no Svelte). No animation libraries.
- **Fonts:** Literata (serif) and Figtree (sans-serif), served via Astro's built-in font system (self-hosted, Google Fonts as source). **Do not** load from Google Fonts CDN.
- **Deployment:** Cloudflare Pages (static output from `astro build`)
- **Node:** Use the version specified by the current Astro release requirements

</tech_stack>

<git_strategy>

Work on branch `v2`, created from current `main`. Before starting:

1. Back up the existing `src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json` to `*-v1-archive/` and `*-v1-archive.{ext}` respectively. Do not delete.
2. Scaffold fresh Astro project in-place, overwriting configs and creating new `src/` and `public/`.
3. Commit as: `chore: v2 reset — archive v1, scaffold fresh astro`.
4. From there, all work is additive.

**Do not touch `main`.** `main` stays as v1 until Emma explicitly merges `v2`.

</git_strategy>

---

<design_system>

<colors>

```css
:root {
  --color-bg: #0C0C0C;           /* Warm near-black, not pure #000 */
  --color-text: #F0F0EC;         /* Warm off-white, easier on eyes than pure white */
  --color-text-muted: #9A9A95;   /* Secondary text, time, location */
  --color-text-dimmed: #5F5F5A;  /* Footer, minor details */
  --color-accent: #24D4C2;       /* Finnvek turquoise, for links and CTAs */
  --color-accent-hover: #3EE8D7; /* Slightly brighter on hover */
  --color-border: #252525;       /* Subtle borders, rarely used */
  --color-border-faint: #1A1A1A; /* Hairline separators */
}
```

Rationale for off-white text: pure white on dark background creates harsh contrast. Warm off-white (`#F0F0EC`) reads as "paper" and fits the editorial aesthetic. `#F0F0EC` has about 15.8:1 contrast on `#0C0C0C` — well above WCAG AAA.

</colors>

<typography>

Two typefaces, loaded via Astro's font system.

**Literata** (serif — display and featured editorial text)
- CSS variable: `--font-serif`
- Weights: 400 (Regular), 500 (Medium)
- Used for: hero headline, KnitTools product name, section-level display elements
- Characteristics to preserve: Literata's warmth and gentle contrast. Don't override tracking aggressively.

**Figtree** (sans-serif — body, UI, labels)
- CSS variable: `--font-sans`
- Weights: 300 (Light), 400 (Regular), 500 (Medium)
- Used for: body text, navigation (if any), buttons, labels, time display, footer

**Astro font config (verify current API against https://docs.astro.build):**

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://finnvek.com',
  integrations: [sitemap()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Literata',
        cssVariable: '--font-serif',
        weights: [400, 500],
        styles: ['normal'],
      },
      {
        provider: fontProviders.google(),
        name: 'Figtree',
        cssVariable: '--font-sans',
        weights: [300, 400, 500],
        styles: ['normal'],
      },
    ],
  },
});
```

Astro's font API has moved between experimental and stable. If the above no longer matches current docs, use whatever is current — but keep the two-font, self-hosted setup.

**Base typography rules:**

```css
body {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-weight: 400;
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.serif {
  font-family: var(--font-serif), Georgia, serif;
}

.sans {
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

Do not set default `h1`, `h2`, etc. styles globally — style sections individually in the page.

</typography>

<spacing>

Base unit: `8px`. All vertical spacing should be multiples of 8 (8, 16, 24, 32, 48, 64, 96, 128, 192).

- Space between sections: `96px` desktop, `64px` mobile
- Space within sections (paragraph-to-paragraph): `24px`
- Content max-width: `720px` for text-heavy sections. Wider (`1100px`) for the header row.

</spacing>

</design_system>

---

<page_structure>

The page is a single `index.astro`. Vertical structure from top to bottom:

1. **Header row** — logo left, location + time right
2. **Hero** — the single display sentence
3. **About** — four paragraphs
4. **KnitTools** — product showcase
5. **More apps line** — one sentence
6. **Footer** — brand, email, privacy

No nav, no breadcrumbs, no sidebar, no floating elements. The page scrolls as one continuous column.

</page_structure>

---

<section_1_header>

Fixed at the top of the page, NOT `position: fixed` — just the first content in the flow. Max width `1100px`, centered, with horizontal padding `2rem` desktop / `1.25rem` mobile.

Layout: flex row, space-between, vertically aligned at top (`align-items: flex-start`).

<header_logo>

- Source: FINNVEK SVG. Copy from `src-v1-archive/src/components/LogoAnimated.astro` or `LogoStatic.astro`, extract the raw `<svg>` element, save as `public/finnvek-logo.svg`.
- Display size: approximately 140px wide on desktop, 100px on mobile.
- No animation. No hover effect. Static display only.
- Wrap in a `<a href="/">` so it acts as a home link (even though it's the only page).
- Use `<img src="/finnvek-logo.svg" alt="Finnvek" />` OR inline the SVG if you need to style its inner paths. Either works.

</header_logo>

<header_location_time>

On the right side of the header, right-aligned. Two small lines of text, stacked:

```html
<div class="header-meta">
  <div class="location">Turku, Finland</div>
  <div class="time" id="local-time">14:23</div>
</div>
```

CSS:
```css
.header-meta {
  text-align: right;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.header-meta .time {
  font-variant-numeric: tabular-nums;
}
```

The time must update live. Minimal JavaScript:

```js
// src/scripts/clock.ts
function updateTime() {
  const el = document.getElementById('local-time');
  if (!el) return;
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Helsinki',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  el.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
}
updateTime();
setInterval(updateTime, 30000); // Update every 30 seconds
```

Use `timeZone: 'Europe/Helsinki'` so the displayed time is Finnvek's local time (Turku), regardless of visitor's timezone. This is a warm, human touch — the visitor sees *when* it is in Turku, not where they are.

Load the script at the end of the page with `<script>` tag in Astro. No need for a framework island.

</header_location_time>

</section_1_header>

---

<section_2_hero>

Spacing: `160px` top margin from header on desktop, `96px` on mobile.

Content: one sentence, in Literata.

```html
<section class="hero">
  <h1 class="serif">Software that takes time. <br />Made carefully.</h1>
</section>
```

CSS:
```css
.hero h1 {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-text);
  max-width: 720px;
  margin: 0;
}
```

The `<br />` forces a line break between the two sentences. On very narrow screens, let it wrap naturally — remove the `<br />` via CSS if needed (or accept that it looks fine either way).

No subtitle, no CTA button under the hero. The hero is alone with its statement.

</section_2_hero>

---

<section_3_about>

Spacing: `128px` top margin from hero on desktop, `96px` mobile.

Four paragraphs, in Figtree Regular. Max-width `640px`. Paragraphs separated by standard margin-bottom (~`1.5rem`).

```html
<section class="about">
  <p>Finnvek is independent software from Turku, Finland. I'm one developer, working on my own projects.</p>
  <p>It exists because some ideas were worth following, and I had the freedom to follow them. The kind of ideas that stay interesting for years, not weeks. The kind I care about enough to build carefully, without shortcuts or rushed releases.</p>
  <p>Every product is its own thing. No ads, no tracking. Made to work well, and to keep working for a long time.</p>
  <p>The first one is KnitTools. More are on the way.</p>
</section>
```

CSS:
```css
.about {
  max-width: 640px;
  font-size: 1.125rem;      /* 18px */
  line-height: 1.65;
  color: var(--color-text);
}
.about p {
  margin: 0 0 1.5rem 0;
}
.about p:last-child {
  margin-bottom: 0;
}
```

No special styling for individual paragraphs. No pull quotes, no bold, no italic. Plain, clean prose.

</section_3_about>

---

<section_4_knittools>

Spacing: `128px` top margin from about section.

The most visually prominent section of the site, but still restrained. Layout on desktop: two columns. Phone frame on the left (or right — whichever reads better), content on the right. On mobile: single column, phone frame above content.

<knittools_assets>

Emma will provide: a phone screenshot of KnitTools with a generic phone frame around it, created via Nano Banana. She will export as PNG with transparent background.

File location: `public/knittools-phone.png` (or .webp if smaller)

Display size:
- Desktop: approximately `280px` wide, natural height
- Mobile: approximately `220px` wide, centered above text

Do not add drop shadow, reflection, or background behind the phone image. The transparent PNG should sit directly on the page background.

</knittools_assets>

<knittools_content>

Right column (desktop) / below phone (mobile):

```html
<section class="knittools">
  <div class="knittools-image">
    <img src="/knittools-phone.png" alt="KnitTools app on a phone" />
  </div>
  <div class="knittools-content">
    <div class="label">Coming soon</div>
    <h2 class="serif">KnitTools</h2>
    <p>KnitTools is a pocket companion for knitters. It counts your rows, reads your patterns, and keeps your stash quietly in order, with voice and AI that speaks knitter. In eleven languages, for Android.</p>
    <div class="knittools-actions">
      <a href="https://knittoolsapp.com" class="link-primary">knittoolsapp.com →</a>
    </div>
  </div>
</section>
```

CSS:
```css
.knittools {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 900px;
}

.knittools-image img {
  display: block;
  max-width: 280px;
  height: auto;
}

.knittools-content .label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.knittools-content h2 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 2.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
}

.knittools-content p {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-text);
  max-width: 480px;
  margin: 0 0 2rem 0;
}

.link-primary {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: border-color 150ms ease, color 150ms ease;
}
.link-primary:hover {
  color: var(--color-accent-hover);
  border-bottom-color: var(--color-accent-hover);
}

@media (max-width: 768px) {
  .knittools {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
  .knittools-image {
    display: flex;
    justify-content: center;
  }
  .knittools-image img {
    max-width: 220px;
  }
  .knittools-content p {
    margin-left: auto;
    margin-right: auto;
  }
}
```

**No waitlist form in this phase.** The knittoolsapp.com link is the only CTA. The waitlist will be added later when a backend service is chosen. Do not stub a non-functional form.

**Hinta ei näy.** Price is not displayed on Finnvek.com. Visitors who want to know pricing click through to knittoolsapp.com.

</knittools_content>

</section_4_knittools>

---

<section_5_more_apps>

Spacing: `96px` top margin from KnitTools section.

A single sentence, quiet and subtle, centered.

```html
<section class="more-apps">
  <p>More apps are in development.</p>
</section>
```

CSS:
```css
.more-apps {
  text-align: center;
  padding: 2rem 0;
}
.more-apps p {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin: 0;
  font-style: italic;
}
```

Italic here because it's a side note, a quiet aside. Easily removed if Emma doesn't like the italic.

</section_5_more_apps>

---

<section_6_footer>

Spacing: `128px` top margin from "More apps" section.

Single row footer, bottom of page.

```html
<footer>
  <div class="footer-inner">
    <div class="footer-brand">Finnvek · 2026 · Turku, Finland</div>
    <div class="footer-links">
      <a href="mailto:contact@finnvek.com">contact@finnvek.com</a>
      <span class="dot">·</span>
      <a href="/privacy">Privacy</a>
    </div>
  </div>
</footer>
```

CSS:
```css
footer {
  padding: 3rem 0 2rem;
  border-top: 1px solid var(--color-border-faint);
  margin-top: 6rem;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--color-text-dimmed);
}
.footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
}
.footer-links a:hover {
  color: var(--color-accent);
}
.footer-links .dot {
  margin: 0 0.5rem;
  color: var(--color-text-dimmed);
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 0 1.25rem;
  }
}
```

**Privacy page stub:** Create `/src/pages/privacy.astro` as a minimal page that says:

```html
Privacy policy coming with product launch.
```

This exists because the footer links to `/privacy` — without the stub, it would 404. When KnitTools launches, Emma replaces the stub with real content.

</section_6_footer>

---

<responsive_behavior>

Breakpoints:
- Mobile: `≤ 640px`
- Tablet: `641px – 1024px` (mostly treated as desktop)
- Desktop: `> 1024px`

Test all sections at:
- 375px (small phone)
- 768px (tablet)
- 1440px (desktop)

In all three, verify:
- No horizontal scroll
- All text is legible
- Phone image is not cut off
- Header wraps or remains one row appropriately
- Footer items stack or remain inline as designed

</responsive_behavior>

---

<file_structure_target>

```
finnvek/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro         # HTML shell, meta, fonts, global CSS
│   ├── pages/
│   │   ├── index.astro              # The single content page
│   │   └── privacy.astro            # Stub, placeholder
│   ├── scripts/
│   │   └── clock.ts                 # Live time update
│   └── styles/
│       └── global.css               # All CSS — design tokens, reset, component styles
├── public/
│   ├── finnvek-logo.svg             # Extracted from v1 archive
│   ├── knittools-phone.png          # Provided by Emma (Nano Banana)
│   ├── favicon.svg                  # Simple F with turquoise dot — see below
│   ├── apple-touch-icon.png         # 180x180, from v1 archive if usable
│   └── robots.txt
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── src-v1-archive/                  # From git reset
├── public-v1-archive/
└── *-v1-archive.{ext}
```

No other files. Do not create `/src/components/` unless you need to (you probably don't — this site is simple enough to live in `index.astro` with shared styles in `global.css`).

</file_structure_target>

---

<favicon>

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0C0C0C"/>
  <text x="16" y="22" font-family="Georgia, serif" font-weight="500" font-size="20" fill="#F0F0EC" text-anchor="middle">F</text>
  <circle cx="24" cy="11" r="2" fill="#24D4C2"/>
</svg>
```

Fallback apple-touch-icon: if `src-v1-archive/public/apple-touch-icon.png` exists and is 180×180, copy it to `public/apple-touch-icon.png`. Otherwise skip — it's not critical.

</favicon>

---

<robots_and_sitemap>

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://finnvek.com/sitemap-index.xml
```

`@astrojs/sitemap` is installed and configured in `astro.config.mjs`. It auto-generates the sitemap at build time.

</robots_and_sitemap>

---

<base_layout>

`src/layouts/BaseLayout.astro` contains:

- HTML5 doctype
- `<html lang="en">`
- `<head>`:
  - charset UTF-8
  - viewport (width=device-width, initial-scale=1)
  - title — from prop, default "Finnvek"
  - meta description — from prop, default "Independent software from Turku, Finland"
  - Open Graph tags (og:title, og:description, og:url, og:type, og:image)
  - Twitter card (summary_large_image)
  - theme-color: `#0C0C0C`
  - favicon links
  - Astro font preload tags (handled automatically)
  - `<link rel="stylesheet" href={globalCssHref}>` — link to global.css
- `<body>`:
  - `<slot />` for page content
  - Clock script at end of body

**No analytics, no tracking scripts, no third-party embeds. Ever.**

</base_layout>

---

<seo_and_meta_defaults>

Default meta for home page:

```yaml
title: "Finnvek — Software that takes time. Made carefully."
description: "Independent software from Turku, Finland. One developer, building products with care. First app: KnitTools, coming soon."
og:image: /og-image.png   # 1200x630 — create from v1 archive or leave placeholder for now
```

For `/privacy`:

```yaml
title: "Privacy — Finnvek"
description: "Finnvek privacy policies"
```

</seo_and_meta_defaults>

---

<what_not_to_do>

Explicit non-goals. Any of these appearing in the final build means something went wrong.

- **No** Tailwind, Sass, PostCSS plugins beyond what Astro includes by default
- **No** dark/light mode toggle — site is dark only
- **No** navigation menu, no hamburger
- **No** hero animation, no scroll reveal, no GSAP, no Framer Motion, no Three.js
- **No** grid pattern background, no dot grid, no noise/grain
- **No** vertical scale markers, no crosshairs, no blueprint ornamentation
- **No** "pillar" info box with LAT/LONG/PRIVACY/TRACKING rows (this was the v1 design, do not resurrect it)
- **No** waitlist form stub (backend not ready — full implementation comes later)
- **No** pricing display on Finnvek.com
- **No** blog, no collections schema, no markdown content pipeline
- **No** component abstractions beyond what makes the code clearer — this is a one-page site, don't build a component library for it
- **No** client-side framework (no React, no Vue, no Svelte island except the trivial clock script)
- **No** external resource loading on page view (no CDN fonts, no analytics, no embeds)
- **No** emojis in code, content, or commits
- **No** `—` em dashes in content text (they read as AI-generated; use periods or commas instead)

</what_not_to_do>

---

<acceptance_criteria>

Phase is complete when all of these pass:

1. `npm run dev` starts with no errors. `http://localhost:4321` displays:
   - Dark warm-near-black background
   - Header with logo (left) and "Turku, Finland" + live updating time (right)
   - Hero sentence in Literata serif: "Software that takes time. Made carefully."
   - About section, four paragraphs in Figtree sans
   - KnitTools section with phone image + label + name + description + link
   - "More apps are in development." one-liner
   - Footer row with brand, email, privacy link

2. Live clock updates without flicker at ~30 second intervals. Time displayed is Europe/Helsinki regardless of visitor location.

3. All fonts load from self-hosted sources. No requests to `fonts.googleapis.com` or `fonts.gstatic.com` visible in the Network tab.

4. Typography inspection confirms Literata is rendering for the hero and KnitTools name, Figtree for body/UI.

5. Resize test at 375px, 768px, 1440px:
   - No horizontal scroll
   - No broken layout
   - Phone image scales appropriately
   - Header remains readable

6. `npm run build` completes without errors. `dist/` contains:
   - `index.html`
   - `privacy/index.html`
   - `sitemap-index.xml`, `sitemap-0.xml`
   - `robots.txt`
   - Optimized woff2 font files
   - Favicon
   - Phone image

7. Total initial page weight (HTML + CSS + fonts + logo + phone image) under 350 KB. If higher, investigate the phone image — WebP conversion may be needed.

8. Lighthouse on the built preview (`npm run preview`):
   - Performance: 95+
   - Accessibility: 100
   - Best Practices: 100
   - SEO: 95+

9. `/privacy` loads and shows the placeholder message.

10. No console errors or warnings on page load.

11. Git: work on `v2` branch, commits are small and well-messaged.

If any criterion fails, stop and report before continuing. Do not "fix" by disabling the check.

</acceptance_criteria>

---

<notes_on_ai_pitfalls>

- **Do not hallucinate Astro APIs.** Verify against https://docs.astro.build before writing config. Astro's API evolves; outdated patterns break builds.
- **Do not "improve" the spec.** Colors, spacing, and font choices are decided. If you think something is wrong, ask Emma before changing it.
- **Do not add features not listed.** Common additions AI wants to insert: dark mode toggle, language switcher, skip-to-content link, animated scroll, custom cursor, sticky header. None of these belong in this build.
- **Do not add emojis** to content, comments, or commit messages.
- **Do not use em dashes (`—`)** in content text. Use periods or commas. In code comments, they're fine.
- **Keep it small.** If a file grows past ~200 lines, ask whether it should be split — but probably it should just be shorter. This site is simple.

</notes_on_ai_pitfalls>

---

<deliverable_summary>

End state: Emma runs `npm install && npm run dev`, opens `http://localhost:4321`, and sees the full Finnvek.com one-page site. Dark editorial tone, Literata hero, Figtree body, live Turku time in the corner, KnitTools featured with phone image and link, clean footer. No navigation, no animations beyond the updating clock, no gimmicks.

When reporting completion:
- Confirm acceptance criteria met
- Note any deviations from spec and why
- Note any questions or decisions left open
- Provide build size breakdown (JS, CSS, images, fonts per file)

</deliverable_summary>
