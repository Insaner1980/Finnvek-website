# Finnvek.com — Redesign Work In Progress

Status snapshot when pausing. Main structural redesign (blueprint-paper → notebook-on-desk) is in place. Text, fonts, and animations are mostly finalized. The **notebook visual** is the big open item.

---

## Open — top priority

### 1. Replace CSS notebook pad with AI-generated image

**Current state:** the notebook pad (`.pad` element) uses CSS + SVG to draw:
- Cream paper background
- Grid lines (24px + 120px multi-layer grid)
- Box-shadow for paper lift
- Small wire-o spiral ring SVGs along the top (via `<svg><use href="#wire-ring"/></svg>` — defined in `BaseLayout.astro`)

None of it looks convincingly 3D. Plan is to replace with a **Nano Banana** (or any AI image gen) rendered image of a real-looking empty spiral-bound notepad, and overlay the HTML content on top.

**Prompt to use (already crafted, copy into Nano Banana):**

```
Photorealistic product photograph of a blank A6 portrait spiral-bound memo pad, top-wire binding, shown from a slight 8 to 10 degree rotation to the right so the stacked paper edges are visible on the right side of the pad, revealing roughly 40 to 50 layered sheets with natural depth and a subtle edge shadow. The pad has clear physical thickness and looks like a real tangible notepad.

The top binding is a bright polished silver-chrome metal wire-o spiral running horizontally across the top edge of the pad. It consists of 26 to 30 tight, evenly-spaced metallic loops. Each loop is a clearly 3D arched ring of polished silver wire with visible highlights on the upper curve and soft shadows on the underside — the metal is clean, modern, reflective, no tarnish or patina. The wire enters small round holes punched in the top of the paper, so each ring looks like it's physically bound through the paper. The binding should look premium, like a high-quality stationery product.

The paper is a warm cream-white color, approximately #f3f3ee (a soft off-white with a slight warm tint, like drafting or architectural paper). The paper surface is covered with a very faint graph grid pattern: small light-gray squares, each approximately 6 millimeters per side, subtly printed across the entire paper surface. The grid should be noticeable but muted, not dominant. The paper has a very slight natural texture suggesting real paper fiber.

CRITICAL: the paper is COMPLETELY BLANK. No text, no letters, no words, no headings, no handwriting, no logos, no printed content of any kind, no horizontal ruled lines. Only the faint subtle grid pattern. Empty memo pad ready for writing.

The pad sits on a fully transparent background (checkered transparency, no desk, no surface, no backdrop of any color). A soft natural drop shadow is cast below and slightly to the right of the pad, indicating warm overhead-left lighting.

Lighting: soft, diffused studio lighting from upper left, creating clean gentle highlights on the silver wire binding, a slight sheen on the paper surface, and natural shadows along the right-side paper-stack edge. No harsh highlights.

Style: clean minimal commercial product photography, photorealistic, crisp focus throughout, professional stationery-catalog quality. The pad is the only subject in the frame, centered.

Output: PNG format, transparent background, high resolution (at least 1600 pixels on the long side), portrait orientation aspect ratio approximately 3:4 (height to width).
```

**Steps after the image is generated:**

1. Save as `public/notebook.png` (or `.webp` for smaller size)
2. In `src/styles/global.css`:
   - Remove the current `.pad` paper background (`background-color`, `background-image` grid lines, `box-shadow`, `border`)
   - Add `.pad { background-image: url('/notebook.png'); background-size: 100% 100%; background-repeat: no-repeat; }`
   - Adjust `.pad` `padding-top` to push content below the image's binding area (likely around 110–140px depending on image)
   - Decide if `aspect-ratio: 3 / 4` should replace `min-height: 680px`
3. In `src/pages/index.astro`:
   - Remove the `<div class="rings">…</div>` block (the SVG rings are no longer needed — binding is baked into the image)
4. In `src/layouts/BaseLayout.astro`:
   - Can remove the `<linearGradient id="wire-grad">` and `<symbol id="wire-ring">` SVG defs (no longer referenced)
   - Keep the `#cline-wobble` filter in case it's reused elsewhere — or remove if nothing else uses it
5. Remove `.rings` and `.ring` CSS rules from `global.css`
6. Also remove the `.pad-stack` wrapper since rings are gone — restructure DOM to just `<article class="pad">`
7. Test: on the live page, the content should overlay cleanly inside the image's paper area without touching the binding

**If Nano Banana's first attempt isn't right:**
- Grid too strong → "make the grid more subtle" or "remove the grid, I'll add it separately via CSS"
- Rings not tight enough → "more rings, closer together, 30 loops"
- Text accidentally appears → "the paper must be completely blank, no text anywhere"
- Perspective too extreme → "reduce the rotation to 5 degrees, mostly front-facing"

---

## Open — medium priority

### 2. Desk background color

`--bg-desk: #cec9be` is the current placeholder (warm neutral). **Not yet decided.**

Options to try:
- Keep current warm greige
- Slightly cooler: `#c8c6bf` (more neutral)
- Warmer wood-ish: `#c4b8a3` (mid-tan)
- Darker/more dramatic: `#8c8577` (closer to a real drafting-table surface)
- Texture: could add a faint SVG noise texture or subtle linen pattern to `body::before`

Pick once the notebook image is in place — colors interact, and the desk needs to complement the notebook's warm paper.

### 3. Sticker (principles note) appearance

Current implementation: clip-path torn top edge, faint mini-grid, tilted -0.6deg, white paper.

Could be improved:
- AI-generated image for the sticker too (would match the notebook's realism)
- Or refine the CSS: softer torn edge, better shadow, maybe pin/tape decoration
- Position could be fine-tuned once the pad is replaced with an image

Low urgency — it currently looks acceptable. Revisit after the pad image is in.

### 4. Sticker vertical position

Currently pulled up with `margin-top: -320px` to sit alongside the pad horizontally. This magic number may need adjusting once the pad dimensions change (image may have different effective height).

---

## Open — low priority / nice-to-haves

### 5. Footer polish
Footer is centered plain text with hand-drawn `.hand-rule` separators. Works. Could add:
- A small turquoise pulsing dot before coordinates (was removed when top rail was cut — could add back as a tiny accent)
- Lighter opacity on the top border line

### 6. Logo alignment re-check
The vertical `FINNVEK` logo is fixed to the viewport's left edge (`left: 0`). Works on desktop. On narrow windows, it can overlap content. Currently hidden on mobile via media query. Could be visually improved so the logo always sits just outside the notebook's shadow.

### 7. Top descriptor re-check
`INDEPENDENT SOFTWARE / FROM TURKU, FINLAND` is `position: fixed` top-right. Works. Could consider:
- Smaller text on very wide screens (already `clamp()`-ed)
- Could overlap with browser UI or notifications — no action needed unless observed

### 8. Reveal timing
Current timeline: logo letters animate 0.1–1.0s, dots 2.0–2.6s, content reveals 3.1–3.9s. This assumes users watch from the start. On refresh the logo animation replays. Could:
- Store "seen intro" in localStorage so animation only runs once per session
- Low urgency

### 9. Email backend
`action="#"` — the waitlist form is still a placeholder. No backend wired. localStorage saves the email locally but nothing is sent anywhere. Needs:
- Endpoint (Formspree, custom Cloudflare Worker, or email service)
- Form `action` + `method` set properly
- Probably out of scope for this visual redesign, but note it.

### 10. Cleanup
- `finnvek-redesign (1).md` — original spec
- `finnvek-redesign-patch-01.md` — patch spec
- `finnvek-updates-spec.md`, `finnvektieto.md`, `finnvek-rollback-spec.md` — not used, can be archived or deleted
- `routed-gothic-ttf-v1.0.0/` directory — only regular + half-italic fonts copied to `public/fonts/`; rest of the folder can stay or be removed
- `hero-bg.webp` was deleted (correct — was unused)

---

## Done so far (reference)

- Blueprint paper palette and tokens in `global.css`
- Dark-to-light theme inversion; logo letters use `var(--color-primary)`
- Hero logo stays viewport-left, vertical, rotated — unchanged animation
- Top descriptor (INDEPENDENT SOFTWARE / FROM TURKU, FINLAND) moved to fixed top-right
- Removed top rail (coordinates + last-updated)
- Two-column content grid phase (from patch-01) then restructured into notebook-pad + sticker
- `ProjectCard.astro` rewritten: no card frame, Teko KnitTools title (uppercase, clamped), three-line description with manual `<br>` breaks, simplified spec row (`Android | 11 languages | Coming soon`), solid turquoise waitlist button
- Submit animation: button press (`.pressed` scale(0.97)) → `.ok` class → text becomes `You're in!` — no ink spread (removed per request)
- `Footer.astro` centered, with hand-drawn vertical rule separators, Routed Gothic font
- Principles list moved to separate `.sticker` with torn top edge
- Section labels removed (01 Catalog, 02 Notes)
- Middle-dot separators replaced with hand-drawn vertical rule SVG (`.hand-rule`)
- Middle-dot in principles replaced with slash `/`
- Em-dash in product description replaced with sentence split
- Routed Gothic font added (regular + half-italic) and applied to: section labels (before removal), ref codes, spec row, footer, top descriptor, principles suffixes
- Tick bar, construction lines, construction-wobble SVG filter (still declared in BaseLayout) removed from use
- "More apps on the drafting table" added below KnitTools in pad
- Sticker moved up via negative margin so it sits alongside pad horizontally
- Pad pinned to left (`margin-right: auto`)
- Desk color token added (`--bg-desk: #cec9be`)

---

**Next session:** start by generating the notebook image with the prompt above, drop it into `public/`, then work through step 1's implementation checklist.
