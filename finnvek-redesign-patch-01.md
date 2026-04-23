# Finnvek.com — Blueprint Redesign, Patch 01

This patch **supplements** the main spec at `finnvek-redesign (01).md`. Apply this patch on top of (or instead of, where overridden) the main spec. All "Preserve — do not touch" rules from the main spec still apply.

The purpose of this patch is to restructure the content column into **two side-by-side sub-columns** so the page fits a typical desktop viewport without scrolling, give the waitlist CTA real visual weight, and correctly position the Finnvek descriptor in the top-right corner rather than using it as a page hero.

---

## Summary of changes

1. **Remove the hero tagline block** from inside the content column.
2. **Place "Independent software from Turku, Finland" in the top-right corner** of the sheet as a page-level descriptor, not a hero element.
3. **Remove the top rail** (coordinates + last updated).
4. **Split the content column into two sub-columns**: KnitTools (wider, left) + Notes/principles (narrower, right). Gap 64px.
5. **Simplify the KnitTools spec row** to `Android · 11 languages · Coming soon`.
6. **Turn "Join the waitlist" into a solid turquoise filled button** — the primary CTA on the page.
7. **Drop the `Last updated 2026.04` string** from the page entirely. Keep coordinates (see point 9).
8. **Keep these blueprint gestures**: vertical tick-bar scale next to the logo, `SCALE 1:1` label at the bottom of the margin, construction lines from the logo dots. **Remove** the `FIG. 001` label above the logo from the main spec — the margin should open without any label at the top, only the scale bar and the logo.
9. **Add the coordinates `60.4518° N · 22.2666° E`** into the footer row alongside the other contact info.

---

## 1. Top-right descriptor (replaces the hero tagline block)

In the existing site, "INDEPENDENT SOFTWARE FROM TURKU, FINLAND" is already fixed to the top-right corner. **Keep that behaviour.** The main spec incorrectly described moving it into the content column — that was wrong. Revert any plans to place it as a hero headline.

### Desktop styling

- Font: **Syne, weight 700**
- Font-size: `clamp(11px, 1.1vw, 14px)` — small, hillitty, not a headline
- Letter-spacing: 0.22em
- Text-transform: uppercase
- Colour: `var(--color-primary)` (dark ink on light paper — same colour as the other content, no turquoise accent)
- Position: top-right corner of the sheet, `position: absolute; top: 18px; right: 28px;` (matches sheet padding)
- Two lines allowed, right-aligned, line-height 1.5:
  ```
  INDEPENDENT SOFTWARE
  FROM TURKU, FINLAND
  ```

### Mobile (≤720px)

The descriptor stays top-right but reduces to a single line, font-size 9.5px, letter-spacing 0.16em. If the single line won't fit alongside the logo at the narrowest breakpoints, wrap to two lines as on desktop. Never center it, never stretch to full width.

---

## 2. Remove the top rail entirely

Delete the `.toprail` element from `src/pages/index.astro`. The pulsing turquoise dot, coordinates, and `LAST UPDATED` string all go. Coordinates relocate to the footer (see section 5). The `LAST UPDATED` string is dropped entirely.

Remove the associated CSS (`.toprail`, `.pulse` in the top-rail context) from `global.css`. **Keep the `@keyframes pulse` keyframe** in case it's reused elsewhere, but the top-rail consumer is gone.

---

## 3. Content column → two sub-columns

The content area inside the main layout grid (right of the drafting margin) splits into two sub-columns on desktop.

### Desktop grid

```css
.content {
  padding: 14vh 28px 8px;   /* generous top padding — content sits in the vertical middle of the viewport */
  display: grid;
  grid-template-columns: 1.35fr 1fr;  /* KnitTools wider, Notes narrower */
  column-gap: 64px;
  row-gap: 0;
  align-content: start;
  min-width: 0;
}

.content .col-product {
  display: grid;
  gap: 28px;
  min-width: 0;
}

.content .col-notes {
  display: grid;
  gap: 20px;
  min-width: 0;
}
```

**No vertical separator line between the columns.** The 64px gap is visual enough; an extra dashed or solid line would add noise. The construction lines from the logo already carry any blueprint-connective duty.

### Mobile (≤720px)

The grid collapses to a single column with vertical stacking. The product column appears first, notes column second:

```css
@media (max-width: 720px) {
  .content {
    grid-template-columns: 1fr;
    padding: 8vh 16px 8px;
    row-gap: 42px;
  }
}
```

### Column contents

**`.col-product` (left, wider):**

1. Section label `— 01 Catalog`
2. KnitTools title (`<h2 class="product-title">KnitTools</h2>`)
3. Description paragraph (kept at its full three-sentence length — do not shorten)
4. Simplified spec row (see section 4)
5. CTA row: Join-the-waitlist solid button + "Learn more → knittoolsapp.com" link (see section 6)

**`.col-notes` (right, narrower):**

1. Section label `— 02 Notes`
2. Principles ordered list (unchanged from main spec — 4 items, A-01 through A-04)

Both section labels (`— 01 Catalog` and `— 02 Notes`) sit on the **same horizontal line** at the top of their respective columns.

---

## 4. Simplify the KnitTools spec row

Replace the full four-part spec with a shorter three-part row:

```
Android · 11 languages · Coming soon
```

Styling unchanged from main spec (DM Mono, 11px, letter-spacing 0.14em, uppercase, muted pencil colour with bold values in ink). The `·` separators use `--color-dimmed`.

Drop:
- `Platform` label (redundant — "Android" is self-evident)
- `Status` label (redundant — "Coming soon" is self-evident)
- `Stores Google Play + Amazon` entirely (surface this on knittoolsapp.com, not here)

---

## 5. Footer restructure

The footer is now the single place where the "where and what" information lives. Layout: a single horizontal line, wraps on narrow screens, 1px top border (`--color-border-soft`), same typography as before.

**Contents, left to right:**

1. `Finnvek`
2. Separator dot
3. Coordinates: `60.4518° N · 22.2666° E`
4. Separator dot
5. `contact@finnvek.com` as email link
6. Separator dot
7. `Turku, Finland`

**No FV mark box in the footer.** The small black box with the Audiowide F·V is dropped — the vertical FINNVEK logo in the drafting margin already carries the brand mark, and a second one in the footer would be redundant. Plain text in a single row is cleaner.

Example markup:

```html
<footer class="foot reveal d7">
  <span>Finnvek</span>
  <span class="sep"></span>
  <span class="coords">60.4518° N · 22.2666° E</span>
  <span class="sep"></span>
  <a href="mailto:contact@finnvek.com">contact@finnvek.com</a>
  <span class="sep"></span>
  <span>Turku, Finland</span>
</footer>
```

Styling unchanged from the main spec (DM Mono 11px, letter-spacing 0.16em, uppercase, muted colour; separator dots 4px bullets in `--color-dimmed`; email link with dotted underline that turns solid on hover).

**Mobile:** items wrap naturally. If the wrap produces an awkward orphan, put the coordinates on their own line via a `flex-basis: 100%` helper on the coords span.

No `Last updated` string anywhere on the page.

---

## 6. Waitlist CTA — solid turquoise button

The waitlist form is the most important action on the page. Make it the visually strongest element in the KnitTools column.

### Structure

```html
<div class="cta">
  <form class="waitlist" id="waitlist" novalidate>
    <input
      type="email" id="email" name="email"
      placeholder="your.email@address"
      autocomplete="email" required
      aria-label="Email address">
    <button type="submit">
      <span id="btn-text">Join the waitlist</span>
      <span class="arrow" aria-hidden="true">→</span>
    </button>
  </form>
  <a class="learn" href="https://knittoolsapp.com" target="_blank" rel="noopener">
    Learn more <span class="arrow">→</span> knittoolsapp.com
  </a>
</div>
```

### Styling

```css
.cta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  margin-top: 12px;
}

.waitlist {
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 460px;
  border: 1px solid var(--color-primary);   /* ink outline around both input and button */
  background: var(--white);                  /* #fafaf7 paper-white fill behind input */
}

.waitlist input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--color-primary);
  padding: 14px 16px;
  outline: none;
  letter-spacing: 0.04em;
  min-width: 0;
}
.waitlist input::placeholder {
  color: var(--color-dimmed);
  letter-spacing: 0.08em;
}

.waitlist button {
  border: none;
  background: var(--color-accent);           /* solid turquoise */
  color: var(--white);                       /* paper-white text */
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  transition: background 0.15s ease;
}
.waitlist button:hover {
  background: var(--color-accent-hover);
}
.waitlist button .arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.waitlist button:hover .arrow {
  transform: translateX(3px);
}

/* Success state: keep the button turquoise, swap the text */
.waitlist.ok button {
  background: var(--color-primary);
  color: var(--white);
}

.learn {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 2px;
  transition: color 0.15s, border-color 0.15s;
}
.learn:hover {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}
.learn .arrow {
  color: var(--color-accent);
  margin: 0 4px;
}
```

### Layout notes

- **Waitlist form above, "Learn more" link below.** The waitlist is primary; the external link is a secondary alternative. Stacking them vertically (not inline side-by-side) keeps the button visually dominant and gives mobile a naturally working layout without a separate breakpoint rule.
- The waitlist form occupies up to 460px width on desktop, full column width on mobile.
- Keep existing `localStorage` persistence logic (`fv_waitlist_email` key). Success state changes the button to solid ink background with paper-white text and the message `You're on the list`.
- Invalid email: button text becomes `Check your email`, input gets focus, no other visual change.

---

## 7. Section label styling tweak

Both section labels (`— 01 Catalog` and `— 02 Notes`) are slightly beefier than before because they're now headers of their respective columns, not just inline markers on a long scroll.

```css
.slabel {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 8px;
}
.slabel .dash { color: var(--color-accent); font-size: 14px; }
.slabel .num  { color: var(--color-primary); font-weight: 500; }
```

Drop the `-28px` negative margin-bottom that was in the main spec — that was for a stacked-column layout. In the two-column layout each section label needs real space below it.

---

## 8. Construction lines — adjust bleed

The construction lines now need to span across **both** sub-columns, not just one. The previous left/right inset calculation still works, but verify the lines extend from just past the drafting margin boundary all the way to the right edge of the content area:

```css
.construction {
  position: absolute;
  pointer-events: none;
  z-index: 3;
  top: 0;
  left: calc(100px + 28px - 8px);   /* margin-w + sheet padding - small bleed */
  right: calc(28px - 8px);
  bottom: 0;
}
```

The lines should cross both the KnitTools column and the Notes column. This is intentional — the construction lines are now a visual device that ties the whole drawing together, not just "logo to content".

Top positions (19% for `e-line`, 64% for `f-line`) remain approximations. Fine-tune visually once the real layout renders against `LogoAnimated.astro`.

---

## 8b. Drafting margin — revised structure

**Override** the main spec's drafting margin layout (Section 2 of the main spec). The margin now contains only three elements, top to bottom:

1. **Scale tick bar** (vertical axis with animated tick marks) — starts at the top of the margin column
2. **FINNVEK logo** (vertical, unchanged) — fills the middle
3. **`SCALE 1:1` label** — sits at the bottom

**Remove** the `FIG. 001` label from the top of the margin. The margin opens directly with the tick bar.

Updated grid:

```css
.margin {
  padding: 6px 0 14px;
  display: grid;
  grid-template-rows: auto 1fr auto;   /* ticks / logo / scale label */
  gap: 14px;
  border-right: 1px solid var(--color-border-soft);
}
```

The scale tick bar and `SCALE 1:1` label retain their styling from the main spec. The tick animation (scaleX 0→1, 180ms duration, 50ms stagger) continues to run on page load. Mobile still hides the scale bar entirely (`display: none`).

---

## 9. Reveal timing updates

The reveal sequence adjusts because the hero block is gone and content appears in two columns at once.

| Time | Event |
|------|-------|
| 0.1s | Top-right descriptor fades in (replaces old top rail) |
| 0.0s – 0.8s | Scale-bar ticks animate in (unchanged) |
| 0.3s – 1.5s | Logo letters drop (unchanged — F, I, N, N, V, E, K) |
| 2.0s | F dot drops + squish (unchanged) |
| 2.3s | E dot drops + squish (unchanged) |
| 2.55s | `e-line` construction line draws across |
| 2.85s | `f-line` construction line draws across |
| 3.1s | **Both** column headers (`— 01 Catalog`, `— 02 Notes`) reveal simultaneously |
| 3.2s | KnitTools title + description reveal |
| 3.3s | Principles list reveals |
| 3.4s | KnitTools spec row reveals |
| 3.5s | CTA (waitlist button + learn-more link) reveals |
| 3.7s | Footer reveals |

The two columns reveal in a slightly interleaved sequence (column headers together, then each column flows its own contents) so the eye sees the structure instantly but the detail fills in gradually.

---

## 10. What to remove from the earlier spec's plan

These items from the main spec are now **not applicable** and should be skipped:

- Hero block with big multi-line tagline inside the content column (Section 3a of main spec). **Skip entirely.**
- Top rail with coordinates + pulsing dot + last updated (Section 1 of main spec). **Skip entirely.** Coordinates relocate to footer per this patch.
- `FIG. 001` label above the logo in the drafting margin (Section 2 of main spec). **Skip entirely.** See section 8b of this patch for the corrected margin structure.
- FV mark box in the footer (Section 5 of main spec). **Skip entirely.** The footer is plain text only.
- "Turquoise accent on Finland word" decision from the main spec's Open Questions. **No turquoise accent** — the descriptor is Finnvek's identification, not a marketing tagline, and stays in a uniform ink colour.
- Solid-dark waitlist button background described in the main spec (`.wait button { background: var(--ink); ... }`). **Override** with the turquoise filled style from section 6 of this patch.

---

## 11. Files touched by this patch

Beyond what the main spec already lists:

- `src/pages/index.astro` — remove `.toprail` markup, add top-right descriptor element, restructure content into two sub-columns
- `src/components/Hero.astro` — remove any hero tagline logic; the top-right descriptor is a small element better placed directly in `index.astro` than in a dedicated component. Consider removing `Hero.astro` entirely if the vertical logo is its only remaining responsibility and can be rendered inline, or keep it minimal (vertical logo only).
- `src/components/ProjectCard.astro` — adjust to fit narrower (but still dominant) column; waitlist button becomes solid turquoise
- `src/styles/global.css` — all styling adjustments above

---

## 12. Visual priority order (verify after build)

After the build, check that the eye naturally travels in this order when landing on the page:

1. **FINNVEK logo** (left margin, largest element on the page)
2. **KnitTools title** (Teko, biggest type in the content area)
3. **Join the waitlist button** (solid turquoise — the only high-saturation fill in the content area besides the logo dots)
4. KnitTools description
5. Principles list
6. Footer

If any of these is drowned out by noise or pulled out of this priority order, the layout has failed its goal and should be revisited.
