<!-- generated-by: gsd-doc-writer -->
# Finnvek website

The source for [finnvek.com](https://finnvek.com), a static English-language site presenting Emma Hotakainen's Android apps and their privacy policy.

## What is included

- A full-viewport Finnvek landing page with sections for KnitTools, runcheck, dBcheck, and fonecheck
- An About page for Emma Hotakainen and the Finnvek brand
- A shared privacy policy for KnitTools, runcheck, and dBcheck
- Responsive fixed navigation and shared footer components
- GSAP-powered entrance, scroll, logo, and product animations with reduced-motion handling
- A KnitTools launch-notification form that posts to the Finnvek subscription API

## Requirements

- Node.js `>=22.12.0`
- npm, using the committed `package-lock.json`

## Installation

```bash
git clone https://github.com/Insaner1980/Finnvek-website.git
cd Finnvek-website/finnvek-site
npm ci
```

## Local development

Start the Astro development server:

```bash
npm run dev
```

Astro serves the site at `http://localhost:4321` by default.

Available routes:

- `/` - home and app overview
- `/about/` - creator and brand information
- `/privacy/` - app privacy policy

## Build and preview

Create the static production output in `dist/`:

```bash
npm run build
```

Preview the completed build locally:

```bash
npm run preview
```

The repository does not contain an automated deployment workflow. The production site target configured in Astro is `https://finnvek.com`.

## Main structure

```text
src/
  assets/       Images and SVG assets processed by Astro
  components/   Shared site header and footer
  layouts/      Shared document shell and privacy layout
  pages/        Home, About, and Privacy routes
  scripts/      Navigation, form, and animation behavior
  styles/       Global design system and responsive rules
public/
  fonts/        Local typefaces
  images/       Static app imagery
  .well-known/  Published security contact
```

The home page imports `runcheck-logo.svg` from the project root and renders it inline so the logo's hook, arrow, and shine can animate independently.

## External services

- Astro's Google font provider supplies IBM Plex Sans and Epilogue at build time.
- Cloudflare Web Analytics is loaded from the shared base layout.
- The notification form posts JSON to `https://api.finnvek.com/subscribe`.
- The sitemap integration generates `sitemap-index.xml` for the configured production URL.

No environment variables are read by the current site source.

## Further documentation

- [PROJECT.md](PROJECT.md) describes the current implementation and runtime behavior.
- [UI-SPEC.md](UI-SPEC.md) records the visual, responsive, interaction, and accessibility contracts.
