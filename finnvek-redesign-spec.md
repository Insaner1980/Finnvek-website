# Finnvek redesign — implementation spec

This spec describes a redesign of the Finnvek website covering the home page, privacy page, footer, typography, and animations.

**Visual reference:** `finnvek-mockup-v2.html` — open this file alongside the spec for exact CSS values, spacing, and visual treatments. The spec describes the **what**; the mockup is the source of truth for the **how**.

**Scope:** redesign of the marketing site only. Not in scope: backend for the notify form, social preview images, JSON-LD, Google Play badge integration (deferred to launch), or any Amazon Appstore presence (the Amazon Appstore for Android shut down in August 2025 and is no longer a target).

## Why this redesign

The current site centers on a giant `FINNVEK` wordmark masthead with an overlapping uppercase tagline. The wordmark + tagline overlap doesn't read well. The About and KnitTools sections lean on stock-feeling images (laptop, phone screen) that don't add meaning, and the phone screen implies KnitTools is closer to launch than it is.

The new direction is editorial: a Diet-Coke-inspired hero ("Software made for years. *Not weeks.*"), red as a strategic accent on top of the existing black/white/grey palette, and a red KnitTools "launch card" that announces the project without showing unfinished UI.

## Don't over-engineer

A few guardrails to keep this implementation small:

- Do not introduce new dependencies (no Tailwind, no component libraries, no new GSAP plugins beyond what's already imported)
- Do not refactor unrelated code "while you're in there"
- Do not invent new components if straightforward markup works
- Match the existing flat structure: pages and styles stay where they are, no `src/components/` directory
- Reuse existing patterns (notify form JS, ScrollTrigger setup, etc.)

## 1. Color tokens

Add two new tokens to `:root` in `src/styles/global.css`:

```css
--red: #C8281E;       /* deep editorial red, hero italic + KnitTools card */
--red-dark: #8C1810;  /* dark red for text on light pills against red bg */
```

All existing tokens stay. `--color-border-faint` is still unreferenced anywhere — leave it for now or remove if convenient.

## 2. Typography

### Add Epilogue

Epilogue is a variable sans-serif by Tyler Finck (Etcetera Type Co), free under the SIL Open Font License. It pairs against Newsreader's editorial serif as the modern sans counterpoint and carries multiple roles: the hero italic punch line, top-bar meta, section labels, the notify button, the footer tagline, the card URL, and footer meta. 9 weights with full italic support; ship at least Regular (400) and Medium (500), upright + italic.

In `astro.config.mjs`, add to the `fonts` array (alongside the existing Newsreader entry):

```js
{
  provider: fontProviders.google(),
  name: 'Epilogue',
  cssVariable: '--font-sans',
  weights: ['400 500'],
  styles: ['normal', 'italic'],
}
```

In `src/layouts/BaseLayout.astro`, add a preload alongside the existing one:

```astro
<Font cssVariable="--font-sans" preload />
```

In `global.css`, add a stack token alongside the existing ones:

```css
--font-sans-stack: var(--font-sans), Epilogue, sans-serif;
```

### Drop Boldonse

`Boldonse` is configured in `astro.config.mjs` and preloaded but never referenced by any selector. The new design uses Newsreader for headings and Epilogue for sans, so Boldonse stays unused. Remove it:

- Remove the Boldonse entry from `astro.config.mjs`
- Remove the `<Font cssVariable="--font-display" preload />` line from `BaseLayout.astro`
- Remove `--font-display-stack` from `global.css`

### Final font roles

- **Newsreader** (`--font-body-stack`) — body, headings, hero main line ("Software made for years."), about h2 and prose, signature, KnitTools h2 and description, knit-link, card title, card info table
- **Epilogue** (`--font-sans-stack`) — hero italic ("Not weeks." in red), top-bar meta line 1 ("Independent Software"), section labels ("About", "First app"), notify button, footer tagline ("built to last", italic), card URL, footer meta line
- **First** (`--font-logo-stack`, local TTF) — only the FINNVEK wordmark in the top bar and footer

JetBrains Mono is **not** added. The new design uses three fonts total.

## 3. Top bar (new)

Replaces the entire existing `<header class="masthead">` (the giant wordmark + overlapping tagline). The top bar appears on **both** the index page and the privacy page — they share identical header markup after this change.

```html
<header class="topbar">
  <a href="/" class="topbar-logo" aria-label="Finnvek home">FINNVEK</a>
  <div class="topbar-meta">
    <div class="topbar-meta-line1">Independent Software</div>
    <div class="topbar-meta-line2">Turku, Finland.</div>
  </div>
</header>
```

CSS values per the mockup's `.topbar` / `.topbar-logo` / `.topbar-meta` rules. Differences from the mockup to note:

- The mockup's `.topbar-logo` uses tracked-spacing `F I N N V E K` in Epilogue as a placeholder. The real implementation should use the existing `First` font (`var(--font-logo-stack)`) and write `FINNVEK` without manual letter-spacing — the First font has its own character. Suggested size: ~`clamp(1rem, 1.5vw, 1.25rem)`. Tune visually so it reads as a quiet brand mark, not a dominant element.
- `.topbar-meta-line1` ("Independent Software") uses `--font-sans-stack`, weight 500, ~11px, letter-spacing 0.22em, uppercase, white.
- `.topbar-meta-line2` ("Turku, Finland.") uses `--font-body-stack`, italic, ~0.875rem, `var(--color-text-muted)`.

## 4. Hero (modified)

Replaces the existing hero content. **One H1 only** — no eyebrow, no meta line, no tagline.

```html
<section class="hero">
  <h1 class="hero-text">
    Software made for years.
    <span class="italic">Not weeks.</span>
  </h1>
</section>
```

Styling per mockup `.hero` / `.hero-text`. Key specs:

- `.hero-text`: `var(--font-body-stack)`, `clamp(2.75rem, 7.5vw, 6.5rem)`, line-height 1.0, letter-spacing -0.025em, max-width 18ch
- `.hero-text .italic`: italic, `color: var(--red)`, `display: block` (forces second line)
- Generous padding: `clamp(5rem, 12vw, 11rem)` top, `clamp(7rem, 14vw, 13rem)` bottom

## 5. About section (modified)

Same prose copy verbatim from the current site — do not change the four existing paragraphs. Changes:

1. Add a section label "About" in a left column (200px wide)
2. Add a sub-headline (h2) above the prose: `Built around <em>ideas worth following.</em>`
3. Remove the laptop image and `.about-image` markup entirely
4. Use a 2-column grid: 200px label + 1fr body
5. Signature: just "Emma" in italic — **no em-dash prefix**

```html
<section class="about">
  <div class="section-label">About</div>
  <div class="about-body">
    <h2>Built around <span class="italic">ideas worth following.</span></h2>
    <p>Finnvek is independent software from Turku, Finland. I'm one developer, working on my own projects.</p>
    <p>It exists because some ideas were worth following, and I had the freedom to follow them. The kind of ideas that stay interesting for years, not weeks. The kind I care about enough to build carefully, without shortcuts or rushed releases.</p>
    <p>Every product is its own thing. No ads, no tracking. Made to work well, and to keep working for a long time.</p>
    <p>The first one is KnitTools. More are on the way.</p>
    <div class="about-sig">Emma</div>
  </div>
</section>
```

Important: the H2's italic part uses `var(--color-text-muted)` — **not red**. Red is reserved for the hero italic and the card. The about italic is intentionally quiet.

Styling per mockup `.about` / `.section-label` / `.about-body` / `.about-sig`.

The `<hr class="section-divider" data-section-line />` between sections stays — both the markup and the scroll-scrubbed animation.

## 6. KnitTools section (redesigned)

Significant change. The old structure was 2-column with the phone image on the left and content on the right (eyebrow / heading / description / info table / form / link). The new structure has a 200px section label on the left and a content + card composition on the right.

```html
<section class="knit">
  <div class="section-label">First app</div>
  <div class="knit-content">
    <div class="knit-text">
      <h2>KnitTools</h2>
      <p>KnitTools is a pocket companion for knitters. It counts your rows, reads your patterns, and keeps your stash quietly in order, with voice and AI that speaks knitter. In eleven languages, for Android.</p>
      <form class="notify" data-notify-form>
        <label class="visually-hidden" for="notify-email">Email address</label>
        <input id="notify-email" name="email" type="email" placeholder="email address" autocomplete="email" required />
        <button type="submit">Notify me at launch</button>
      </form>
      <a class="knit-link" href="https://knittoolsapp.com">knittoolsapp.com →</a>
    </div>
    <div class="card">
      <!-- see section 7 -->
    </div>
  </div>
</section>
```

`.knit-content` is a 2-column grid: `1.1fr 1fr` (text slightly wider than card).

Removed:
- `<div class="knittools-image" data-knittools-image data-parallax-wrap>` and the `<img src="/knittools-phone.png">` — no more phone image, no parallax
- The original `<dl class="info-table">` outside the card — info now lives inside the card
- The `<p class="eyebrow">Coming soon</p>` — replaced by the section label and card

Kept (unchanged behavior):
- The notify form. The `data-notify-form` attribute keeps the existing JS handler in `home-animations.ts` working as-is — validates input, replaces with `<span>You're in!</span>`, applies `is-complete` class. **Do not touch the form's JS behavior.** Only the styling changes (see `.notify` / `.notify input` / `.notify button` in mockup).
- The knittoolsapp.com external link.

The `<hr class="section-divider" data-section-line />` divider before this section stays.

## 7. Red card component (new)

The KnitTools "launch card" sits to the right of the text content. Square, deep editorial red, contains: title + info table + URL.

```html
<div class="card">
  <div class="card-mid">
    <h3 class="card-title">KnitTools</h3>
    <dl class="card-info">
      <div><dt>Status</dt><dd>Coming soon</dd></div>
      <div><dt>Platform</dt><dd>Android</dd></div>
      <div><dt>Languages</dt><dd>11</dd></div>
    </dl>
  </div>
  <div class="card-bottom">
    <a class="card-url" href="https://knittoolsapp.com">knittoolsapp.com</a>
  </div>
</div>
```

CSS values per mockup `.card` / `.card-mid` / `.card-title` / `.card-info` / `.card-bottom` / `.card-url`. Key specs to lock in:

- Background: `var(--red)`
- Color: `#FFF`
- Border-radius: 16px
- Aspect ratio: `1 / 1` (square)
- Padding: 1.75rem
- Layout: `display: grid; grid-template-rows: auto 1fr; gap: 2rem;` — title + info pinned to top, URL anchored to bottom via `align-self: end` on `.card-bottom`
- Card title: `var(--font-body-stack)`, `clamp(2rem, 4vw, 2.75rem)`, white, weight 400
- Card info: `<dl>` with row-flex children, white text on values (dd), white-muted (`rgba(255,255,255,0.72)`) on labels (dt), 1px white-faint (`rgba(255,255,255,0.22)`) borders top + between rows
- Card URL: `var(--font-sans-stack)`, 11px, white, weight 500, letter-spacing 0.05em

Responsive: at `<= 900px`, override aspect-ratio to `16 / 11` with `max-width: 26rem` so the card becomes a wide rectangle when stacked under the text content.

## 8. Footer (minor adjustments)

Markup is the existing footer, kept on both index and privacy pages. Two changes:

1. **Reduce the wordmark size.** Current `.footer-wordmark` is `clamp(1.75rem, 5vw, 4.25rem)` — this reads too large in the actual site. Reduce to roughly `clamp(1.25rem, 2.5vw, 1.75rem)`. Still uses `var(--font-logo-stack)` (First font).
2. The `.footer-tag` ("built to last") stays.

Index and privacy pages must use **identical** footer markup. The current privacy page has a divergent footer using `.footer-facts` and `.footer-links` (selectors that don't exist in CSS) — that goes away with this change.

## 9. Privacy page

Rewrite `src/pages/privacy.astro` to use the new shared header and footer. Body content stays minimal.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Privacy. Finnvek" description="Finnvek privacy policy.">
  <header class="topbar">
    <a href="/" class="topbar-logo" aria-label="Finnvek home">FINNVEK</a>
    <div class="topbar-meta">
      <div class="topbar-meta-line1">Independent Software</div>
      <div class="topbar-meta-line2">Turku, Finland.</div>
    </div>
  </header>
  <div class="prose">
    <h1>Privacy</h1>
    <p>Privacy policy coming with product launch.</p>
  </div>
  <footer class="site-footer">
    <!-- identical markup to index footer -->
  </footer>
</BaseLayout>
```

The existing `.prose` styles in `global.css` continue to apply.

## 10. Animations

Adapt `src/scripts/home-animations.ts`. Several effects target old DOM that no longer exists.

Remove:
- `setupMastheadReveal` — the `[data-hero-logo]` element no longer exists
- `setupParallax` — no `[data-parallax-wrap]` / phone image

Add:
- A simple top-bar + hero entrance: fade-in `.topbar` and slide-up `.hero-text` (gated by `prefers-reduced-motion: reduce`). Subtle, ~0.4–0.6s, on page load.

Adapt:
- `setupAboutReveal` — keep the SplitText word-by-word reveal pattern, but remove the about-image animation (no image now). Add `data-about-line` attributes to the new h2, paragraphs, and signature.
- `setupKnittoolsReveal` — keep the SplitText pattern for h2 and description. Replace the phone-image animation with a `.card` fade + small scale-in (`from { autoAlpha: 0, scale: 0.98 }`). Other `[data-knittools-line]` elements (form, link) keep the slide-up pattern.

Keep:
- `setupSectionLines` — divider scrub animation, unchanged
- `setupNotifyForm` — form swap-to-success animation, unchanged

The `prefers-reduced-motion: reduce` gate must continue to short-circuit every animation to its final visible state.

## 11. Asset cleanup

After implementing the above, these files in `public/` are no longer referenced by any source file. Safe to delete:

- `laptop.webp` — was the About image
- `knittools-phone.png` — was the KnitTools phone image
- `finnvek-about.webp` — already unreferenced
- `finnvek-logo.svg` — was only used by the old privacy.astro markup (the new privacy page uses the topbar wordmark instead)

Keep:
- `favicon.svg`, `apple-touch-icon.png`, `fonts/first.ttf`, `robots.txt`

## 12. Files to update

A summary checklist:

- [ ] `astro.config.mjs` — drop Boldonse, add Epilogue
- [ ] `src/layouts/BaseLayout.astro` — drop Boldonse preload, add Epilogue preload
- [ ] `src/pages/index.astro` — full restructure per sections 3–8 above
- [ ] `src/pages/privacy.astro` — replace markup per section 9
- [ ] `src/styles/global.css` — add red tokens, add `--font-sans-stack`, drop `--font-display-stack`, add new selectors for `.topbar`, `.hero`, `.about`, `.knit`, `.card` and their children, adjust `.footer-wordmark` size
- [ ] `src/scripts/home-animations.ts` — adapt animations per section 10
- [ ] Delete unreferenced assets per section 11

## 13. Out of scope (post-launch / future)

These intentionally stay out of this redesign:

- **Google Play badge.** Add at launch using the official badge from the Google Play badge generator. Suggested placement: top of the card, above the title (the card's grid-template-rows would shift to `auto auto 1fr` to make room). Add the legal attribution "Google Play is a trademark of Google Inc." somewhere — footer or a separate legal line. Optionally consider replacing the in-page notify form with the official "Pre-register on Google Play" badge if pre-registration is set up via Google Play Console.
- **Amazon Appstore.** Skip permanently. Amazon shut down its Android Appstore on August 20, 2025; it survives only on Amazon Fire devices, which is not Finnvek's target.
- **Social preview images** (`og:image`, `twitter:image`). Currently not emitted. Add separately if/when needed.
- **JSON-LD organization schema.** Currently not emitted. Add separately if/when needed.
- **Notify form persistence.** Currently the submitted email is not persisted anywhere. If you want emails saved (Buttondown, ConvertKit, custom endpoint), that's a separate task.
