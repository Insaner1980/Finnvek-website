# Section Heading Hierarchy Update

## Goal

Establish clearer typographic hierarchy between the hero headline and section headings. Rename the Finnvek section heading to avoid duplication with the logo.

## Changes

### 1. Rename the Finnvek section heading

The current section heading `Finnvek` duplicates the logo wordmark in the top-left corner. Rename the section heading to:

```
About
```

Apply this change wherever the section heading is set. The body content of the section (starting with "Finnvek is independent software from Turku, Finland...") remains unchanged.

### 2. Reduce section heading size

The section headings (`About` and `KnitTools`) are currently too close in size to the hero headline (`Built to last.`). Reduce them so they sit clearly below the hero in the visual hierarchy.

Target: section headings should be roughly **60–65% of the hero font size**.

For example, if the hero is currently 96px, section headings should be around 56–64px. Adjust to whatever fits the existing scale system in `global.css` — the goal is the proportion, not specific pixel values.

Apply the same reduced size to:
- `About` heading
- `KnitTools` heading
- Any other section headings using the same level

The hero headline `Built to last.` keeps its current size.

The kicker line (`COMING SOON`, `INDEPENDENT SOFTWARE FROM TURKU, FINLAND`) keeps its current size — only the main section headings change.

### 3. Mobile sizing

Apply the same proportional reduction at mobile breakpoints. The hero-to-section-heading ratio should remain consistent across viewport sizes.

## Verification checklist

- [ ] The `About` heading replaces `Finnvek` in the section heading
- [ ] The body text of the About section is unchanged
- [ ] The logo in the top-left corner still reads `FINNVEK` (unchanged)
- [ ] `About` and `KnitTools` headings are clearly smaller than `Built to last.`
- [ ] Hero `Built to last.` remains the dominant text on the page
- [ ] Kicker text sizes are unchanged
- [ ] Mobile layout maintains the same proportional hierarchy
- [ ] No visual regressions elsewhere on the page
