# Hero Section Update

## Goal

Refine the hero section: shorten the headline, fix line-height issue, reposition the section higher on the page, and increase spacing between the kicker line and the headline.

## Changes

### 1. Shorten the hero headline

Change the hero text from `Software that's built to last.` to `Built to last.`

The new headline must render on a **single line** at the current font size. Do not reduce the font size to make it fit — if at the current viewport width the text wraps, the headline is fine wrapping, but on standard desktop widths it should remain one line. On narrow mobile screens, natural wrapping is acceptable.

### 2. Fix line-height for the hero

The current `line-height: 1` on the hero causes Boldonse's tall glyphs to collide between lines.

Change the hero headline's `line-height` to `1.1`.

This applies only to the hero headline. Do not change `line-height` on other headings (KnitTools title, etc.) unless they exhibit the same collision issue — verify visually first.

### 3. Reposition the hero higher

The hero currently sits too low on the viewport. Move it to roughly the **upper-middle third** of the viewport — meaning the headline's vertical center should fall somewhere between 30% and 40% from the top of the viewport on desktop.

Implementation suggestion: reduce top padding/margin on the hero section, or change vertical alignment from `center` to `flex-start` with adjusted top spacing. Choose whichever fits the existing layout structure best.

On mobile, the same proportional placement should apply — keep the hero in the upper portion of the viewport, not vertically centered.

### 4. Increase spacing between kicker and headline

The kicker line `INDEPENDENT SOFTWARE FROM TURKU, FINLAND` is currently too close to the hero headline.

Increase the vertical gap between the kicker and the headline **slightly** — around 1.5x to 2x the current gap. The kicker should still feel related to the headline (same visual unit), just with more breathing room.

## Verification checklist

- [ ] Hero headline reads `Built to last.` on a single line on desktop
- [ ] Hero rows no longer collide (line-height fixed)
- [ ] Hero sits in the upper-middle area of the viewport, not vertically centered
- [ ] Kicker line has noticeably more space below it before the headline
- [ ] Mobile layout still works correctly
- [ ] No other headings on the site have changed appearance
