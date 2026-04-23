# Finnvek.com v2 — Phase 2: 3D Logo Hero

**Scope of this document:** This is Phase 2. Phase 1 (foundation — dark background with dot grid, Lekton + Commissioner typography, empty page shell) must be complete and merged into `v2` branch before starting this phase. Phase 2 adds a Three.js-based 3D rendering of the FINNVEK wordmark as the hero element, replacing the Phase 1 placeholder text. **Do not implement anything beyond Phase 2 scope** (no content sections, no KnitTools card, no footer — those are Phase 3).

---

<context>

The FINNVEK wordmark is a custom Audiowide-based design where the letters F and E have their horizontal bars replaced by turquoise circles. In the v1 site, this was rendered as a 2D SVG with GSAP letter-drop animations. In v2, it becomes a 3D scene rendered via Three.js — the letters are extruded from the same SVG (so letterforms stay pixel-perfect), materials are applied, and a scripted intro animation plays on load.

The scene must feel calm and premium, not "wow-look-at-my-3D." Restraint is the whole point. If in doubt, make it quieter.

</context>

<prerequisites>

- Phase 1 is complete: dark background (`#08080A`), dot grid, Lekton + Commissioner fonts loaded, `BaseLayout.astro`, empty `index.astro` with placeholder centered text.
- The Phase 1 placeholder text ("Finnvek" + "PHASE 1 — FOUNDATION") is removed as part of this phase.
- Work continues on the `v2` branch. No changes to `main`.

</prerequisites>

---

<design_decisions_recap>

These were decided in conversation with Emma and are not up for reinterpretation:

| Element | Decision |
|---|---|
| Rendering | Three.js, real-time WebGL, not a pre-rendered image |
| Letters | Extruded from the existing FINNVEK SVG (SVGLoader + ExtrudeGeometry) |
| Letter material | Satin white — matte white with very subtle sheen (NOT glossy, NOT mirror-like) |
| Dots (F and E) | Separate SphereGeometry meshes at the positions where the bars would be |
| Dot material | Emissive turquoise (`#24D4C2`), self-illuminating, with soft bloom |
| Platform | Elliptical (oval) disc beneath the letters, same satin white material |
| Background | Transparent — the Phase 1 dot grid shows through behind the scene |
| Intro animation | "Dot Ignition" — letters fade+scale in with stagger, then dots ignite |
| Interaction | Mouse-follow parallax (logo rotates a few degrees toward cursor) on desktop |
| Mobile | Same scene, but static (no parallax, intro animation still plays once) |
| Fallback | Static SVG if WebGL unavailable or `prefers-reduced-motion` active for the ignition phase |

</design_decisions_recap>

---

<tech_stack_additions>

- **three** — core Three.js library. Use the latest stable version. Before installing, check https://threejs.org for the current release.
- **No** additional Three.js helper libraries (e.g. no `@react-three/fiber`, no `three-stdlib`, no GSAP-for-Three). This is a vanilla Three.js implementation with hand-written animation using `requestAnimationFrame`.
- Tree-shake Three.js imports. Import only what is used:
  ```js
  import { Scene, PerspectiveCamera, WebGLRenderer, /* etc. */ } from 'three';
  import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
  ```
- Code-split the Three.js scene: it should load in a separate JavaScript chunk, not block initial page paint.

</tech_stack_additions>

---

<asset_requirements>

**The FINNVEK SVG is required.** It exists in `src-v1-archive/` (look in `src/components/LogoAnimated.astro` or `src/components/LogoStatic.astro` for the SVG markup). Extract the raw `<svg>...</svg>` and save it as a standalone file:

```
public/finnvek-wordmark.svg
```

The SVG has `viewBox="0 0 402 62"` and contains:
- Seven letter paths: F, I, N, N, V, E, K
- Two circle elements: one for the F's top bar, one for the E's middle bar

Before using it in the scene, inspect the SVG source and identify:
1. The path indices for each letter (F, I, N, N, V, E, K)
2. The x/y coordinates and radius of each circle
3. The overall viewBox dimensions

This information drives the Three.js setup.

</asset_requirements>

---

<scene_spec>

<canvas_setup>

The 3D scene lives in a `<canvas>` element inside a `HeroLogo.astro` component. The component is inserted into `index.astro` as the sole content of the hero section.

- Canvas size: fills the viewport height minus any header padding (effectively full viewport for Phase 2, since there is no header yet). Width: full viewport width.
- Canvas CSS: `position: relative; width: 100%; height: 100vh; display: block;`
- Canvas background: transparent (set `alpha: true` on WebGLRenderer so the page background shows through).
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to avoid over-rendering on high-DPI screens.
- `renderer.setClearColor(0x000000, 0)` for full transparency.

</canvas_setup>

<scene_and_camera>

- `PerspectiveCamera`:
  - FOV: `35` (moderately long focal length — avoids dramatic perspective distortion)
  - Aspect: `window.innerWidth / window.innerHeight`
  - Near: `0.1`
  - Far: `100`
  - Position: `(0, 2, 18)` — slightly above the letter plane, pulled back enough to frame the wordmark with breathing room
  - LookAt: `(0, 0, 0)` — the center of the logo group

- The letter group is centered at origin. The SVG coordinates need to be translated so the wordmark's center is at (0, 0). Calculate the bounding box after extrusion and translate the group by the negative center.

- The whole logo group is tilted forward by approximately `-12°` on the X-axis (`Math.PI / 15` negative) so the camera sees the top surfaces of the letters slightly. Do not tilt more — it stops feeling architectural and starts feeling isometric.

</scene_and_camera>

<letter_geometry>

For each letter path in the SVG:

1. Parse with `SVGLoader`.
2. Create shapes from paths (`SVGLoader.createShapes(path)`).
3. Use `ExtrudeGeometry` with these exact settings:
   ```js
   {
     depth: 12,              // Extrusion depth
     bevelEnabled: true,
     bevelThickness: 0.5,
     bevelSize: 0.3,
     bevelSegments: 4,
     curveSegments: 8
   }
   ```
4. SVG Y-axis is inverted relative to Three.js, so after creating the mesh, apply `mesh.scale.y = -1` or use a negative Y scale at the group level. Verify orientation — the letters should be upright, not upside-down.
5. Scale the entire letter group down so the wordmark is approximately `16` units wide in scene space. Calculate this from the SVG viewBox width (`402`) — scale factor is roughly `16 / 402 ≈ 0.04`.

</letter_geometry>

<dot_geometry>

The two dots (F and E) are **not** rendered from the SVG circles. They are separate `SphereGeometry` meshes:

```js
const dotGeometry = new SphereGeometry(radius, 32, 32);
```

- Radius: match the SVG circle radius after scaling. In SVG space, measure the circle's radius; multiply by the same scale factor used for letters.
- Position: extract x/y from the SVG circle elements, apply the same scale and translation as the letters, and push the dots forward in Z by approximately `6` units (half the extrusion depth) so they sit at the front face of the letters.

</dot_geometry>

<platform_geometry>

The elliptical platform beneath the logo:

- Geometry: `CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)` with:
  - `radiusTop: 12`
  - `radiusBottom: 12`
  - `height: 0.6`
  - `radialSegments: 64`
- Scale the cylinder to make it elliptical: `platform.scale.set(1.0, 1.0, 0.4)` — this compresses it on the Z-axis (depth) to produce an oval that is wider than it is deep when viewed from the camera.
- Position: `(0, -1.5, 0)` — sits below the letters, which should rest on its top surface.
- Apply slight edge beveling by using a small `CapsuleGeometry` or by not using `CylinderGeometry` and instead building a lathe/extruded shape — **but only if the simpler CylinderGeometry looks wrong.** Try the simple version first.

</platform_geometry>

</scene_spec>

---

<materials_spec>

All materials use `MeshStandardMaterial` (PBR). Exact values:

<letter_material>

```js
const letterMaterial = new MeshStandardMaterial({
  color: 0xF5F5F5,          // Slight off-white (avoids flat #FFFFFF)
  roughness: 0.4,           // Satin: not shiny, not fully matte
  metalness: 0.0,           // Non-metallic
  envMapIntensity: 0.6      // Subtle environment reflections
});
```

Why these values:
- `roughness: 0.4` produces the satin ceramic/plastic sheen Emma chose
- `metalness: 0.0` keeps it non-metallic; metalness > 0 would make it look like painted metal, which is wrong
- `envMapIntensity: 0.6` works with the environment map (see lighting section) to give soft reflections

</letter_material>

<dot_material>

```js
const dotMaterial = new MeshStandardMaterial({
  color: 0x24D4C2,          // Turquoise accent color
  emissive: 0x24D4C2,       // Same color, self-illuminating
  emissiveIntensity: 1.8,   // Strong glow
  roughness: 0.2,
  metalness: 0.0
});
```

The high `emissiveIntensity` combined with the post-processing bloom (see below) creates the "LED glow" look.

</dot_material>

<platform_material>

Same as letter material. The platform and letters visually read as the same substance.

</platform_material>

---

<lighting_spec>

Three lights plus an environment map:

<ambient_light>

```js
const ambient = new AmbientLight(0xFFFFFF, 0.15);
```

Very low. Just enough to prevent shadows being fully black.

</ambient_light>

<key_light>

```js
const keyLight = new DirectionalLight(0xFFFFFF, 1.2);
keyLight.position.set(-5, 8, 6);   // Upper left, in front
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 30;
keyLight.shadow.bias = -0.001;     // Prevents shadow acne
```

The main directional light. Shadows from this light fall to the lower right, grounding the logo on the platform.

</key_light>

<rim_light>

```js
const rimLight = new DirectionalLight(0x88CCFF, 0.5);
rimLight.position.set(0, 3, -8);   // Behind and slightly above
```

Subtle cool-tinted rim from behind. Separates the letters from the dark background. Color `0x88CCFF` is a very pale blue — it prevents the rim from looking yellow or neutral, and subconsciously harmonizes with the turquoise dots.

</rim_light>

<environment_map>

Use a neutral HDRI environment or a procedural solution:

```js
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three';

const pmremGenerator = new PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
```

`RoomEnvironment` is built into Three.js examples — it's a simple synthetic room that provides subtle realistic reflections without needing an external HDR file. The low blur value (`0.04`) keeps reflections soft.

**Do not** load an external HDRI file. It adds page weight and `RoomEnvironment` is sufficient for this material setup.

</environment_map>

---

<postprocessing_spec>

Use `EffectComposer` with exactly two passes:

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new Vector2(window.innerWidth, window.innerHeight),
  0.6,    // strength
  0.4,    // radius
  0.85    // threshold — only very bright pixels bloom
));
```

The threshold ensures only the emissive dots bloom. The white letters do not bloom.

**Do not** add additional passes (no SSAO, no FXAA, no color grading). The scene's aesthetic comes from materials and lighting, not post-processing layers.

---

<animation_spec>

<intro_dot_ignition>

Timeline — all times in seconds from page load:

| t (s) | Element | Action |
|---|---|---|
| 0.0 | Canvas fade-in | Canvas opacity 0 → 1 over 0.3s |
| 0.2 | Platform | Fades in (opacity 0 → 1 via material.transparent, opacity 0 → 1) over 0.4s |
| 0.4 | Letter F | Scale 0.7 → 1.0 + opacity 0 → 1 over 0.5s (ease-out cubic) |
| 0.48 | Letter I | Same, staggered by 0.08s |
| 0.56 | Letter N | Same |
| 0.64 | Letter N | Same |
| 0.72 | Letter V | Same |
| 0.80 | Letter E | Same |
| 0.88 | Letter K | Same |
| 1.2 | Dots | `emissiveIntensity` 0 → 1.8 over 0.5s (ease-in-out) |
| 1.2 | Bloom | Bloom strength 0 → 0.6 over 0.5s (syncs with dot ignition) |
| 1.7 | Animation complete | Parallax becomes active |

Implementation: a single `requestAnimationFrame` loop tracks elapsed time, computes each element's current state via easing functions, and applies it. No external animation library.

Easing functions (implement as plain functions):
- `easeOutCubic(t) = 1 - Math.pow(1 - t, 3)`
- `easeInOutCubic(t) = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2`

If the user has `prefers-reduced-motion: reduce`, skip the intro animation entirely. Render the scene in its final state immediately. The canvas can still fade in over 0.3s for a smooth appearance.

</intro_dot_ignition>

<parallax_interaction>

After intro completes:

- On `mousemove` (desktop only), calculate normalized cursor position: `nx = (event.clientX / window.innerWidth) - 0.5` (range -0.5 to 0.5), same for `ny`.
- Target rotation: `logoGroup.rotation.y = nx * 0.15` (max ~8.5°), `logoGroup.rotation.x = -0.21 + ny * -0.08` (base tilt plus small vertical mouse response).
- Apply with `lerp` for smoothness: every frame, move current rotation 8% of the way toward target. This gives the logo inertia and avoids jittery snaps.
- On mobile / touch devices: no parallax. Logo is static in its post-intro orientation.

</parallax_interaction>

</animation_spec>

---

<mobile_behavior>

Mobile detection: `window.matchMedia('(max-width: 640px)').matches` or pointer type check `window.matchMedia('(hover: none) and (pointer: coarse)').matches`.

On mobile:
- Scene renders at full quality (same materials, same lighting).
- Intro animation plays once on load.
- **No parallax** — no `mousemove` or `deviceorientation` listeners.
- Canvas `height: 100vh` but consider using `100dvh` (dynamic viewport height) to account for mobile browser chrome behavior.
- Reduce `UnrealBloomPass` render target size on mobile (use `window.innerWidth * 0.5` instead of full width) for performance.

</mobile_behavior>

---

<fallback_for_no_webgl>

If WebGL is not available (`!WebGLRenderer.isWebGLAvailable()` or an exception during setup):

- Remove the canvas.
- Render a static SVG fallback: the same FINNVEK wordmark SVG, centered in the hero area, at a reasonable display size (e.g. max-width 600px).
- No animation, no interaction.

This ensures the brand mark is always visible, even on devices or browsers where 3D fails.

Also render the static SVG fallback if the user agent indicates a very low-end device. Use `navigator.hardwareConcurrency < 4` as a rough heuristic — not perfect, but prevents the scene from struggling on ancient hardware.

</fallback_for_no_webgl>

---

<accessibility_spec>

The 3D canvas is decorative. The brand name is conveyed via:

```html
<div role="img" aria-label="Finnvek">
  <canvas aria-hidden="true"></canvas>
</div>
```

- `role="img"` on the wrapper with `aria-label="Finnvek"` ensures screen readers announce the brand.
- `aria-hidden="true"` on the canvas prevents screen readers from attempting to read the WebGL content.
- The SVG fallback (when used) should have `role="img"` and `aria-label="Finnvek"` as well.

---

<performance_budget>

Strict limits for Phase 2:

| Metric | Target |
|---|---|
| Three.js bundle size (gzipped) | ≤ 170 KB |
| Total JS added by Phase 2 (gzipped) | ≤ 200 KB |
| Time to first meaningful paint | ≤ 1.5s on 4G throttled |
| Time to 3D scene interactive | ≤ 3.0s on 4G throttled |
| FPS during parallax (desktop) | ≥ 55 |
| FPS during parallax (mid-range mobile, Pixel 6-equivalent) | ≥ 40 |
| Lighthouse Performance (after Phase 2) | ≥ 90 |

Strategies to meet budget:
- Tree-shake Three.js imports (verified per-import, not `import * as THREE`)
- Code-split the `HeroLogo.astro` component's script — it should load in a separate chunk via dynamic import
- Astro's `client:idle` or `client:visible` directive for the scene's hydration
- Geometry reuse: one `dotGeometry` shared between both dot meshes
- Material reuse: one `letterMaterial` instance shared across all letters and the platform

</performance_budget>

---

<file_structure_additions>

After Phase 2 completes:

```
finnvek/
├── src/
│   ├── components/
│   │   ├── Grid.astro             # From Phase 1
│   │   ├── HeroLogo.astro         # NEW — wrapper component with canvas + fallback SVG
│   │   └── ...                    # (no others in Phase 2)
│   ├── scripts/                   # NEW DIRECTORY
│   │   ├── hero-logo.ts           # NEW — main Three.js scene setup and loop
│   │   ├── hero-animation.ts      # NEW — intro animation timeline
│   │   ├── hero-materials.ts      # NEW — material definitions (export functions)
│   │   └── hero-lighting.ts       # NEW — light setup
│   └── ...
├── public/
│   ├── finnvek-wordmark.svg       # NEW — extracted from v1 archive
│   └── ...
```

Rationale for the split into four script files: each file has a single responsibility. `hero-logo.ts` orchestrates; the others provide building blocks. Files stay under ~150 lines each.

</file_structure_additions>

---

<integration_with_index_page>

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroLogo from '../components/HeroLogo.astro';
---

<BaseLayout>
  <main>
    <HeroLogo />
  </main>
</BaseLayout>
```

Remove the Phase 1 placeholder text. That is the entire page content for Phase 2.

</integration_with_index_page>

---

<what_not_to_do>

- **Do not** add a loading spinner, skeleton, or "loading..." text while the 3D scene initializes. The progressive fade-in (canvas opacity 0 → 1 plus intro animation) IS the loading state.
- **Do not** add particles, stars, floating geometry, or any ambient elements in the scene. The scene is: letters, dots, platform. That's it.
- **Do not** add a "click to interact" prompt or tooltip.
- **Do not** add orbit controls, zoom, or drag-to-rotate. Parallax is the only interaction.
- **Do not** add sound.
- **Do not** use `OrbitControls`, `GLTFLoader`, `DRACOLoader`, or other Three.js addons. Only `SVGLoader`, `EffectComposer`, `RenderPass`, `UnrealBloomPass`, `RoomEnvironment`.
- **Do not** use Blender to pre-make the geometry and import a GLTF. The whole point is that the 3D comes from the same SVG as the 2D fallback — one source of truth.
- **Do not** cache or bake lighting. The scene is real-time because it needs to respond to parallax.
- **Do not** add a debug GUI (dat.gui, lil-gui). If you need tweaking, use browser devtools on the rendered canvas.
- **Do not** implement the KnitTools card, projects section, footer, or any other content. Those are Phase 3.

</what_not_to_do>

---

<notes_on_ai_pitfalls>

- **Three.js APIs change between versions.** If you are writing this after [current date], verify the imports — some items have moved in/out of `three/examples/jsm/...` over time. Run a small test script first to confirm imports resolve before building the whole scene.
- **PBR materials need correct color space.** Set `renderer.outputColorSpace = SRGBColorSpace` (or the current equivalent if the API has changed). Without this, white will look grey and turquoise will look wrong.
- **Resize handling is easy to forget.** On `window.resize`, update camera aspect, renderer size, composer size, and re-call `updateProjectionMatrix()` on the camera. Throttle the handler to avoid thrashing.
- **SVG parsing is finicky.** The SVGLoader output depends on how the SVG is authored. If paths come back with unexpected orientation, winding order, or holes, inspect them before assuming something else is wrong.
- **Don't over-optimize prematurely.** Write the scene working first with plain `render()` calls in the animation loop. Add code splitting, dynamic imports, and performance tuning only after functionality is confirmed.
- **Don't second-guess the materials spec.** If the letters look "too plain" or "not shiny enough" — that is correct. Satin is the design decision. Do not crank up `envMapIntensity` or reduce `roughness` to "make it pop." It is not meant to pop.

</notes_on_ai_pitfalls>

---

<acceptance_criteria>

Phase 2 is complete when all of the following are true:

1. `npm run dev` starts with no errors. Opening `http://localhost:4321` shows the dark background with dot grid (Phase 1) and, centered in the viewport, the FINNVEK wordmark in 3D with emissive turquoise dots and a satin white platform beneath.
2. The intro animation plays on page load: platform fades in, letters appear one by one with scale+fade, dots ignite (emissive ramps up with bloom) after the letters are in place.
3. On desktop, moving the mouse causes the logo to rotate gently toward the cursor with smooth lerped motion. Rotation is subtle — max ~8° horizontally.
4. On mobile (or when emulating touch in devtools), there is no parallax but the intro animation still plays.
5. The scene is transparent — the Phase 1 dot grid is visible behind and around the logo.
6. In a browser with WebGL disabled (Chrome flag), the fallback SVG renders in place of the canvas. Page still looks acceptable.
7. With `prefers-reduced-motion: reduce` set (OS-level or devtools emulation), the intro animation is skipped — the scene appears in its final state immediately. Parallax still works.
8. `npm run build` completes without errors. Three.js is code-split into a separate chunk (verify in `dist/` output).
9. Lighthouse Performance score on the built output ≥ 90 (Performance budget met).
10. On a 4x CPU throttle + Fast 3G network in devtools, the scene is interactive within 3 seconds.
11. No console errors in any of: page load, scene initialization, parallax, resize, unload.
12. The brand mark is announced as "Finnvek" by VoiceOver / NVDA. Canvas is `aria-hidden`.
13. Git: all work on branch `v2`. Commits are small (suggested: one commit per subsystem — "feat: svg loading", "feat: materials", "feat: lighting", "feat: intro animation", "feat: parallax", etc.).

If any criterion fails, stop and report. Do not "fix" by disabling the check.

</acceptance_criteria>

---

<deliverable_summary>

After Phase 2, Emma should see:

- Dark page with dot grid (unchanged from Phase 1)
- Centered 3D rendering of the FINNVEK wordmark, satin white, emissive turquoise dots, on an elliptical platform
- Smooth intro animation on load
- Gentle mouse-follow parallax on desktop
- Static but still 3D on mobile
- Clean fallback on no-WebGL browsers
- Nothing else on the page

When reporting completion, include:
- Build size breakdown (JS, CSS, assets per file)
- Lighthouse results
- Any deviations from spec and reasons
- Any open questions for Phase 3

</deliverable_summary>
