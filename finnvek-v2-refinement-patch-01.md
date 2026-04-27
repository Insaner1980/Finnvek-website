# Finnvek.com v2 — Refinement Patch 01

**Context:** The initial implementation of `finnvek-v2-complete-rebuild.md` produced a correct but flat result. This patch adds visual rhythm, refines the KnitTools section layout, introduces a signature, and strengthens the accent color usage. **Apply these changes on top of the existing v2 implementation.** Do not rebuild from scratch — this is a targeted refinement.

---

<what_this_patch_changes>

Five focused changes:

1. **Hero typography** — scale up, split the two sentences with color hierarchy
2. **KnitTools section** — fix column alignment, enlarge phone, refine spacing
3. **Accent color** — extend turquoise usage to three additional carefully chosen spots
4. **Signature** — add "— Emma" after the about section
5. **Footer** — adjust proportions, remove top border, add brand detail

Nothing else changes. The existing content, fonts, overall structure, background color, and component breakdown all remain as currently implemented.

</what_this_patch_changes>

---

<change_1_hero>

<current_state>

The hero currently uses Literata at `clamp(2.5rem, 5vw, 4.5rem)` with both sentences in the same color (`--color-text`). Visually correct but lacks rhythm.

</current_state>

<target_state>

The hero is larger and has two-tone typography. The first sentence carries the weight; the second sits quieter.

</target_state>

<markup_change>

Update the hero markup:

```html
<section class="hero">
  <h1 class="serif">
    <span class="hero-primary">Software that takes time.</span>
    <span class="hero-secondary">Made carefully.</span>
  </h1>
</section>
```

Note: each span is on its own line, not using `<br />`. CSS handles the line breaking via `display: block`.

</markup_change>

<css_change>

Replace the existing `.hero h1` styles with:

```css
.hero {
  min-height: 75vh;
  display: flex;
  align-items: center;
  padding: 4rem 0;
}

.hero h1 {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(3rem, 7.5vw, 6.5rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0;
  max-width: 1000px;
}

.hero-primary {
  display: block;
  color: var(--color-text);
}

.hero-secondary {
  display: block;
  color: var(--color-text-muted);
  font-weight: 400;
}

@media (max-width: 640px) {
  .hero {
    min-height: 70vh;
    padding: 3rem 0;
  }
  .hero h1 {
    font-size: clamp(2.5rem, 11vw, 4.5rem);
  }
}
```

**What this achieves:**
- Hero occupies 75% of viewport height on load, giving it proper presence
- Font scales up significantly on wide screens (up to 104px)
- "Software that takes time." reads at full weight
- "Made carefully." reads as a quieter continuation, because brand voice is calm confidence, not insistence

</css_change>

</change_1_hero>

---

<change_2_knittools>

<current_state>

Two-column layout where the phone and text start at different vertical positions, creating a disjointed look. Phone is 280px wide which is visually underpowered.

</current_state>

<target_state>

Two-column layout, top-aligned, with a larger phone image that feels like a proper hero asset for the section.

</target_state>

<css_change>

Replace the existing `.knittools` styles with:

```css
.knittools {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5rem;
  align-items: start;   /* CHANGED: was center, now top-aligned */
  max-width: 960px;     /* CHANGED: was 900px */
  padding: 2rem 0;
}

.knittools-image img {
  display: block;
  max-width: 340px;     /* CHANGED: was 280px */
  height: auto;
}

.knittools-content {
  padding-top: 1rem;    /* NEW: nudges text down slightly to align optically with phone content, not phone frame */
}

.knittools-content .label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;    /* CHANGED: was 0.12em, slightly looser */
  color: var(--color-accent);
  margin-bottom: 1.25rem;    /* CHANGED: was 1rem */
}

.knittools-content h2 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(2.25rem, 4vw, 3rem);   /* CHANGED: was flat 2.5rem */
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.75rem 0;     /* CHANGED: was 1.5rem */
  color: var(--color-text);
}

.knittools-content p {
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--color-text);
  max-width: 440px;
  margin: 0 0 2.25rem 0;     /* CHANGED: was 2rem */
}

@media (max-width: 768px) {
  .knittools {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  .knittools-image {
    display: flex;
    justify-content: center;
  }
  .knittools-image img {
    max-width: 260px;         /* CHANGED: was 220px */
  }
  .knittools-content {
    padding-top: 0;
  }
  .knittools-content p {
    margin-left: auto;
    margin-right: auto;
  }
}
```

**What this achieves:**
- Phone and content both start at the same visual line at the top
- The small `padding-top: 1rem` on content optically aligns the "COMING SOON" label with the phone's screen content area, not the frame's physical top edge (subtle but improves feel significantly)
- Phone is 340px wide on desktop — substantial enough to carry the section
- Increased gap (5rem vs 4rem) gives the column division more air
- Letter-spacing on label loosened slightly for editorial refinement

</css_change>

</change_2_knittools>

---

<change_3_accent_color>

<current_state>

Turquoise `#24D4C2` appears only on the "COMING SOON" label and the `knittoolsapp.com →` link. Two uses on the entire page feels undernourished — the color is brand-critical but visually absent.

</current_state>

<target_state>

Turquoise appears in three additional spots, used as punctuation not decoration. Each instance is functional — highlighting a product name, marking a brand element, or separating content.

</target_state>

<change_3a_about_text>

In the about section's final paragraph, wrap "KnitTools" in a span:

```html
<p>The first one is <span class="accent">KnitTools</span>. More are on the way.</p>
```

Add CSS:

```css
.about .accent {
  color: var(--color-accent);
  font-weight: 500;
}
```

**Why:** KnitTools is a real product name. Highlighting it turquoise makes it scannable and visually connects the about section to the product section below, creating narrative flow.

</change_3a_about_text>

<change_3b_brand_dot>

Add a turquoise brand dot to the footer's brand text:

```html
<div class="footer-brand">Finnvek<span class="brand-dot">•</span>2026<span class="sep">·</span>Turku, Finland</div>
```

Add CSS:

```css
.footer-brand .brand-dot {
  color: var(--color-accent);
  margin: 0 0.6rem;
  font-size: 1em;
  line-height: 1;
  position: relative;
  top: -0.05em;
}
.footer-brand .sep {
  color: var(--color-text-dimmed);
  margin: 0 0.5rem;
}
```

**Why:** The turquoise dot between "Finnvek" and "2026" echoes the dots in the FINNVEK logo (F's and E's turquoise circles). It's a brand element, not decoration.

</change_3b_brand_dot>

<change_3c_more_apps>

Update the "More apps" section to include a subtle turquoise bullet:

```html
<section class="more-apps">
  <p><span class="bullet">•</span> More apps are in development.</p>
</section>
```

Add CSS:

```css
.more-apps p .bullet {
  color: var(--color-accent);
  margin-right: 0.5rem;
  font-size: 1em;
  line-height: 1;
  position: relative;
  top: -0.1em;
}
```

**Why:** Echoes the footer brand dot. Ties the "coming next" sections together with a consistent visual signal.

</change_3c_more_apps>

</change_3_accent_color>

---

<change_4_signature>

<current_state>

The about section ends with "The first one is KnitTools. More are on the way." and then there's a big jump to the KnitTools section.

</current_state>

<target_state>

After the about text, a small italic signature "— Emma" sits as a quiet human touch. The signature is editorial — like an essay signed by its author. It makes the page feel personal without being self-promotional.

</target_state>

<markup_change>

Add the signature directly after the last paragraph in the about section:

```html
<section class="about">
  <p>Finnvek is independent software from Turku, Finland. I'm one developer, working on my own projects.</p>
  <p>It exists because some ideas were worth following, and I had the freedom to follow them. The kind of ideas that stay interesting for years, not weeks. The kind I care about enough to build carefully, without shortcuts or rushed releases.</p>
  <p>Every product is its own thing. No ads, no tracking. Made to work well, and to keep working for a long time.</p>
  <p>The first one is <span class="accent">KnitTools</span>. More are on the way.</p>
  <div class="signature">— Emma</div>
</section>
```

</markup_change>

<css_change>

Add CSS:

```css
.signature {
  margin-top: 3rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
}
```

**Why:**
- The em dash (` — `) here is traditional typography for authorship, not AI filler — this is the one acceptable place for it
- Italic Literata at 1rem reads as a signature, not a heading
- Muted color keeps it quiet
- 3rem top margin creates proper breathing room after the last paragraph

</css_change>

</change_4_signature>

---

<change_5_footer>

<current_state>

Footer has a top border (`border-top: 1px solid var(--color-border-faint)`) that feels "office document," and padding is tight.

</current_state>

<target_state>

Footer feels like it belongs at the end of the page as natural closure, not a separator. More breathing room.

</target_state>

<css_change>

Replace the existing `footer` styles with:

```css
footer {
  padding: 5rem 0 3rem;          /* CHANGED: was 3rem 0 2rem */
  margin-top: 8rem;              /* CHANGED: was 6rem, more separation from content above */
  /* REMOVED: border-top */
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
  transition: color 150ms ease;
}

.footer-links a:hover {
  color: var(--color-accent);
}

.footer-links .dot {
  margin: 0 0.5rem;
  color: var(--color-text-dimmed);
}

@media (max-width: 640px) {
  footer {
    padding: 3rem 0 2rem;
    margin-top: 5rem;
  }
  .footer-inner {
    flex-direction: column;
    gap: 1.25rem;
    text-align: center;
    padding: 0 1.25rem;
  }
}
```

**What this achieves:**
- No top border — the space separates, not a line
- More top margin so the footer truly feels like page-end, not a boundary between sections
- Hover transition on links adds small polish

</css_change>

</change_5_footer>

---

<overall_spacing_review>

As part of this patch, review vertical rhythm between sections. Targets:

- Header to hero: existing (works)
- Hero to about: `7rem` (112px) — increase from current if less
- About to KnitTools: `9rem` (144px) — let the signature breathe before the next section starts
- KnitTools to "More apps": `6rem` (96px)
- "More apps" to footer: handled by `margin-top: 8rem` on footer

The goal: more air between major sections now that hero is significantly larger. Tight spacing with a bigger hero feels cramped.

</overall_spacing_review>

---

<what_not_to_do>

- **Do not** add scroll animations, hover scale effects, or any motion beyond the existing clock update
- **Do not** add emojis to content
- **Do not** add em dashes to content text — except the single `— Emma` signature where em dash is grammatically correct typography
- **Do not** change the color palette tokens (`--color-bg`, `--color-accent`, etc.) — this patch uses existing values
- **Do not** change the fonts (still Literata and Figtree)
- **Do not** change the page structure or section order
- **Do not** add new sections or content blocks
- **Do not** add navigation, back-to-top links, or scroll indicators
- **Do not** rebuild components — edit the existing markup and CSS in place

</what_not_to_do>

---

<acceptance_criteria>

After this patch:

1. Hero section occupies ~75vh on desktop. Typography is visibly larger. "Software that takes time." is full-weight text color; "Made carefully." is muted color.

2. KnitTools section: phone image (340px wide) and content column are top-aligned. "COMING SOON" label aligns optically with the phone's screen content area.

3. Turquoise `#24D4C2` appears on:
   - "COMING SOON" label (existing)
   - `knittoolsapp.com →` link (existing)
   - "KnitTools" word in about text's last paragraph
   - Brand dot in footer between "Finnvek" and "2026"
   - Bullet before "More apps are in development"

4. "— Emma" signature in italic Literata appears after the last about paragraph, muted color.

5. Footer has no top border. More vertical space around it.

6. Spacing between major sections is noticeably more generous than before.

7. All existing functionality works: live clock, responsive layout at 375/768/1440, font loading self-hosted.

8. Lighthouse scores unchanged or improved. No new console errors.

9. Build succeeds. Site deploys cleanly.

Visual check: compared to the pre-patch version, the page should feel like it has rhythm now. The hero carries weight, sections breathe, and turquoise punctuates three clear moments. No single element screams — the whole feels composed.

</acceptance_criteria>

---

<notes_for_implementation>

- Start with the hero changes first. Once those land, the rest of the page's spacing needs to be rechecked because the bigger hero changes the overall proportions.
- The `padding-top: 1rem` on `.knittools-content` is an optical alignment trick — it makes the text align with the phone's *content*, not the phone's physical frame top edge. Test this visually after applying; it may need slight adjustment (0.75rem or 1.25rem) depending on where exactly the phone frame's screen starts.
- The accent color additions (points 3a, 3b, 3c) are small but must all three be applied — one alone looks random, three together create a pattern.
- Signature "— Emma" is intentional editorial writing. Do not change the em dash to a hyphen or remove it.

</notes_for_implementation>

---

<deliverable_summary>

After applying this patch, Emma should see:

- A hero that actually demands attention, with typographic hierarchy between the two sentences
- A KnitTools section that reads as one composed unit, not two floating halves
- Turquoise as a quiet through-line tying the page's brand moments together
- A personal signature that makes the page feel authored, not generic
- A footer that feels like page-end, not a separator

The aesthetic is still minimal. The changes are proportions, color application, and one signature — no new features, no new complexity.

</deliverable_summary>
