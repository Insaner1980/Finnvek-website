# Finnvek UI Specification

Code-backed UI contract for `/home/emma/dev/Finnvek-website/finnvek-site`. Every value below is read directly from the current source — no aspirational specs, no leftovers from old plans.

Last verified: 2026-04-27.

Source files this spec describes:

- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/privacy.astro`
- `src/styles/global.css`
- `src/scripts/home-animations.ts`
- `astro.config.mjs`

---

## 1. Design Tokens

All tokens are CSS custom properties on `:root` in `src/styles/global.css`.

### 1.1 Colors

| Token | Value | Used for |
| --- | --- | --- |
| `--color-bg` | `#08080A` | `html`/`body` background, also exposed as `theme-color` meta |
| `--color-surface-footer` | `#0C0C0C` | `.site-footer` background |
| `--color-text` | `#F0F0EC` | Body text, headings, wordmark fill, button hover background |
| `--color-text-muted` | `#9A9A95` | Tagline, eyebrow, dt labels, signature, footer meta |
| `--color-text-dimmed` | `#5F5F5A` | Secondary tagline (`from Turku, Finland.`), prose |
| `--color-border` | `#2A2A2A` | `.section-divider`, `.info-row`, `.notify-form`, `.link-primary` |
| `--color-border-faint` | `#1A1A1A` | Declared but currently unused in any selector |

There is **no accent color**. Earlier turquoise (`#24D4C2`) is gone.

### 1.2 Layout

| Token | Value |
| --- | --- |
| `--container-wide` | `1180px` |
| `--container-prose` | `720px` |
| `--gutter` | `2.5rem` (collapses to `1.25rem` at `<= 640px`) |

### 1.3 Typography stacks

| Token | Value | Notes |
| --- | --- | --- |
| `--font-display-stack` | `var(--font-display), 'Boldonse', sans-serif` | **Currently unreferenced by any selector.** Boldonse is configured in `astro.config.mjs` and preloaded but never applied. |
| `--font-body-stack` | `var(--font-body), Newsreader, Georgia, serif` | The default body face. Used everywhere a font is set. |
| `--font-logo-stack` | `'First', system-ui, sans-serif` | Used by `.wordmark text` (SVG) and `.footer-wordmark`. |

### 1.4 Faces

```css
@font-face {
  font-family: 'First';
  src: url('/fonts/first.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Configured in `astro.config.mjs`:

- `Boldonse` — `--font-display`, weights `[400]`, `['normal']`
- `Newsreader` — `--font-body`, weights `'400 700'` (variable range), `['normal', 'italic']`

`BaseLayout.astro` issues:

- `<Font cssVariable="--font-display" preload />`
- `<Font cssVariable="--font-body" preload />`
- `<link rel="preload" href="/fonts/first.ttf" as="font" type="font/ttf" crossorigin />`

### 1.5 Global element defaults

```css
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: var(--color-bg);
}
body {
  overflow-x: clip;
  font-family: var(--font-body-stack);
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
p { line-height: 1.5; }
a { color: var(--color-text); text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
*, *::before, *::after { box-sizing: border-box; }
```

`.visually-hidden` follows the standard accessibility pattern (1×1 absolutely positioned, `clip: rect(0,0,0,0)`).

---

## 2. Page Anatomy — Index (`/`)

Top-down structure of `src/pages/index.astro`:

```
<BaseLayout>
  <header class="masthead">
    <svg class="wordmark" data-hero-logo viewBox="0 28 1000 150" preserveAspectRatio="xMidYMid meet">
      <text x="507" y="170" text-anchor="middle" textLength="1000" lengthAdjust="spacingAndGlyphs">FINNVEK</text>
    </svg>
    <div class="masthead-tagline">
      <span class="tagline-primary">Independent software</span>
      <span class="tagline-secondary">from Turku, Finland.</span>
    </div>
  </header>

  <section class="about" data-about>
    <div class="about-content">
      <h2 class="section-heading" data-about-line>About</h2>
      <p data-about-line>...</p>           (4 paragraphs total)
      <div class="signature" data-about-line>— Emma</div>
    </div>
    <div class="about-image" data-about-line>
      <img src="/laptop.webp" width="448" height="557" loading="lazy" />
    </div>
  </section>

  <hr class="section-divider" data-section-line />

  <section class="knittools" data-knittools>
    <div class="knittools-image" data-knittools-image data-parallax-wrap>
      <img src="/knittools-phone.png" width="862" height="1825" loading="lazy" />
    </div>
    <div class="knittools-content">
      <p class="eyebrow" data-knittools-line>Coming soon</p>
      <h2 class="section-heading" data-knittools-line>KnitTools</h2>
      <p class="knittools-description" data-knittools-line>...</p>
      <dl class="info-table" data-knittools-line>
        <div class="info-row"><dt>Status</dt><dd>Coming soon</dd></div>
        <div class="info-row"><dt>Platform</dt><dd>Android</dd></div>
        <div class="info-row"><dt>Languages</dt><dd>11</dd></div>
      </dl>
      <form class="notify-form" data-notify-form data-knittools-line>
        <label class="visually-hidden" for="notify-email">Email address</label>
        <input id="notify-email" name="email" type="email" placeholder="email address" autocomplete="email" required />
        <button type="submit">Notify me at launch</button>
      </form>
      <a href="https://knittoolsapp.com" class="link-primary" data-knittools-line>knittoolsapp.com →</a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-wordmark">FINNVEK</div>
        <div class="footer-tagline">built to last</div>
      </div>
      <div class="footer-meta">
        <a href="mailto:contact@finnvek.com">contact@finnvek.com</a>
        <span>© 2026</span>
        <a href="/privacy">Privacy</a>
      </div>
    </div>
  </footer>
</BaseLayout>
```

The page imports `../scripts/home-animations` via a `<script>` block at the bottom.

### 2.1 Copy strings (verbatim, locked into source)

- About §1: `Finnvek is independent software from Turku, Finland. I'm one developer, working on my own projects.`
- About §2: `It exists because some ideas were worth following, and I had the freedom to follow them. The kind of ideas that stay interesting for years, not weeks. The kind I care about enough to build carefully, without shortcuts or rushed releases.`
- About §3: `Every product is its own thing. No ads, no tracking. Made to work well, and to keep working for a long time.`
- About §4: `The first one is KnitTools. More are on the way.`
- Signature: `— Emma`
- KnitTools description: `KnitTools is a pocket companion for knitters. It counts your rows, reads your patterns, and keeps your stash quietly in order, with voice and AI that speaks knitter. In eleven languages, for Android.`
- Notify button: `Notify me at launch`
- Notify success: `You're in!`
- Footer tagline: `built to last`

### 2.2 Image alt text

- Laptop: `A dark workspace: laptop, coffee mug, and open notebook with a pencil.`
- Phone: `KnitTools app on a phone`

---

## 3. Page Anatomy — Privacy (`/privacy/`)

```
<BaseLayout title="Privacy. Finnvek" description="Finnvek privacy policy.">
  <header class="site-header">
    <a href="/" class="logo" aria-label="Finnvek home">
      <img src="/finnvek-logo.svg" alt="Finnvek" width="140" height="18" />
    </a>
  </header>
  <div class="page">
    <section class="prose">
      <h1>Privacy</h1>
      <p>Privacy policy coming with product launch.</p>
    </section>
  </div>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">Finnvek</div>
      <div class="footer-meta">
        <div class="footer-facts"><span>Turku, Finland</span><span>2026</span></div>
        <div class="footer-links"><a href="mailto:contact@finnvek.com">contact@finnvek.com</a><a href="/privacy">Privacy</a></div>
      </div>
    </div>
  </footer>
</BaseLayout>
```

**Known unstyled selectors on this page** (no rules in `global.css`):

- `.site-header`, `.logo`
- `.page`
- `.footer-facts`, `.footer-links`

The page does **not** import `home-animations`.

---

## 4. Component Specs

Every numeric value is verbatim from `src/styles/global.css`.

### 4.1 Masthead

```
.masthead              { width:100%; padding:0; margin:0; position:relative; text-align:center;
                         --wordmark-gutter: clamp(0.75rem, 1.5vw, 1.5rem); }

.wordmark              { display:block;
                         width: calc(100% - 2 * var(--wordmark-gutter));
                         height:auto; margin:0 auto; padding:0;
                         position:relative; z-index:2;
                         fill: var(--color-text); }
.wordmark text         { font-family: var(--font-logo-stack);
                         font-weight: 400;
                         font-size: 200px;
                         fill: var(--color-text); }
```

The SVG is `viewBox="0 28 1000 150"` with `<text x="507" y="170" textLength="1000" lengthAdjust="spacingAndGlyphs">` so the word stretches to the full inner width. The visible wordmark therefore scales fluidly with the viewport, gutter `clamp(0.75rem, 1.5vw, 1.5rem)` on each side.

```
.masthead-tagline      { font-family: var(--font-body-stack);
                         font-weight: 500;
                         text-transform: uppercase;
                         color: var(--color-text-muted);
                         text-align:center; margin:0 auto;
                         position:relative; z-index:1;
                         line-height: 1.1; }

.tagline-primary,
.tagline-secondary     { display:block; white-space:nowrap; }

.tagline-primary       { font-size: clamp(2.5rem, 4vw, 4.5rem);
                         letter-spacing: 0.18em;
                         margin-top: -0.55em;          /* overlaps bottom of wordmark */ }

.tagline-secondary     { font-size: clamp(0.95rem, 1.25vw, 1.4rem);
                         letter-spacing: 0.22em;
                         margin-top: 0.6em;
                         color: var(--color-text-dimmed); }
```

At `<= 640px` the tagline drops to `font-size: 0.7rem` with letter-spacing `0.18em` (both lines, single rule on `.masthead-tagline`).

### 4.2 Section grids (About / KnitTools)

```
.about, .knittools     { max-width: var(--container-wide);     /* 1180px */
                         margin: 0 auto;
                         padding: 0 var(--gutter);
                         display: grid;
                         gap: clamp(2.5rem, 6vw, 5rem);
                         align-items: start; }

.about                 { margin-top: clamp(8rem, 16vw, 14rem);
                         grid-template-columns: minmax(0,1fr) minmax(0,1fr); }

.knittools             { margin-top: clamp(4rem, 8vw, 7rem);
                         grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
```

At `<= 900px` both collapse to `grid-template-columns: 1fr; gap: 2.5rem;`.

### 4.3 About sub-elements

```
.about-content         { max-width: 36rem; }
.about-image           { justify-self: end; width:100%; max-width: 28rem; overflow:hidden; }
.about-image img       { width:100%; height:auto; display:block; }

.about p, .knittools-description
                       { font-size: 1.0625rem; line-height: 1.6;
                         color: var(--color-text);
                         margin: 0 0 1.25rem 0; }
.about p:last-of-type  { margin-bottom: 0; }

.signature             { margin-top: 2.5rem;
                         font-family: var(--font-body-stack);
                         font-style: italic;
                         font-size: 0.95rem;
                         color: var(--color-text-muted); }
```

At `<= 900px`, `.about-image` and `.knittools-image` switch to `justify-self: start` with `max-width: 24rem`.

### 4.4 Section heading

```
.section-heading       { font-family: var(--font-body-stack);
                         font-weight: 700;
                         font-size: clamp(2.5rem, 7vw, 6.5rem);   /* ~⅓ wordmark scale */
                         line-height: 1;
                         letter-spacing: -0.02em;
                         color: var(--color-text);
                         margin: 0 0 clamp(1.5rem, 3vw, 2.5rem) 0; }
```

At `<= 640px`: `font-size: clamp(2rem, 9vw, 3rem)`.

### 4.5 Section divider

```
.section-divider       { border:0;
                         height: 1px;
                         background-color: var(--color-border);
                         max-width: var(--container-wide);
                         margin: clamp(6rem, 12vw, 10rem) auto 0;
                         width: calc(100% - 2 * var(--gutter));
                         transform-origin: left center; }
```

The divider's `scaleX` is animated by `setupSectionLines` (see §5.3).

### 4.6 KnitTools sub-elements

```
.knittools-image       { justify-self: start; width:100%; max-width: 22rem; }
.knittools-image img   { width:100%; height:auto; max-width: 280px; }
.knittools-content     { max-width: 36rem; }

.eyebrow               { font-family: var(--font-body-stack);
                         font-weight: 500;
                         font-size: 0.75rem;
                         letter-spacing: 0.22em;
                         text-transform: uppercase;
                         color: var(--color-text-muted);
                         margin: 0 0 1.25rem 0; }

.knittools-description { margin: 0 0 2rem 0; max-width: 36rem; }
```

### 4.7 Info table

```
.info-table            { margin: 0 0 2.25rem 0; padding: 0;
                         border-top: 1px solid var(--color-border); }
.info-row              { display: grid;
                         grid-template-columns: 1fr auto;
                         gap: 1.5rem;
                         align-items: baseline;
                         padding: 0.85rem 0;
                         border-bottom: 1px solid var(--color-border); }
.info-row dt, .info-row dd
                       { margin: 0;
                         font-family: var(--font-body-stack);
                         font-size: 0.9375rem;
                         line-height: 1.4; }
.info-row dt           { color: var(--color-text-muted); font-weight: 400; }
.info-row dd           { color: var(--color-text);       font-weight: 500; text-align: right; }
```

At `<= 640px`: `.info-row { grid-template-columns: 1fr 1fr; }`.

### 4.8 Notify form

```
.notify-form           { display: grid;
                         grid-template-columns: minmax(0,1fr) auto;
                         width: 100%;
                         max-width: 30rem;
                         margin: 0 0 1.75rem 0;
                         border: 1px solid var(--color-border); }

.notify-form input,
.notify-form button    { min-width: 0;
                         height: 2.75rem;
                         font: inherit;
                         font-family: var(--font-body-stack);
                         font-size: 0.9375rem;
                         background: transparent;
                         color: var(--color-text);
                         border: 0; margin: 0; }

.notify-form input             { width:100%; padding: 0 1rem;
                                 border-right: 1px solid var(--color-border); }
.notify-form input::placeholder { color: var(--color-text-muted); }
.notify-form input:focus        { outline: 1px solid var(--color-text); outline-offset: -1px; }

.notify-form button            { padding: 0 1.25rem;
                                 cursor: pointer;
                                 white-space: nowrap;
                                 color: var(--color-text);
                                 transition: background-color 150ms ease, color 150ms ease; }
.notify-form button:hover,
.notify-form button:focus-visible
                               { background-color: var(--color-text);
                                 color: var(--color-bg);
                                 outline: none; }

.notify-form.is-complete       { display: block; padding: 0; border: 0;
                                 font-family: var(--font-body-stack);
                                 font-size: 0.9375rem;
                                 color: var(--color-text); }
```

At `<= 640px`: `grid-template-columns: 1fr;`, and the input gets `border-right: 0; border-bottom: 1px solid var(--color-border);` instead.

### 4.9 Primary link

```
.link-primary          { display: inline-block;
                         font-family: var(--font-body-stack);
                         font-size: 0.9375rem;
                         font-weight: 500;
                         color: var(--color-text);
                         text-decoration: none;
                         border-bottom: 1px solid var(--color-border);
                         padding-bottom: 2px;
                         transition: border-color 150ms ease; }
.link-primary:hover,
.link-primary:focus-visible
                       { border-bottom-color: var(--color-text); outline: none; }
```

### 4.10 Footer

```
.site-footer           { margin-top: clamp(8rem, 16vw, 14rem);
                         padding: clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem);
                         background-color: var(--color-surface-footer); }

.footer-inner          { max-width: var(--container-wide);
                         margin: 0 auto;
                         padding: 0 var(--gutter);
                         display: flex;
                         justify-content: space-between;
                         align-items: flex-end;
                         gap: 2rem; }

.footer-brand          { display: flex; flex-direction: column;
                         align-items: flex-start; gap: 0.5rem; }

.footer-wordmark       { font-family: var(--font-logo-stack);
                         font-size: clamp(1.75rem, 5vw, 4.25rem);
                         line-height: 0.82;
                         color: var(--color-text);
                         letter-spacing: -0.005em; }

.footer-tagline        { font-family: var(--font-body-stack);
                         font-style: normal;
                         font-size: 0.875rem;
                         color: var(--color-text-muted);
                         text-transform: lowercase;
                         letter-spacing: 0.02em; }

.footer-meta           { display: flex; flex-direction: column;
                         align-items: flex-end; gap: 0.4rem;
                         font-family: var(--font-body-stack);
                         font-size: 0.9375rem;
                         color: var(--color-text-muted);
                         text-align: right; }
.footer-meta a         { color: var(--color-text-muted);
                         transition: color 150ms ease; }
.footer-meta a:hover,
.footer-meta a:focus-visible
                       { color: var(--color-text); outline: none; }
```

At `<= 640px`: `.footer-inner` becomes a vertical column; `.footer-meta` left-aligns.

### 4.11 Prose (Privacy)

```
.prose                 { max-width: var(--container-prose);   /* 720px */
                         margin: clamp(6rem, 12vw, 10rem) auto 0;
                         padding: 0 var(--gutter);
                         color: var(--color-text-muted);
                         font-size: 1rem; line-height: 1.6; }
.prose h1              { font-family: var(--font-body-stack);
                         font-weight: 700;
                         font-size: 2rem;
                         color: var(--color-text);
                         margin: 0 0 1.5rem 0;
                         letter-spacing: -0.01em; }
.prose a               { color: var(--color-text);
                         border-bottom: 1px solid var(--color-border); }
```

---

## 5. Motion Spec

All in `src/scripts/home-animations.ts`. Plugins registered: `gsap`, `ScrollTrigger`, `SplitText`.

Global gate:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

When `prefersReducedMotion` is `true`, every animation skips and just sets the final visible state.

### 5.1 Notify form (`setupNotifyForm`)

- Trigger: `submit` on `[data-notify-form]`
- `event.preventDefault()` and `notifyForm.reportValidity()` gate
- Replacement DOM: `<span>You're in!</span>`, plus class `is-complete` on the form
- Reduced motion: replacement is applied immediately
- Otherwise:
  ```ts
  gsap.timeline()
    .to(controls, { autoAlpha: 0, y: -6, duration: 0.16, stagger: 0.03, ease: 'power1.out' })
    .add(complete)
    .fromTo(notifyForm, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' });
  ```

### 5.2 Masthead reveal (`setupMastheadReveal`)

- Initial: `wordmark { autoAlpha: 0, y: -12 }`, `tagline { autoAlpha: 0, y: 8 }`
- Timeline: `defaults: { ease: 'power3.out' }, delay: 0.15`
  - `wordmark -> { autoAlpha:1, y:0, duration:0.9 }`
  - `tagline -> { autoAlpha:1, y:0, duration:0.5 }` at offset `-=0.4`

### 5.3 Section dividers (`setupSectionLines`)

For each `[data-section-line]`:

- Initial: `scaleX: 0`
- ScrollTrigger range: `start: 'top bottom'`, `end: 'top 40%'`
- On update, `scaleX` is set to `max(prevMax, self.progress)` so the line never shrinks back if the user scrolls up.

### 5.4 About reveal (`setupAboutReveal`)

- Once-fired ScrollTrigger: `trigger: aboutSection`, `start: 'top 80%'`, `once: true`
- SplitText splits each `h2[data-about-line], p[data-about-line], .signature[data-about-line]` into words (class `split-word`)
- Initial:
  - words: `{ autoAlpha: 0, y: 12, filter: 'blur(8px)' }`
  - `.about-image`: `{ autoAlpha: 0, y: 18, scale: 0.98 }`
- Timeline:
  - words `-> { autoAlpha:1, y:0, filter:'blur(0px)', duration:0.7, ease:'power2.out', stagger:0.015 }`
  - image at offset `0.15` `-> { autoAlpha:1, y:0, scale:1, duration:0.9, ease:'power2.out' }`

### 5.5 KnitTools reveal (`setupKnittoolsReveal`)

- Once-fired ScrollTrigger: `trigger: knittoolsSection`, `start: 'top 75%'`, `once: true`
- SplitText splits `eyebrow[data-knittools-line], h2[data-knittools-line], p[data-knittools-line]`
- "Other" lines = `[data-knittools-line]` not matching `.eyebrow, h2, p` (i.e. info-table, notify form, link)
- Initial:
  - words: `{ autoAlpha:0, y:12, filter:'blur(8px)' }`
  - other lines: `{ autoAlpha:0, y:16 }`
  - phone image: `{ autoAlpha:0, scale:0.96, transformOrigin:'center center' }`
- Timeline:
  - image `at 0 -> { autoAlpha:1, scale:1, duration:0.9, ease:'power2.out' }`
  - words `at 0.1 -> { autoAlpha:1, y:0, filter:'blur(0px)', duration:0.7, ease:'power2.out', stagger:0.014 }`
  - other lines `at -=0.3 -> { autoAlpha:1, y:0, duration:0.6, ease:'power2.out', stagger:0.06 }`

### 5.6 Parallax (`setupParallax`)

- Gated to `(min-width: 901px)` via `gsap.matchMedia()`
- Target: the `<img>` inside `[data-parallax-wrap]` (the KnitTools phone)
- Tween: `y: -18, ease: 'none'`
- ScrollTrigger: `start: 'top bottom'`, `end: 'bottom top'`, `scrub: 0.8`

---

## 6. Responsive Breakpoints

Two breakpoints in CSS, plus one motion breakpoint:

| Breakpoint | Source | Effect |
| --- | --- | --- |
| `(max-width: 900px)` | CSS media query | About + KnitTools collapse to 1 column, gap 2.5rem; both image columns left-align with `max-width: 24rem`. |
| `(min-width: 901px)` | `gsap.matchMedia()` | Phone parallax tween enabled. |
| `(max-width: 640px)` | CSS media query | `--gutter` -> `1.25rem`; tagline shrinks to 0.7rem; `.about` margin-top -> 5rem; `.section-heading` -> `clamp(2rem, 9vw, 3rem)`; footer becomes vertical, left-aligned; info-row becomes `1fr 1fr`; notify-form becomes 1 column with input bottom-border. |

There is no `768px` breakpoint anymore — the previous tablet rule has been replaced by `900px`.

---

## 7. Accessibility & Semantics

- HTML `lang="en"`, `meta viewport "width=device-width, initial-scale=1"`.
- `.visually-hidden` is the standard SR-only utility; only the email label uses it.
- Focus styles:
  - `.notify-form input:focus { outline: 1px solid var(--color-text); outline-offset: -1px; }`
  - `.notify-form button:focus-visible` mirrors hover (inverted colors).
  - `.link-primary:focus-visible` mirrors hover (border-bottom emphasizes).
  - `.footer-meta a:focus-visible` mirrors hover (color brightens).
- Form: `<label class="visually-hidden">`, `type="email"`, `required`, `autocomplete="email"`, `placeholder="email address"`.
- The wordmark SVG carries `role="img"`, `aria-label="Finnvek"`, `<title>Finnvek</title>`.
- The privacy logo image uses `alt="Finnvek"` and the wrapping `<a>` uses `aria-label="Finnvek home"`.
- All content images have non-empty `alt`.
- All `<img>` carry explicit `width`/`height`; off-fold images use `loading="lazy"`.
- `prefers-reduced-motion: reduce` disables all GSAP timelines and parallax — no scroll-triggered movement remains in that mode.

---

## 8. SEO & Head

From `BaseLayout.astro`:

- Default `<title>`: `Finnvek. Software that's built to last.`
- Default `<meta name="description">`: `Independent software from Turku, Finland. One developer, building products with care. First app: KnitTools, coming soon.`
- `<meta name="theme-color" content="#08080A" />`
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
- `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`
- `<link rel="canonical" href={canonical} />` built from `Astro.url.pathname` and `Astro.site` (`https://finnvek.com`).
- Open Graph: `og:type="website"`, `og:title`, `og:description`, `og:url`. **No `og:image`.**
- Twitter: `twitter:card="summary"`, `twitter:title`, `twitter:description`. **No `twitter:image`.**
- Privacy overrides: `title="Privacy. Finnvek"`, `description="Finnvek privacy policy."`.
- No JSON-LD is emitted.

`public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://finnvek.com/sitemap-index.xml
```

Sitemap is generated by `@astrojs/sitemap` at build time.

---

## 9. Asset Manifest

| Path | Used by | Notes |
| --- | --- | --- |
| `public/favicon.svg` | BaseLayout | favicon |
| `public/apple-touch-icon.png` | BaseLayout | 180×180 |
| `public/finnvek-logo.svg` | privacy.astro | Only the privacy page links to this asset. |
| `public/knittools-phone.png` | index.astro | 862×1825 |
| `public/laptop.webp` | index.astro | 448×557 |
| `public/finnvek-about.webp` | (none) | **Currently unreferenced** in any source file. |
| `public/fonts/first.ttf` | global.css `@font-face` + BaseLayout preload | Local logo font. |
| `public/robots.txt` | static | listed above |

No `og-image.png` exists in `public/`; nothing in source references one either.

---

## 10. Known UI Mismatches

(Same list lives in `PROJECT.md` §"Current Mismatches"; repeated here in UI terms.)

1. **Boldonse is preloaded but never rendered.** No selector references `--font-display` or `--font-display-stack`. Either apply it (display headings, eyebrows) or drop it from `astro.config.mjs` and `BaseLayout`.
2. **Privacy page uses unstyled selectors** (`.site-header`, `.logo`, `.page`, `.footer-facts`, `.footer-links`) and a plain-text `.footer-brand` div instead of the index page's wordmark + tagline. The two pages should share footer markup or both gain matching styles.
3. **`finnvek-about.webp` is in `public/` but unreferenced**; the about section uses `/laptop.webp`. Decide which is canonical and drop the other.
4. **No social preview image.** OG and Twitter meta omit `og:image`/`twitter:image`. Twitter card is `summary` (text-only), not `summary_large_image`.
5. **`--color-border-faint` is declared but unused.**
