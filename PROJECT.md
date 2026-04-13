# Finnvek.com

Finnvek corporate website. Single-page static site showcasing Finnvek and its software projects.

**URL:** https://finnvek.com
**Contact:** contact@finnvek.com
**Location:** Turku, Finland

## Tech Stack

- **Framework:** Astro 6.1.5 (static output)
- **Styling:** Pure CSS with custom properties (no Tailwind)
- **Fonts:** Google Fonts via Astro font system
- **Sitemap:** @astrojs/sitemap (auto-generated)
- **Deployment:** Cloudflare Pages (static dist/ output)
- **Node:** >=22.12.0

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server at localhost:4321 |
| `npm run build` | Static build to dist/ |
| `npm run preview` | Preview built site |

## Design System

### Theme

Dark-only theme. No light mode.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0A0A0F` | Page background (fallback) |
| `--bg-card` | `#13131A` | Card background (used as rgba(19,19,26,0.92) with backdrop-filter) |
| `--color-primary` | `#EDEDF0` | Primary text |
| `--color-muted` | `#8E8E9F` | Secondary text, labels |
| `--color-dimmed` | `#5A5A6A` | Tertiary text |
| `--color-accent` | `#1DB4A5` | Turquoise accent, links |
| `--color-accent-hover` | `#24D4C2` | Link hover |
| `--color-border` | `#1E1E28` | Borders |
| `--color-border-hover` | `#2A2A35` | Card border hover |

### Typography

| Role | Font | Weight | Variable |
|------|------|--------|----------|
| Headings | Sora | 400, 500 | `--font-sora` |
| Body | DM Sans | 400 | `--font-dm-sans` |
| Labels, tags, footer | DM Mono | 400 | `--font-dm-mono` |

### Layout

- Max width: 720px
- Mobile padding: 20px (24px at 640px+)
- Card border-radius: 12px

## Project Structure

```
src/
  components/
    LogoAnimated.astro  -- Hero logo with CSS bounce animation (click to replay)
    LogoStatic.astro    -- Footer logo, static SVG
    Hero.astro          -- Animated logo + subtitle
    ProjectCard.astro   -- Reusable project card (icon, name, tag, description, external link arrow)
    Footer.astro        -- Static logo + copyright/contact line
  layouts/
    BaseLayout.astro    -- HTML shell, meta tags, OG tags, JSON-LD, global CSS import
  pages/
    index.astro         -- Main page composition
  styles/
    global.css          -- Design tokens, reset, typography, layout, animations
  content/
    blog/               -- Empty blog collection (prepared for future use)
  content.config.ts     -- Blog collection schema (title, description, pubDate)

public/
  favicon.svg           -- Finnvek F with turquoise dot, dark rounded background
  apple-touch-icon.png  -- 180x180 PNG version of favicon
  og-image.png          -- 1200x630 social sharing image (logo + subtitle)
  knittools-icon.webp   -- KnitTools app icon for project card
  hero-bg.webp          -- Full-page dot-pattern background image (fixed, covers viewport)
  robots.txt            -- Allow all, points to sitemap
```

## Page Sections

1. **Hero** -- min-height 55vh, vertically centered. Animated FINNVEK logo (SVG, CSS-only, 456px max-width). Letters fade in staggered, turquoise dots bounce from above, F and E squish on impact. Click to replay. Subtitle: "Independent software from Turku, Finland" (24px, Sora 400).

2. **Projects** -- Section label "PROJECTS" (DM Mono 0.85rem, uppercase, --color-primary). Each letter drops from above with staggered bounce animation. KnitTools card with 72px app icon, translucent background (rgba + backdrop-filter blur), "Coming soon" badge, description, and external link arrow (top-right). "More apps coming soon" centered below with drop-in animation.

3. **Footer** -- Static FINNVEK logo floats on background (links to page top, opacity hover effect). Info line ("© 2026 Finnvek · contact@finnvek.com · Turku, Finland") in a centered pill with translucent dark background (rgba(10,10,15,0.85), border-radius 8px). No full-width background or border-top.

## Logo

Custom Audiowide-based wordmark "FINNVEK" where the F and E have horizontal bars removed, replaced with turquoise (#1DB4A5) circles. Two variants:

- **LogoAnimated** -- viewBox 0 0 402 62 (extra vertical space for dot bounce), 456px max-width. CSS keyframe animations: letter-in (staggered fade+scale), dot-f-bounce, dot-e-bounce, squish-f, squish-e. Click-to-replay via JS.
- **LogoStatic** -- viewBox 0 0 402 52. No animation. 120px width for footer.

Source files in project root: `finnvek-logo.svg` (static paths), `finnvek-logo-animation.html` (animation reference).

## Animations

- **Page load:** Staggered fade-up (0.6s ease-out, 0.12s delay between sections)
- **Logo:** Letter fade-in, dot bounce, letter squish (CSS-only, click to replay)
- **"PROJECTS" label:** Each letter drops from above with staggered bounce (50ms intervals, cubic-bezier(0.34, 1.56, 0.64, 1))
- **"More apps coming soon":** Drops in as a whole after PROJECTS letters complete (0.9s delay, ease-out)
- **Card hover:** translateY(-2px), border brightens to #2A2A35
- **External arrow hover:** Moves diagonally (2px right, 2px up), turns white
- **Footer logo hover:** Opacity 0.7 to 1.0
- **Footer email hover:** Turns white
- **Text selection:** Turquoise highlight (rgba(29, 180, 165, 0.3))

## Background

Fixed full-page background image (`hero-bg.webp`) with `background-attachment: fixed`. The dot-pattern stays in place while content scrolls over it. `--bg-base` (#0A0A0F) serves as fallback. No gradient overlay.

## SEO & Meta

- Canonical URL
- Open Graph tags (title, description, type, url, image with dimensions)
- Twitter card (summary_large_image with image)
- theme-color (#0A0A0F)
- apple-touch-icon (180x180)
- JSON-LD Organization schema (name, url, description, email, address)
- Auto-generated sitemap (sitemap-index.xml)
- robots.txt (allow all)

## Current State

- KnitTools is listed with "Coming soon" badge -- not yet on Google Play or Amazon Appstore
- Blog collection is defined but empty
- No SSR needed -- purely static site
- No Cloudflare adapter installed (not needed for static output)
