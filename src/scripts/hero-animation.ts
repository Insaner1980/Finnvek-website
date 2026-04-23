import type { Group, Mesh, MeshStandardMaterial } from 'three';
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export interface IntroSubjects {
  canvas: HTMLCanvasElement;
  logoGroup: Group;
  platform: Mesh;
  platformMaterial: MeshStandardMaterial;
  letterGroups: Group[];
  letterMaterials: MeshStandardMaterial[];
  dotMaterial: MeshStandardMaterial;
  bloom: UnrealBloomPass;
}

export interface IntroController {
  tick: (elapsed: number) => void;
  isComplete: () => boolean;
}

const CANVAS_FADE_DUR = 0.3;
const PLATFORM_START = 0.2;
const PLATFORM_DUR = 0.4;
const LETTERS_START = 0.4;
const LETTER_STAGGER = 0.08;
const LETTER_DUR = 0.5;
const DOTS_START = 1.2;
const DOTS_DUR = 0.5;
const TARGET_DOT_INTENSITY = 1.8;
const TARGET_BLOOM = 0.6;
const INTRO_END = DOTS_START + DOTS_DUR;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

function snapToFinalState(s: IntroSubjects): void {
  s.platformMaterial.opacity = 1;
  s.platformMaterial.transparent = false;
  s.platformMaterial.needsUpdate = true;
  for (let i = 0; i < s.letterGroups.length; i++) {
    s.letterGroups[i].scale.setScalar(1);
    s.letterMaterials[i].opacity = 1;
    s.letterMaterials[i].transparent = false;
    s.letterMaterials[i].needsUpdate = true;
  }
  s.dotMaterial.emissiveIntensity = TARGET_DOT_INTENSITY;
  s.bloom.strength = TARGET_BLOOM;
}

export function createIntro(
  s: IntroSubjects,
  reducedMotion: boolean
): IntroController {
  // Start from pre-intro state.
  s.canvas.style.opacity = '0';
  s.platformMaterial.opacity = 0;
  for (let i = 0; i < s.letterGroups.length; i++) {
    s.letterGroups[i].scale.setScalar(0.7);
    s.letterMaterials[i].opacity = 0;
  }
  s.dotMaterial.emissiveIntensity = 0;
  s.bloom.strength = 0;

  if (reducedMotion) {
    snapToFinalState(s);
    // Only the canvas still fades in smoothly; the scene itself is static.
    let canvasDone = false;
    return {
      tick: (elapsed: number): void => {
        if (canvasDone) return;
        const u = clamp01(elapsed / CANVAS_FADE_DUR);
        s.canvas.style.opacity = String(u);
        if (u >= 1) canvasDone = true;
      },
      isComplete: () => canvasDone,
    };
  }

  let done = false;

  const tick = (elapsed: number): void => {
    if (done) return;

    s.canvas.style.opacity = String(clamp01(elapsed / CANVAS_FADE_DUR));

    if (elapsed >= PLATFORM_START) {
      const u = clamp01((elapsed - PLATFORM_START) / PLATFORM_DUR);
      s.platformMaterial.opacity = easeOutCubic(u);
    }

    for (let i = 0; i < s.letterGroups.length; i++) {
      const start = LETTERS_START + i * LETTER_STAGGER;
      if (elapsed < start) continue;
      const u = clamp01((elapsed - start) / LETTER_DUR);
      const e = easeOutCubic(u);
      s.letterGroups[i].scale.setScalar(0.7 + e * 0.3);
      s.letterMaterials[i].opacity = e;
    }

    if (elapsed >= DOTS_START) {
      const u = clamp01((elapsed - DOTS_START) / DOTS_DUR);
      const e = easeInOutCubic(u);
      s.dotMaterial.emissiveIntensity = TARGET_DOT_INTENSITY * e;
      s.bloom.strength = TARGET_BLOOM * e;
    }

    if (elapsed >= INTRO_END) {
      snapToFinalState(s);
      done = true;
    }
  };

  return { tick, isComplete: () => done };
}

export interface ParallaxController {
  tick: () => void;
  dispose: () => void;
}

export function createParallax(logoGroup: Group): ParallaxController {
  const BASE_TILT_X = -Math.PI / 15;
  const MAX_Y = 0.15;
  const MAX_X_OFFSET = 0.08;
  const LERP = 0.08;

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isNarrow = window.matchMedia('(max-width: 640px)').matches;

  let targetY = 0;
  let targetX = BASE_TILT_X;

  const onMove = (e: MouseEvent): void => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    targetY = nx * MAX_Y;
    targetX = BASE_TILT_X + ny * -MAX_X_OFFSET;
  };

  if (!isTouch && !isNarrow) {
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  const tick = (): void => {
    logoGroup.rotation.y += (targetY - logoGroup.rotation.y) * LERP;
    logoGroup.rotation.x += (targetX - logoGroup.rotation.x) * LERP;
  };

  const dispose = (): void => {
    window.removeEventListener('mousemove', onMove);
  };

  return { tick, dispose };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
