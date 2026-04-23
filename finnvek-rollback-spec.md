# Finnvek.com — Rollback

Revert all four changes from the previous spec (`finnvek-updates-spec.md`). Restore the site to the state it was in before those changes. The user prefers the previous version and will explore other design directions separately.

**Project context:** See `PROJECT.md` at repo root.

---

<task id="1" name="remove-magnetic-dots">

<goal>
Remove the magnetic cursor effect from the FINNVEK logo dots. Restore `LogoAnimated.astro` to the version that only has the GSAP entry timeline (letter drop + dot drop + squish) and the click-to-replay handler — no cursor tracking, no `quickTo`, no rAF loop, no resize handling for magnetic behavior.
</goal>

<location>
`src/components/LogoAnimated.astro`
</location>

<what-to-remove>
- Any event listeners added for `mousemove` tied to the magnetic effect.
- Any `getBoundingClientRect` calls used for dot-to-cursor distance.
- Any GSAP `quickTo` or equivalent smoothing setup for the dots.
- Any `onComplete` / `eventCallback` hook that was added specifically to initialize the magnetic effect after the entry timeline.
- Any resize listener added for switching magnetic behavior on/off across the breakpoint.
- Any related cleanup code.
</what-to-remove>

<what-to-keep>
- The existing GSAP entry timeline (letters drop in, dots drop and squish).
- The click-to-replay handler that restarts the timeline.
- Everything else about the logo component that existed before the magnetic effect was added.
</what-to-keep>

<acceptance>
- Logo entry animation plays identically to before.
- Clicking the logo replays the entry animation.
- Moving the cursor near the dots does nothing.
- No leftover listeners, no console errors, no performance overhead from removed code.
</acceptance>

</task>

---

<task id="2" name="remove-philosophy-section">

<goal>
Remove the philosophy section entirely.
</goal>

<location>
- `src/components/Philosophy.astro` — delete the file.
- `src/pages/index.astro` — remove the `<Philosophy />` import and its placement between `<Hero />` and the projects section.
</location>

<acceptance>
- `Philosophy.astro` no longer exists.
- No import statement for `Philosophy` remains in `index.astro`.
- Rendered page has nothing between the hero and the projects section (back to the original layout).
- No dead CSS rules left in `global.css` that were added specifically for the philosophy section. If any were added, remove them.
</acceptance>

</task>

---

<task id="3" name="remove-privacy-link-and-stub">

<goal>
Remove the Privacy link from the footer and delete the privacy stub page.
</goal>

<location>
- `src/components/Footer.astro` — revert footer text.
- `src/pages/privacy.astro` — delete the file.
</location>

<footer-revert>
Change the footer text from:
```
© 2026 Finnvek · contact@finnvek.com · Privacy · Turku, Finland
```

Back to:
```
© 2026 Finnvek · contact@finnvek.com · Turku, Finland
```

Remove the `<a>` element and any hover styles that were added specifically for the Privacy link.
</footer-revert>

<acceptance>
- Footer shows the original three-item line with no Privacy link.
- `/privacy` route no longer exists — navigating to it should 404 (or whatever Astro's default behavior is for missing routes).
- `src/pages/privacy.astro` file is deleted.
- No leftover styles in `Footer.astro` or `global.css` specific to the removed link.
</acceptance>

</task>

---

<task id="4" name="remove-coming-soon-embossed">

<goal>
Revert the "MORE APPS COMING SOON" text back to its original small, subtle treatment.
</goal>

<location>
`src/pages/index.astro` — the "MORE APPS COMING SOON" element below the KnitTools card.
</location>

<what-to-revert>
Restore the original styling:
- Original small size (DM Mono, uppercase, small — roughly the size of the `PROJECTS` label).
- Original color (`--color-dimmed` or whatever it was before, not primary-at-low-opacity).
- Original letter-spacing (normal or whatever was in place before).
- Original opacity (fully opaque, relying on the dimmed color for subtlety).
- Original position and spacing (centered, modest margin above — not the oversized treatment).
- Text content: `MORE APPS COMING SOON` (full phrase).
- Remove `user-select: none` and `pointer-events: none` if they were added specifically for the embossed treatment.
- Remove any scroll-triggered fade-in that was added for this element specifically.
</what-to-revert>

<acceptance>
- Text reads `MORE APPS COMING SOON` in small, subtle DM Mono uppercase — matches the visual weight it had before the embossed treatment.
- No oversized text, no low-opacity primary color, no wide letter-spacing.
- Fits on one line at all viewport widths.
- Visual rhythm of the bottom of the page matches the original site.
</acceptance>

</task>

---

<general-notes>
- After all four reverts, run `npm run build` to confirm the site builds cleanly.
- Do not update `PROJECT.md`.
- Do not introduce any new changes, refactors, or "improvements" while reverting — only undo what the previous spec added.
- If any file was modified in ways not covered by these tasks (e.g. unrelated tweaks in `global.css`), check git diff and revert those too. The goal is the site exactly as it was before the previous spec.
- `git status` and `git diff` are the authoritative reference for what changed. Use them to confirm nothing from the previous spec is left behind.
</general-notes>
