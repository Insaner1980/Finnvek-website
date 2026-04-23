# Finnvek.com — Visual & Content Updates

Implementation spec for four changes to the existing Finnvek.com site. Each change is scoped, independent, and can be implemented in order. Do not refactor anything outside the scope described. The site is already working — do not touch existing animations, layout, or design tokens unless explicitly called out.

**Project context:** See `PROJECT.md` at repo root for full stack, design system, and current structure.

---

<task id="1" name="magnetic-dots">

<goal>
Make the two turquoise dots in the FINNVEK logo (F-dot and E-dot) react to the cursor with a subtle magnetic effect. When the cursor is near a dot, the dot drifts slightly toward the cursor and returns smoothly when the cursor leaves. This should feel like an ambient, living detail — not a toy.
</goal>

<location>
`src/components/LogoAnimated.astro` — add magnetic behavior after the existing GSAP entry timeline finishes.
</location>

<behavior>
- **Activation radius:** 120px from the dot's center (screen-space distance).
- **Max offset:** 10px toward the cursor when cursor is at the dot's position. Falls off linearly with distance (1 - distance/radius).
- **Scale:** Dot scales from 1.0 to 1.08 on close proximity (same falloff curve).
- **Smoothing:** Use GSAP `quickTo` (or equivalent smooth interpolation, duration ~0.3s, ease `power2.out`) — not raw per-frame assignment. Movement must feel like the dots are attached by a soft spring, not a rigid cursor follower.
- **Rest state:** When cursor is outside the radius, dot returns to its original position with the same smoothing.
- **Desktop only:** Skip the entire setup on touch devices / narrow viewports (match the existing mobile breakpoint at ≤640px). Do not attach listeners at all on mobile.
- **Timing:** Initialize the magnetic effect only after the existing entry timeline completes. Use the timeline's `onComplete` callback or a `.then()`/`.eventCallback()` — do not guess with `setTimeout`.
</behavior>

<rotation-note>
The desktop logo's parent container is rotated `-90deg`. If you apply `translate(x, y)` to a dot inside the rotated container, the visual movement is the rotated vector — not the screen-space vector. This must be accounted for:

- **Mobile layout (no rotation):** Apply screen-space offset directly.
- **Desktop layout (-90deg rotation):** To move a dot visually by screen-space `(sx, sy)`, apply local-space translate of `(-sy, sx)`. (Equivalent to rotating the screen-space vector by +90deg into local coords.)

Alternatively, detect rotation from the parent's computed transform and apply the inverse — whichever is cleaner. What matters is that when the cursor moves to the right of a dot, the dot visually drifts right on both layouts.

Always use `getBoundingClientRect()` on the dot elements to compute screen-space distance to the cursor, since the rotation makes raw SVG coordinates useless for this.
</rotation-note>

<acceptance>
- Entry animation (drop + squish) still works exactly as before.
- After entry completes, moving the cursor near each dot causes it to drift slightly toward the cursor on both desktop and mobile — wait, desktop only.
- Clicking the logo still replays the entry timeline. After replay, magnetic effect re-initializes correctly.
- No visible jitter or stutter. No performance drop.
- On resize across the mobile/desktop breakpoint, behavior switches cleanly.
- No listeners or rAF loops left running on mobile.
</acceptance>

<do-not>
- Do not add a library beyond what's already in the project. GSAP is already in use.
- Do not rebuild the logo component or change the existing timeline structure.
- Do not add magnetic effect to the logo letters — only the two dots.
- Do not use `setTimeout` to wait for the entry timeline.
</do-not>

</task>

---

<task id="2" name="philosophy-section">

<goal>
Add a short philosophy section between the hero and the projects section. Three editorial-style statements, large typography, no card, no border — just text on the page background. This establishes Finnvek's voice and values without sounding corporate or boastful.
</goal>

<location>
- New component: `src/components/Philosophy.astro`
- Inserted in `src/pages/index.astro` between `<Hero />` and the projects section.
</location>

<content>
Three lines, stacked vertically:

1. Built to own, not to subscribe to.
2. Fair pricing. No dark patterns.
3. Privacy by default. Always.

Each line is a separate block with generous vertical spacing between them. Treat them as three separate statements, not a paragraph.
</content>

<typography>
- **Font:** Geist (already loaded), weight 300 (Light).
- **Size:** Large. Desktop ~2.25rem, mobile ~1.5rem. Use `clamp()` for fluid sizing.
- **Line height:** ~1.3 (tight but readable at large size).
- **Color:** `--color-primary` for the main text. Optionally, one word per line can use `--color-accent` for subtle emphasis — but only if it looks good, not forced. Default is all primary color.
- **Alignment:** Left-aligned, same left edge as the projects section content (respect the existing `padding-left: 100px` on desktop, full-width with 2rem margin on mobile).
- **Max-width:** Same 720px content max-width as the rest of the page.
- **Spacing between lines:** ~2.5rem desktop, ~1.75rem mobile.
- **Spacing above and below section:** Generous — roughly 8rem top and bottom on desktop, 5rem on mobile. The section should feel like it has room to breathe, not crammed between hero and projects.
</typography>

<animation>
- Desktop: fade-up reveal on load, staggered per line (stagger ~0.15s). Trigger after the logo entry timeline completes (can use the same `onComplete` hook or a fixed delay that matches — ~3.5s after page load).
- Mobile: fade-up reveal on scroll using the existing GSAP ScrollTrigger pattern already used on project cards. Match that pattern — do not invent a new one.
</animation>

<acceptance>
- Section renders between hero and projects on both desktop and mobile.
- Three lines are visually distinct as separate statements, not running together.
- Typography feels editorial and confident, not bold or shouty.
- Fade-up animation matches the rest of the site's rhythm.
- No card, no border, no background — pure text on the page background.
</acceptance>

<do-not>
- Do not wrap the lines in a card or container with its own background.
- Do not use Teko or Syne here — these are reserved for their current uses.
- Do not make the text clickable or interactive.
- Do not add icons or bullets next to the lines.
</do-not>

</task>

---

<task id="3" name="privacy-footer-link">

<goal>
Add a Privacy link to the footer. This is preparation for centralizing privacy policies for Finnvek apps on finnvek.com.
</goal>

<location>
- `src/components/Footer.astro` — modify footer content.
- `src/pages/privacy.astro` — create as a minimal stub page.
</location>

<footer-change>
Current footer text:
```
© 2026 Finnvek · contact@finnvek.com · Turku, Finland
```

Updated footer text:
```
© 2026 Finnvek · contact@finnvek.com · Privacy · Turku, Finland
```

The word "Privacy" is an `<a href="/privacy">` link. Styling:
- Same font, weight, size, and color as the surrounding text by default.
- On hover: color shifts to `--color-accent-hover` (or `--color-accent`, whichever matches the site's existing link hover pattern).
- No underline by default, optional subtle underline on hover if consistent with other links on the site.

Keep the `·` separators consistent — the link sits between two `·` separators like the other items.
</footer-change>

<privacy-stub>
Create `src/pages/privacy.astro` as a minimal placeholder page:

- Uses `BaseLayout.astro` for the HTML shell.
- Page title: "Privacy — Finnvek"
- Meta description: "Privacy policies for Finnvek apps and this website."
- Content: A single H1 "Privacy" and a short paragraph stating that privacy policies for Finnvek apps will be published here, and for now users can contact `contact@finnvek.com` with privacy questions.
- Use the existing typography from `global.css` — do not introduce new styles.
- Do not add navigation, do not add a footer on this page unless it's already inherited from BaseLayout.
- Keep it short — this is a placeholder, not the real privacy page.
</privacy-stub>

<acceptance>
- Footer shows the new "Privacy" link between contact email and location.
- Link navigates to `/privacy` and renders the stub page.
- Stub page inherits site styling cleanly.
- Footer layout still works on mobile (centered) — the extra item should not cause wrapping issues. If it does, adjust spacing or allow a natural wrap.
</acceptance>

<do-not>
- Do not write actual privacy policy content. This is a placeholder only.
- Do not add any tracking, analytics, or cookie banner logic.
- Do not create a "Terms" or other legal link — only Privacy.
</do-not>

</task>

---

<task id="4" name="coming-soon-embossed">

<goal>
Replace the current "MORE APPS COMING SOON" line with an embossed, oversized typographic treatment — large, very low opacity, feels like it's pressed into the background rather than sitting on it as a separate element. Acts as a section transition rather than a loud promise.
</goal>

<location>
`src/pages/index.astro` — the existing "MORE APPS COMING SOON" line below the KnitTools card.
</location>

<treatment>
- **Text:** `MORE APPS COMING SOON` (unchanged).
- **Font:** DM Mono (existing — `--font-dm-mono`), uppercase.
- **Size:** Much larger than current. Use `clamp()`, roughly `clamp(2.5rem, 8vw, 6rem)` — adjust until it feels right. Should span a significant portion of the viewport width without breaking onto multiple lines on desktop. On mobile, allow it to wrap naturally (or reduce to one line if wrapping looks bad).
- **Opacity:** Very low — start at `0.06` and tune between `0.04` and `0.10`. Should be barely visible, more felt than read.
- **Color:** `--color-primary` at low opacity — not `--color-dimmed` (dimmed color at low opacity gets lost entirely; using primary at low opacity keeps the hue neutral against the background).
- **Letter-spacing:** Wider than default — try `0.1em` to `0.2em`. Creates the "stretched, engraved" feel.
- **Weight:** Regular (400) — not bold. Bold at low opacity looks muddy.
- **Alignment:** Centered within the content column.
- **Position:** Same position as current — below the KnitTools card.
- **Spacing:** Generous vertical spacing above (at least 6rem desktop, 4rem mobile) so it reads as a section break.
- **Animation:** None on load. Optionally a very slow fade-in on scroll (if visible when scrolling down) using existing ScrollTrigger pattern, but this is optional — static is fine.
- **Interaction:** Non-selectable (`user-select: none`) and `pointer-events: none` — it's decorative, not content to interact with.
</treatment>

<acceptance>
- Text is present but visually recedes into the background.
- Does not compete with the KnitTools card or the footer for attention.
- Reads as "something is coming" through its presence, not through being loud.
- Does not cause horizontal scroll on any viewport width.
- Looks intentional, not like a styling mistake.
</acceptance>

<do-not>
- Do not add a border, box, or background to this element.
- Do not make it a link.
- Do not add multiple lines of copy or additional text near it.
- Do not use color for emphasis — the low opacity is the entire visual concept.
- Do not add Tailwind — the project uses pure CSS with custom properties.
</do-not>

</task>

---

<general-notes>
- All four tasks are independent. Implement in order; test each before moving on.
- Do not update `PROJECT.md` as part of these changes. The user will review the result first and decide whether to update docs.
- Do not add new dependencies. Everything needed (GSAP, Astro, existing font stack) is already in the project.
- Do not introduce new color tokens, font variables, or design system values. Use what's already in `global.css`.
- If something in the existing code seems broken or "could be refactored," leave it alone. Only touch what these tasks require.
- After implementation, run `npm run build` to confirm the site still builds cleanly.
</general-notes>
