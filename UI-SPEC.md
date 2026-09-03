<!-- generated-by: gsd-doc-writer -->
# Finnvek UI specification

This document describes the user interface that is implemented in the current source. It is a maintenance reference, not a redesign proposal.

Last verified: 3 September 2026.

## Scope and source of truth

The current UI is defined primarily by:

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/layouts/PolicyLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/privacy.md`
- `src/scripts/home-animations.ts`
- `src/scripts/brand-link-animations.ts`
- `src/scripts/site-header.ts`

If this document and the source disagree, the source is authoritative.

## Design direction

Finnvek uses a restrained editorial presentation:

- an almost-black background
- warm white primary text
- muted gray secondary text
- gold for emphasis and interactive states
- large typography and generous empty space
- custom product typography and logos
- motion that supports the brand without blocking navigation or content

The interface does not use decorative cards, colored borders, gradients, or conventional underlined navigation links.

## Design tokens

### Colors

| Token | Value | Purpose |
| --- | --- | --- |
| `--color-bg` | `#08080A` | Page background and browser theme color |
| `--color-surface-footer` | `#0C0C0C` | Footer background |
| `--color-text` | `#F0F0EC` | Primary text and default interactive text |
| `--color-text-muted` | `#9A9A95` | Supporting copy and metadata |
| `--color-text-dimmed` | `#5F5F5A` | Lower-emphasis text |
| `--color-border` | `#2A2A2A` | Structural dividers and form borders |
| `--color-border-faint` | `#1A1A1A` | Faint separators |
| `--red` | `#D9A24E` | Gold accent; the legacy variable name is retained in CSS |
| `--red-dark` | `#A9782E` | Darker gold accent |

### Layout

| Token | Value | Purpose |
| --- | --- | --- |
| `--container-wide` | `1180px` | Main content and footer maximum width |
| `--container-prose` | `720px` | Long-form policy content |
| `--gutter` | `2.5rem` | Desktop horizontal page gutter |

At viewport widths of `640px` or less, `--gutter` becomes `1.25rem`.

### Typography

| Role | Typeface |
| --- | --- |
| Body copy | IBM Plex Sans |
| General sans-serif display text | Epilogue |
| Finnvek wordmark | First |
| Editorial section headings | League Gothic |
| KnitTools logo | Teko |
| runcheck logo | Manrope |

IBM Plex Sans and Epilogue are configured through Astro Font. The other typefaces are local files in `public/fonts/` and are declared with `@font-face` in `global.css`.

Body text uses a default line height of `1.5`. Display headings use tight line height and uppercase treatments where defined by their component classes.

## Shared page shell

`BaseLayout.astro` provides the HTML document, metadata, font preloads, canonical URL, social metadata, icons, global stylesheet, page slot, and Cloudflare Web Analytics.

All three routes use the shared visual language:

- `/` uses `BaseLayout` directly.
- `/about/` uses `BaseLayout`, `SiteHeader`, and `SiteFooter`.
- `/privacy/` uses `PolicyLayout`, which composes `BaseLayout`, `SiteHeader`, and `SiteFooter` around the Markdown policy.

## Header and primary navigation

The shared header is fixed to the top of the viewport. It contains:

- a compact Finnvek logo at the upper left
- `Apps`, `About`, and `Contact` at the upper right on larger screens
- a native hamburger button and the same links in a mobile menu on smaller screens

Navigation links are white in their normal state. Hover, keyboard focus, active press, and current-page states use the gold accent without an underline.

### Desktop behavior

- Header height: `4.75rem`.
- The compact logo stays visible on About and Privacy.
- The navigation stays fixed while the page scrolls.
- `Apps` points to `/#apps`, `About` to `/about/`, and `Contact` to `mailto:contact@finnvek.com`.

### Home-page compact logo

The fixed header occupies no layout height on the home page so the hero can fill the viewport. The compact Finnvek logo is hidden while the large hero wordmark is substantially visible. An `IntersectionObserver` reveals the compact logo after the hero visibility falls below the configured threshold.

### Mobile behavior

At `760px` or less:

- header height becomes `4.25rem`
- the desktop link row is replaced by a hamburger button
- the button has an accessible label and exposes its expanded state with `aria-expanded`
- the menu closes after choosing a link, clicking outside, pressing Escape, or switching to the desktop layout
- Escape returns focus to the menu button

The menu button and links have minimum `44px` targets.

## Home page

### Hero

The hero fills at least one viewport and contains:

- a large `FINNVEK` wordmark
- the statement `Software made for years. Not weeks.`
- a small scroll cue

The wordmark spans most of the available width. The word `years.` is gold. On desktop the statement is positioned in the lower-right area; the mobile layout becomes a single column.

### Apps divider

The `Apps` heading separates the hero from the product list and supplies the `#apps` anchor. Its scroll margin accounts for the fixed header.

### Product sections

Product entries use a two-column layout:

- a roughly `200px` label or logo column
- a flexible description and action column

The layout collapses to one column at `900px` or less.

#### KnitTools

- Uses `/images/knittools.webp`.
- The image links to `https://knittoolsapp.com`.
- The description includes knitting and crochet.
- A launch-notification form accepts an email address.
- Form submission posts JSON to `https://api.finnvek.com/subscribe` with source `finnvek` and a honeypot field.
- Success replaces the controls with `You're in!`.
- Validation and request failures remain visible in the form.

#### runcheck

- Uses the repository-root `runcheck-logo.svg`, rendered inline so its parts can move independently.
- The logo links to `https://runcheckapp.com`.
- The hook descends into place, the arrow rises through it, and a short settle glow completes the reveal. The SVG also carries the same shine sweep as the runcheck website.

#### dBcheck

- Uses the imported dBcheck SVG asset.
- The logo links to `https://dbcheckapp.com`.

#### fonecheck

- Is presented as a text-only product name and short description.
- It intentionally has no logo or outbound link yet.

### Product links

Interactive product names and logos remain visually bright in their normal state so that they read as clickable. Their focus states remain visible without adding conventional text underlines.

## About page

The About page uses the shared fixed header and footer. Its main content consists of:

- a gold uppercase eyebrow
- the heading `Built by one person, on purpose.`
- editorial body copy
- a responsive portrait of Emma Hotakainen

The portrait is sourced from `src/assets/emma-hotakainen-finnvek.png` and rendered through Astro's `Picture` component as optimized AVIF/WebP with a PNG fallback. Its alternative text is `Emma Hotakainen seated inside a small aircraft.`

The page uses a two-column text-and-portrait layout above `64rem` and a single column below it.

## Privacy page

`src/pages/privacy.md` supplies the content and `PolicyLayout.astro` supplies the shell. The page includes:

- the shared fixed header and animated compact Finnvek logo
- a gold `Privacy policy` eyebrow
- the title `Privacy policy for Finnvek apps.`
- a displayed last-updated date of 16 July 2026
- a `720px` maximum-width prose column
- the shared footer

Policy content covers the developer identity, shared data practices, Crashlytics, app-specific data and external services, legal bases, user rights, children, and policy changes.

Long-form typography favors readability: muted body text, white headings and links, visible list spacing, and responsive type sizes.

## Footer

The shared footer contains:

- an animated and clickable Finnvek wordmark at the lower left
- the tagline `built to last`
- `About`, `Contact`, and `Privacy Policy` links at the lower right
- `© 2026`

Clicking the footer wordmark returns to the top of the current page. Its animation matches the compact Finnvek brand interaction used in the header.

Footer links use the same white-to-gold interaction language as header links but retain their quieter size:

- `11px` Epilogue
- normal weight
- normal capitalization
- `0.05em` letter spacing
- right aligned on larger screens

At `640px` or less, the footer stacks vertically and aligns its metadata to the left.

## Motion

### Home reveal and scroll motion

`home-animations.ts` uses GSAP, ScrollTrigger, and SplitText for:

- the initial hero reveal and brief wordmark pulse
- fine-pointer hero parallax after the opening animation
- scroll-cue fading
- section-divider progression
- product-copy and product-logo reveals
- KnitTools roll and stamp movement
- runcheck hook-and-arrow reveal and settle glow
- dBcheck signal movement
- footer reveal

Scroll-triggered reveals are intended to play once where configured and leave content in its final visible state.

### Finnvek brand motion

`brand-link-animations.ts` splits the header and footer Finnvek wordmarks into characters while preserving an accessible brand label.

- Fine-pointer devices trigger the interaction through hover and keyboard focus.
- Coarse-pointer devices do not depend on hover; the header logo receives a brief entrance treatment and the footer animates when it becomes visible.
- The home page can trigger the compact-logo reveal when the header script reports it visible.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- GSAP reveals and parallax are skipped or resolved to their final states
- transitions and animations are minimized by CSS
- all content and controls remain available

## Interactive states

| Element | Normal | Hover/focus | Active/current |
| --- | --- | --- | --- |
| Header navigation | White | Gold | Gold |
| Footer navigation | White, visually smaller than header | Gold | Gold for current page |
| Finnvek header/footer logo | Warm white | Character animation on supported input | Remains readable and clickable |
| Product logo link | Bright, recognizable logo | Existing logo-specific motion | No persistent active style |
| Notify input | Dark background and structural border | Visible focus outline | Native validity plus inline status |
| Notify button | White text on dark background | White background with dark text | Disabled while sending |
| Hamburger | White lines | Visible focus outline | Exposes expanded state |

Keyboard focus must remain visible even where pointer hover supplies animation.

## Accessibility contract

- The document language is English.
- Navigation is labelled and current-page states use `aria-current="page"` where applicable.
- The hamburger exposes state and supports Escape dismissal.
- The compact and footer wordmarks keep meaningful accessible labels while their visible characters animate.
- Decorative animation wrappers do not replace the accessible name.
- Images have useful alternative text or are treated as decorative when their surrounding link already supplies the name.
- The notify form has a real email label, `type="email"`, `required`, and `autocomplete="email"`.
- Touch targets in mobile navigation are at least `44px`.
- Gold interactive text must remain distinguishable against the dark background.
- Reduced-motion users receive complete static content.

## Responsive verification matrix

| Width range | Required behavior |
| --- | --- |
| Above `64rem` | About page uses text and portrait columns. |
| Above `900px` | Product entries use label/content columns; desktop motion may run. |
| `901px` and above | Full desktop navigation is available. |
| `900px` and below | Product entries collapse to one column. |
| `760px` and below | Hamburger navigation replaces the desktop link row; home hero becomes a mobile composition. |
| `640px` and below | Gutters shrink and the footer stacks with left-aligned metadata. |

Verification should cover keyboard-only navigation, coarse-pointer interaction, reduced motion, form success and error states, long policy content, and the home header transition from the hero wordmark to the compact logo.
