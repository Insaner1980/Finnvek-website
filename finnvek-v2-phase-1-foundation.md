# Finnvek.com v2 — Phase 1: Foundation

**Scope of this document:** This is Phase 1 of a multi-phase rebuild of Finnvek.com. This phase covers **the foundation only**: Astro project setup, dark background with subtle dot grid, typography system (Lekton + Commissioner), and basic page shell. Phase 2 will add the 3D logo. Phase 3 will add content (KnitTools card, projects section, footer). **Do not implement anything beyond Phase 1 scope.**

---

<context>

The existing Finnvek.com repository was built iteratively over multiple design directions that did not land. Rather than retrofit the existing codebase, we are starting from a clean slate in a new `v2` branch. The old implementation contained aesthetic choices (blueprint scale markers, info pillar, dimensional ornamentation) that will not be carried over. Nothing from the existing `src/` should be copied unless this spec explicitly says so.

The foundation must be minimal, calm, and technically clean. It is the stage on which Phase 2 (a Three.js 3D logo) and Phase 3 (product content) will be placed. If Phase 1 looks "empty" — that is correct. It should.

</context>

<brand_values_reminder>

The site represents Finnvek, an independent software brand based in Turku, Finland. Brand values:

- Privacy by default
- No ads, no tracking
- Made to last
- Independent

These values inform technical choices (e.g. self-hosted fonts over CDN) and aesthetic choices (restrained, not trendy).

</brand_values_reminder>

<tech_stack>

- **Framework:** Astro (latest stable as of implementation date — check https://astro.build for current version; do not assume)
- **Styling:** Pure CSS with custom properties. No Tailwind, no CSS-in-JS, no Sass.
- **Fonts:** Lekton and Commissioner, served via Astro's built-in font system (self-hosted, Google Fonts as source). Do not load via Google Fonts CDN.
- **Deployment:** Cloudflare Pages (static output via `astro build`)
- **Node:** Use the version specified by the latest Astro release requirements

Before starting, run `npm create astro@latest` to scaffold the project with the current recommended setup. Choose: empty template, TypeScript (strict), yes to `npm install`.

</tech_stack>

<directory_to_work_in>

The existing repository is at `/home/emma/projects/finnvek` (or wherever it is located on disk — you know where). Create a new branch called `v2` from `main`. On this branch:

1. Back up the existing `src/` to `src-v1-archive/` (do not delete — keep for reference).
2. Back up the existing `public/` to `public-v1-archive/` (same reason).
3. Back up the existing `astro.config.mjs`, `package.json`, and `tsconfig.json` to `*-v1-archive.{ext}` files.
4. Scaffold a fresh Astro project **in-place** in the repo root (overwriting `astro.config.mjs`, `package.json`, `tsconfig.json`, creating a fresh `src/` and `public/`).
5. Commit this as a single commit: `chore: v2 reset — archive v1, scaffold fresh astro`.

From that commit onward, all Phase 1 work is additive on top of the fresh scaffold.

</directory_to_work_in>

---

<file_structure_target>

After Phase 1 completion, the project should look like this:

```
finnvek/
├── src/
│   ├── components/
│   │   └── Grid.astro           # Dot grid background component
│   ├── layouts/
│   │   └── BaseLayout.astro     # HTML shell, meta, font loading
│   ├── pages/
│   │   └── index.astro          # Single page, mostly empty
│   └── styles/
│       └── global.css           # Design tokens, reset, base typography
├── public/
│   ├── favicon.svg              # Placeholder — simple "F" in turquoise
│   └── robots.txt               # Allow all, point to sitemap
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── src-v1-archive/              # From step 1 above
├── public-v1-archive/            # From step 2 above
└── *-v1-archive.{ext}            # Config backups
```

No other files should exist in `src/` or `public/` at the end of Phase 1.

</file_structure_target>

---

<background_spec>

The background is the defining visual element of Phase 1. It must be present on every page, cover the full viewport (and beyond, when the page scrolls), and be hand-implemented with CSS — no images, no SVG files, no libraries.

**Base color:** `#08080A` (near-black, slightly warmer than pure `#000` to avoid OLED blackness while still reading as black on most displays).

**Overlay pattern:** A dot grid.

- Dot color: `#FFFFFF`
- Dot opacity: `0.05` (5%) on desktop
- Dot size: `1px` diameter
- Grid spacing: `32px` × `32px`
- Pattern implementation: CSS `radial-gradient` + `background-size`
- The grid must extend infinitely — it covers `html, body` and does not end at the bottom of content.

**Mobile adjustment:** On viewports `≤ 640px`, increase dot opacity to `0.07` (7%). Rationale: smaller screens have higher pixel density and the dots get lost at 5%.

**Implementation (for reference, place in `src/styles/global.css`):**

```css
html, body {
  background-color: #08080A;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 1px
  );
  background-size: 32px 32px;
  background-attachment: fixed; /* Grid stays put on scroll */
  min-height: 100vh;
}

@media (max-width: 640px) {
  html, body {
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.07) 1px,
      transparent 1px
    );
  }
}
```

**Do not:**

- Add a vignette (radial darkness fade at edges)
- Add noise/grain texture
- Add any second overlay layer
- Use an image file for the pattern
- Animate the grid in any way
- Make the grid respond to mouse movement

The background is static, minimal, and quiet. It is a stage, not a performer.

</background_spec>

---

<typography_spec>

Two typefaces, loaded via Astro's built-in font system (see https://docs.astro.build/en/guides/fonts/ — read this page before implementing, as the API is current and stable but evolving).

**Font 1: Lekton**
- Role: Headings, labels, display text, anything uppercase or "structural"
- Source: Google Fonts (Astro will self-host automatically)
- Weights needed: 400 (Regular), 700 (Bold)
- CSS variable: `--font-display`

**Font 2: Commissioner**
- Role: Body text, long-form content, descriptions
- Source: Google Fonts (Astro will self-host automatically)
- Weights needed: 300 (Light), 400 (Regular), 500 (Medium)
- CSS variable: `--font-body`

**Astro config example (verify against current docs):**

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Lekton',
        cssVariable: '--font-display',
        weights: [400, 700],
        styles: ['normal'],
      },
      {
        provider: fontProviders.google(),
        name: 'Commissioner',
        cssVariable: '--font-body',
        weights: [300, 400, 500],
        styles: ['normal'],
      },
    ],
  },
});
```

**Verify the API above before writing the config.** Astro's font API moved out of experimental at some point; use the non-experimental version if available. If it doesn't work as written, consult https://docs.astro.build and use the correct current syntax.

**Base typography rules in `global.css`:**

```css
:root {
  --color-bg: #08080A;
  --color-text: #EDEDF0;
  --color-muted: #8E8E9F;
  --color-dimmed: #5A5A6A;
  --color-accent: #1DB4A5;
  --color-accent-hover: #24D4C2;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.label, .mono, [data-role="label"] {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}
```

Note: Lekton has a distinctive trispaced character. It will show its personality in labels and headings. Do not try to "fix" this with letter-spacing adjustments beyond what's shown above — the character is the point.

</typography_spec>

---

<layout_spec>

Phase 1 has a single page (`src/pages/index.astro`) and minimal content. The layout system established here will be reused in Phase 2 and 3.

**Container:**
- Max content width: `1200px`
- Horizontal padding: `2rem` desktop, `1.25rem` mobile
- Content is horizontally centered via `margin: 0 auto`

**Vertical rhythm:**
- Establish a base spacing unit of `8px` (0.5rem)
- Sections separated by `6rem` (96px) on desktop, `4rem` (64px) on mobile
- This will matter more in Phase 3, but establish it now

**No sidebars, no fixed elements, no floating navigation.** The page is a single column. Phase 2 will add the hero (3D logo), which will be the first element in this column.

</layout_spec>

---

<page_content_phase_1>

The index page (`src/pages/index.astro`) should contain **only the following**:

1. A minimal hero placeholder: centered text saying "Finnvek" in `--font-display`, weight 700, size `3rem`, color `--color-text`. This is a temporary placeholder for Phase 2's 3D logo. It establishes that the center of the page is where the logo will go.

2. Below the placeholder, centered: a single line of text in `--font-display`, Regular, uppercase, size `0.75rem`, letter-spacing `0.2em`, color `--color-muted`: `"PHASE 1 — FOUNDATION"`. This is a development marker and will be removed in Phase 2. It exists so Emma can confirm the foundation is rendering correctly at a glance.

That is all. No header, no footer, no other content, no placeholder text, no lorem ipsum.

The hero placeholder + phase marker should be vertically centered in the viewport on first load. When the viewport is tall enough, there is no scrolling — the entire foundation is visible in one view.

</page_content_phase_1>

---

<base_layout_spec>

`src/layouts/BaseLayout.astro` should contain:

- `<!DOCTYPE html>` and full HTML shell
- `<html lang="en">` (brand site is in English; Finnish content goes elsewhere)
- Meta: charset UTF-8, viewport (responsive), description, generator
- Open Graph tags (og:title, og:description, og:url, og:image — use placeholder values for now, OG image will be added in Phase 3)
- Twitter card: `summary_large_image`
- `theme-color` meta: `#08080A`
- Favicon link to `/favicon.svg`
- Astro font preload tags (handled automatically by the font system — verify)
- Import of `src/styles/global.css`
- Slot for page content

No analytics. No tracking scripts. No third-party embeds. Ever.

</base_layout_spec>

---

<favicon_placeholder>

Create a minimal placeholder `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#08080A"/>
  <text x="16" y="22" font-family="sans-serif" font-weight="700" font-size="20" fill="#EDEDF0" text-anchor="middle">F</text>
  <circle cx="24" cy="11" r="2" fill="#1DB4A5"/>
</svg>
```

This is a placeholder. The real favicon will be revisited in Phase 3.

</favicon_placeholder>

---

<robots_txt>

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://finnvek.com/sitemap-index.xml
```

Install `@astrojs/sitemap` and wire it into `astro.config.mjs` so the sitemap is generated at build time. Set `site: 'https://finnvek.com'` in the config.

</robots_txt>

---

<responsive_behavior>

Phase 1 has minimal responsive concerns because there is minimal content. The key breakpoints that Phase 2 and 3 will use are established here:

- Mobile: `≤ 640px`
- Tablet: `641px – 1024px` (not heavily used; desktop rules usually apply)
- Desktop: `> 1024px`

Test the foundation in at least:
- 375px width (small phone)
- 768px width (tablet portrait)
- 1440px width (desktop)

In all three, the dot grid should be visible, the background color correct, and the hero placeholder centered both horizontally and vertically.

</responsive_behavior>

---

<what_not_to_do>

Explicit non-goals for Phase 1:

- **Do not** copy any component, CSS, or asset from `src-v1-archive/` or `public-v1-archive/`. If you need to understand how something was done before, read it for reference, but reimplement from scratch.
- **Do not** implement the 3D logo. That is Phase 2.
- **Do not** implement any content sections (projects, waitlist, footer text). That is Phase 3.
- **Do not** add animations. Phase 1 is fully static.
- **Do not** add GSAP, Three.js, or any animation/graphics library. The foundation has no JavaScript dependencies beyond Astro itself.
- **Do not** create a `Hero.astro`, `ProjectCard.astro`, `Footer.astro`, or similar content components. The placeholder text belongs directly in `index.astro`.
- **Do not** add Tailwind, Sass, or any CSS preprocessor.
- **Do not** over-engineer. If a piece of CSS is 3 lines, let it be 3 lines. No abstractions for the sake of abstraction.
- **Do not** add blog/collections/content schema. Phase 1 has no content-driven features.
- **Do not** add dark/light mode toggle. Site is dark only.

</what_not_to_do>

---

<acceptance_criteria>

Phase 1 is complete when all of the following are true:

1. Running `npm run dev` starts the dev server with no errors or warnings (Astro warnings about missing fields are acceptable if they do not affect rendering).
2. Visiting `http://localhost:4321` displays a near-black page with visible but subtle dot grid and centered "Finnvek" text.
3. The dot grid is visible but does not compete for attention with the centered text.
4. The centered text is rendered in Lekton (not a fallback system font). Verify by inspecting the font via browser devtools.
5. Resizing the viewport down to 375px width still shows: dot grid (slightly more visible), centered "Finnvek" text, no horizontal scroll, no broken layout.
6. Running `npm run build` completes with no errors and produces a `dist/` directory containing `index.html`, optimized font files (woff2), and a sitemap.
7. The built output has no `<script>` tags that load external resources. No Google Fonts CDN links. No analytics.
8. Page weight on initial load (HTML + CSS + fonts) is under 100 KB total. If it's higher, something is wrong — investigate before considering Phase 1 done.
9. Lighthouse score on the built output: Performance 100, Accessibility 100, Best Practices 100, SEO ≥ 90. Run this in Chrome devtools against a local preview (`npm run preview`) before shipping.
10. Git: all work is on branch `v2`. `main` is untouched. Commits are small and well-messaged.

If any criterion fails, stop and report the failure — do not patch around it or disable the check.

</acceptance_criteria>

---

<notes_on_ai_pitfalls>

Notes for the implementing model (Claude Code):

- **Do not hallucinate Astro APIs.** If you are not 100% sure of the current syntax for font config, sitemap config, or any other Astro feature, open the docs (https://docs.astro.build) and verify before writing code. Astro's API has evolved, and outdated patterns will produce broken builds.
- **Do not "improve" the spec.** If you think a detail is wrong or a color should be different, ask Emma before changing it. The spec reflects decisions already made in conversation.
- **Do not add features not in the spec.** Things like "dark mode toggle," "language switcher," "skip to content link," "loading spinner" are not part of Phase 1. Accessibility is handled by semantic HTML and proper meta tags in Phase 1 — richer a11y features are added in later phases when there is content to be accessible *to*.
- **Simplicity check:** If a file is more than ~50 lines of code, ask yourself whether it needs to be. Phase 1 is a foundation, not an application.
- **No clever CSS.** Use the most boring, widely-supported CSS that achieves the goal. No `@container`, no advanced selectors, no experimental features. These may come in later phases if genuinely needed.

</notes_on_ai_pitfalls>

---

<deliverable_summary>

At the end of Phase 1, Emma should be able to:

1. Check out the `v2` branch
2. Run `npm install && npm run dev`
3. Open `http://localhost:4321` (or whatever port is open)
4. See: a near-black page, a quiet dot grid, and centered "Finnvek" text in Lekton

That is the entire user-visible deliverable. Everything else (fonts loading, build working, Lighthouse scores, file structure) is infrastructure supporting that outcome.

When done, summarize:
- What was done
- Any deviations from the spec and why
- Any questions or decisions left open for Phase 2

</deliverable_summary>
