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
- `src/pages/privacy.md`
- `src/components/AppPolaroid.astro`
- `src/scripts/home-animations.ts`
- `src/scripts/app-focus.ts`
- `src/scripts/laptop-note.ts`
- `src/scripts/laptop-reveal.ts`
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

Both content routes use the shared visual language:

- `/` uses `BaseLayout` directly.
- `/privacy/` uses `PolicyLayout`, which composes `BaseLayout`, `SiteHeader`, and `SiteFooter` around the Markdown policy.

## Header and primary navigation

The shared header is fixed to the top of the viewport. It contains:

- a compact Finnvek logo at the upper left
- `Apps` and `Contact` at the upper right on larger screens
- a native hamburger button and the same links in a mobile menu on smaller screens

Navigation links are white in their normal state. Hover, keyboard focus, active press, and current-page states use the gold accent without an underline.

### Desktop behavior

- Header height: `4.75rem`.
- The compact logo stays visible on Privacy.
- The navigation stays fixed while the page scrolls.
- `Apps` points to `/#apps` and `Contact` to `mailto:contact@finnvek.com`.

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

The hero fills roughly one viewport and contains:

- the heading `Hi, I'm Emma.`
- a laptop image with Emma on its screen and a handwritten note (Caveat) that changes with Finnish time of day
- a cursor lens that reveals Kotlin code over the dark screen background, never over Emma's face, plus a one-time hint sweep after load
- a faint floor light and shadow under the laptop
- a small gold scroll cue

On mobile the heading sits above the laptop in a single column.

### Introduction

Two short paragraphs introduce Finnvek, signed off with Emma's handwritten signature, which is written in after the paragraphs appear.

### Apps

The `#apps` divider leads to an `Apps` label, a gold handwritten hint, and a dark lined notebook page with four taped polaroids (KnitTools, runcheck, dBcheck, fonecheck). Each polaroid shows the real app logo as a printed photo with the app name handwritten on its bottom border. A handwritten note in the page corner says that all four are still in the works.

Selecting a polaroid lifts it from under its tape into a full-screen focus view with the description, the domain link, and for KnitTools the launch-notification form. The lifted polaroid itself links to the app's site. Escape, the close button, and the backdrop close the view and return the polaroid under its tape.

The notebook shows four columns above `760px` and two at `760px` and below.

KnitTools launch-notification form:

- Form submission posts JSON to `https://api.finnvek.com/subscribe` with source `finnvek` and a honeypot field.
- Success replaces the controls with `You're in!`.
- Validation and request failures remain visible in the form.

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
- `Contact` and `Privacy Policy` links at the lower right
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

`home-animations.ts` uses GSAP and ScrollTrigger for:

- the hero heading and laptop entrance, and the handwritten laptop note being written in
- the introduction reveal and the signature being written in
- section-divider progression
- polaroids dropping onto the notebook page, tapes being pressed on, and captions being written in
- each app logo's own reveal inside its polaroid (KnitTools roll, runcheck hook and arrow with settle glow, dBcheck signal, fonecheck wordmark)
- the corner note being written in
- footer reveal

`laptop-reveal.ts` drives the cursor lens and the hint sweep; `app-focus.ts` drives the polaroid lift into the focus view.

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
| Above `760px` | The apps notebook shows four polaroid columns. |
| `901px` and above | Full desktop navigation is available. |
| `760px` and below | Hamburger navigation replaces the desktop link row; the hero becomes one column; the notebook shows two polaroid columns. |
| `640px` and below | Gutters shrink and the footer stacks with left-aligned metadata. |

Verification should cover keyboard-only navigation, coarse-pointer interaction, reduced motion, form success and error states, long policy content, and the home header transition from the hero wordmark to the compact logo.
