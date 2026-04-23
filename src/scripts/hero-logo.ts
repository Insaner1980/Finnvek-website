import {
  Box3,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type MeshStandardMaterial,
} from 'three';
import { SVGLoader, type SVGResult } from 'three/examples/jsm/loaders/SVGLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import {
  createDotMaterial,
  createLetterMaterial,
  createPlatformMaterial,
} from './hero-materials';
import { setupLights } from './hero-lighting';
import {
  createIntro,
  createParallax,
  prefersReducedMotion,
} from './hero-animation';

const WORDMARK_URL = '/finnvek-wordmark.svg';
const TARGET_WIDTH = 16;
const EXTRUDE_DEPTH = 12;
const DOT_Z_OFFSET = 6;
const LOGO_TILT = -Math.PI / 15;

export interface HeroScene {
  dispose: () => void;
}

interface Circle {
  cx: number;
  cy: number;
  r: number;
}

export function canRunHero(canvas: HTMLCanvasElement): boolean {
  try {
    const ctx = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!ctx) return false;
  } catch {
    return false;
  }
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency < 4
  ) {
    return false;
  }
  return true;
}

export async function initHeroLogo(canvas: HTMLCanvasElement): Promise<HeroScene | null> {
  if (!canRunHero(canvas)) return null;

  const response = await fetch(WORDMARK_URL);
  if (!response.ok) return null;
  const svgText = await response.text();

  const circles = extractCircles(svgText);
  const svgData: SVGResult = new SVGLoader().parse(svgText);
  const pathEntries = svgData.paths.filter((p) => {
    const node = (p.userData as { node?: Element } | undefined)?.node;
    return !node || node.nodeName.toLowerCase() !== 'circle';
  });

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 18);
  camera.lookAt(0, 0, 0);

  setupLights(scene, renderer);

  const svgBbox = computeSvgBbox(pathEntries, circles);
  const svgCenter = new Vector3(
    (svgBbox.minX + svgBbox.maxX) / 2,
    (svgBbox.minY + svgBbox.maxY) / 2,
    0,
  );
  const svgWidth = svgBbox.maxX - svgBbox.minX;
  const scale = TARGET_WIDTH / svgWidth;

  const letterContainer = new Group();
  const letterGroups: Group[] = [];
  const letterMaterials: MeshStandardMaterial[] = [];

  for (const pathEntry of pathEntries) {
    const shapes = SVGLoader.createShapes(pathEntry);
    if (shapes.length === 0) continue;

    const geometry = new ExtrudeGeometry(shapes, {
      depth: EXTRUDE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.3,
      bevelSegments: 4,
      curveSegments: 8,
    });
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox ?? new Box3();
    const center = bbox.getCenter(new Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const letterMat = createLetterMaterial();
    letterMaterials.push(letterMat);

    const mesh = new Mesh(geometry, letterMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const letterGroup = new Group();
    letterGroup.add(mesh);
    letterGroup.position.set(
      center.x - svgCenter.x,
      center.y - svgCenter.y,
      center.z,
    );

    letterContainer.add(letterGroup);
    letterGroups.push(letterGroup);
  }

  const dotMat = createDotMaterial();
  const dotMeshes: Mesh[] = [];
  for (const c of circles) {
    const dotGeo = new SphereGeometry(c.r, 32, 32);
    const dotMesh = new Mesh(dotGeo, dotMat);
    dotMesh.castShadow = true;
    dotMesh.position.set(c.cx - svgCenter.x, c.cy - svgCenter.y, DOT_Z_OFFSET);
    letterContainer.add(dotMesh);
    dotMeshes.push(dotMesh);
  }

  letterContainer.scale.set(scale, -scale, scale);

  const platformGeo = new CylinderGeometry(12, 12, 0.6, 64);
  const platformMat = createPlatformMaterial();
  const platform = new Mesh(platformGeo, platformMat);
  platform.scale.set(1.0, 1.0, 0.4);
  platform.position.set(0, -1.5, 0);
  platform.receiveShadow = true;
  platform.castShadow = true;

  const logoGroup = new Group();
  logoGroup.add(letterContainer);
  logoGroup.add(platform);
  logoGroup.rotation.x = LOGO_TILT;
  scene.add(logoGroup);

  const mobile = isMobile();
  const bloomSize = new Vector2(
    Math.max(1, window.innerWidth * (mobile ? 0.5 : 1)),
    Math.max(1, window.innerHeight * (mobile ? 0.5 : 1)),
  );
  const composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(bloomSize, 0, 0.4, 0.85);
  composer.addPass(bloom);

  const reducedMotion = prefersReducedMotion();
  const intro = createIntro(
    {
      canvas,
      logoGroup,
      platform,
      platformMaterial: platformMat,
      letterGroups,
      letterMaterials,
      dotMaterial: dotMat,
      bloom,
    },
    reducedMotion,
  );
  const parallax = createParallax(logoGroup);

  let resizeRaf = 0;
  const onResize = (): void => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.setSize(w * (mobile ? 0.5 : 1), h * (mobile ? 0.5 : 1));
    });
  };
  window.addEventListener('resize', onResize, { passive: true });

  let running = true;
  const startTime = performance.now();
  const loop = (): void => {
    if (!running) return;
    const elapsed = (performance.now() - startTime) / 1000;
    intro.tick(elapsed);
    parallax.tick();
    composer.render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return {
    dispose: () => {
      running = false;
      window.removeEventListener('resize', onResize);
      parallax.dispose();
      composer.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        const meshLike = obj as Mesh;
        if (meshLike.geometry) meshLike.geometry.dispose();
        if (meshLike.material) {
          const m = meshLike.material as Material | Material[];
          if (Array.isArray(m)) m.forEach((mi) => mi.dispose());
          else m.dispose();
        }
      });
    },
  };
}

function extractCircles(svgText: string): Circle[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  return Array.from(doc.querySelectorAll('circle')).map((c) => ({
    cx: parseFloat(c.getAttribute('cx') ?? '0'),
    cy: parseFloat(c.getAttribute('cy') ?? '0'),
    r: parseFloat(c.getAttribute('r') ?? '0'),
  }));
}

interface SvgBbox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function computeSvgBbox(
  paths: SVGResult['paths'],
  circles: Circle[],
): SvgBbox {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of paths) {
    for (const shape of SVGLoader.createShapes(p)) {
      const points = shape.extractPoints(24).shape;
      for (const pt of points) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }
    }
  }
  for (const c of circles) {
    if (c.cx - c.r < minX) minX = c.cx - c.r;
    if (c.cx + c.r > maxX) maxX = c.cx + c.r;
    if (c.cy - c.r < minY) minY = c.cy - c.r;
    if (c.cy + c.r > maxY) maxY = c.cy + c.r;
  }
  return { minX, maxX, minY, maxY };
}

function isMobile(): boolean {
  return window.matchMedia('(max-width: 640px)').matches;
}
