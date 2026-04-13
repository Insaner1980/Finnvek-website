# Finnvek.com — Design Changes

These are changes to the already-implemented spec. Everything not listed here stays as-is.

---

## Theme: Light → Dark

Replace the entire color palette:

| Role | Old | New |
|------|-----|-----|
| Background | `#EFEEEA` | `#0A0A0F` |
| Card background | `#F7F6F3` | `#13131A` |
| Borders | `#DDD9D3` | `#1E1E28` |
| Primary text | `#2A2220` | `#EDEDF0` |
| Muted text | `#7A5E4B` | `#6B6B7A` |
| Dimmed text (footer, hints) | n/a | `#3A3A48` |
| Accent | `#B89A70` | `#1DB4A5` (turquoise) |
| Accent hover | n/a | `#24D4C2` |

Remove Oxblood (`#5E1F23`) entirely. Remove noise texture overlay.

No light mode — dark only.

---

## Typography Changes

Replace all fonts:

| Role | Old | New |
|------|-----|-----|
| Headings | Fraunces / Playfair Display | **Sora** (400, 500) |
| Body | Inter / Source Sans 3 | **DM Sans** (400) |
| Labels/tags/mono | n/a | **DM Mono** (400) |

Section labels: DM Mono, 0.65rem, uppercase, letter-spacing 0.25em, muted color.
Platform tags: DM Mono, 0.65rem, small border badge.
Footer: DM Mono, 0.7rem, dimmed color.

---

## Header: Remove

Remove the text "Finnvek" wordmark header. The logo animation replaces it.

---

## Hero: Replace

Remove the old tagline "Software built to respect its users".

New hero content:
1. **Animated FINNVEK logo** — SVG-based, CSS-only animation. Reference files provided: `Group_1.svg` (logo) and `finnvek-logo-animation.html` (animation implementation).
2. Subtitle: "Independent software from Turku, Finland" (Sora 400, muted color)

The logo is a custom Audiowide-based wordmark where F and E have horizontal bars removed, with turquoise (#1DB4A5) circles in their place. Animation: letters fade in staggered, dots bounce down from above and settle, F and E squish on dot impact.

---

## Projects Section: Add "coming soon"

After the KnitTools card, add centered text:
"More apps coming soon" — DM Sans 400, 0.8rem, dimmed color (#3A3A48).

Update KnitTools description to:
"KnitTools is a knitting companion for Android — project tracking with row counter and session history, five knitting calculators, yarn label scanning, Ravelry pattern search, and a full reference library. Privacy-first, no ads, no data collection."

---

## Footer: Add logo

Add static FINNVEK logo SVG (same paths as hero, no animation, smaller size) above the copyright text.

---

## Card Styling Update

- `background: #13131A`
- `border: 0.5px solid #1E1E28`
- `border-radius: 12px`
- `padding: 1.5rem`
- Hover (desktop): `translateY(-2px)` + border brightens to `#2A2A35`
- Arrow color: `#1DB4A5`, shifts right on hover
- Card shadow: remove (not needed on dark theme)

---

## Components: Add

Add to Astro structure:
```
src/components/
  LogoAnimated.astro    — hero logo with CSS bounce animation
  LogoStatic.astro      — footer logo, static SVG
```

---

## Deployment

Hosting: Cloudflare Pages
```bash
npx astro add cloudflare
```
Build command: `npm run build`
Output: `dist/`

---

## New Asset Files Needed

Provide these to Claude Code alongside this spec:
1. `Group_1.svg` — the logo SVG from Figma
2. `finnvek-logo-animation.html` — reference animation implementation
