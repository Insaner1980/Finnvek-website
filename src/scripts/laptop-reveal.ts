import gsap from 'gsap';

// Kursorin alta paljastuva koodikerros läppärin ruudulla. Tasainen koodinäkymä
// venytetään ruudun perspektiiviin matrix3d-muunnoksella ja leikataan ruudun
// muotoon; näkyviin tulee vain pehmeäreunainen linssi kursorin kohdalla.

type Point = readonly [number, number];

// Ruudun kulmat lähdekuvan pikseleinä (laptop-blank-screen.png), mitattu
// valkoisen kehyksen ja tumman ruudun rajalta.
const SCREEN_QUAD: Record<'tl' | 'tr' | 'br' | 'bl', Point> = {
  tl: [538.7, 78.2],
  tr: [1387.3, 110.0],
  br: [1306.5, 747.2],
  bl: [481.3, 592.7],
};

// Tasaisen koodinäkymän koko ennen perspektiivimuunnosta (16:10 kuten näyttö).
const PLANE_WIDTH = 1000;
const PLANE_HEIGHT = 625;

// Linssin säde suhteessa kuvan leveyteen.
const LENS_RADIUS = 0.11;
const PEEK_DELAY = 2.6;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Projektiivinen muunnos, joka vie suorakulmion (0,0)–(w,h) neljään pisteeseen
// (Heckbertin neliö–nelikulmio-ratkaisu), CSS:n matrix3d-muodossa.
const quadToMatrix3d = (w: number, h: number, [p0, p1, p2, p3]: Point[]) => {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;

  return `matrix3d(${[
    a / w, d / w, 0, g / w,
    b / h, e / h, 0, hh / h,
    0, 0, 1, 0,
    x0, y0, 0, 1,
  ].join(',')})`;
};

const setupLaptopReveal = () => {
  const host = document.querySelector<HTMLElement>('.hero-laptop');
  const layer = document.querySelector<HTMLElement>('[data-laptop-reveal]');
  const plane = layer?.querySelector<HTMLElement>('[data-laptop-reveal-plane]');
  const sourceWidth = Number(layer?.dataset.sourceWidth);
  if (!host || !layer || !plane || !sourceWidth) return;

  const lens = { x: 0, y: 0, r: 0 };
  let lensRadius = 0;
  let lensOpen = false;

  const render = () => {
    layer.style.setProperty('--lens-x', `${lens.x}px`);
    layer.style.setProperty('--lens-y', `${lens.y}px`);
    layer.style.setProperty('--lens-r', `${lens.r}px`);
  };

  const layout = () => {
    const scale = host.clientWidth / sourceWidth;
    const corners = [SCREEN_QUAD.tl, SCREEN_QUAD.tr, SCREEN_QUAD.br, SCREEN_QUAD.bl]
      .map(([x, y]) => [x * scale, y * scale] as const);

    plane.style.width = `${PLANE_WIDTH}px`;
    plane.style.height = `${PLANE_HEIGHT}px`;
    plane.style.transform = quadToMatrix3d(PLANE_WIDTH, PLANE_HEIGHT, corners);
    layer.style.clipPath = `polygon(${corners.map(([x, y]) => `${x}px ${y}px`).join(',')})`;
    lensRadius = host.clientWidth * LENS_RADIUS;
  };

  layout();
  render();
  new ResizeObserver(layout).observe(host);

  const moveX = gsap.quickTo(lens, 'x', { duration: 0.45, ease: 'power3.out', onUpdate: render });
  const moveY = gsap.quickTo(lens, 'y', { duration: 0.45, ease: 'power3.out', onUpdate: render });
  const showLens = (visible: boolean) =>
    gsap.to(lens, {
      r: visible ? lensRadius : 0,
      duration: visible ? 0.45 : 0.35,
      ease: visible ? 'power3.out' : 'power2.in',
      overwrite: 'auto',
      onUpdate: render,
    });

  // Sweep once after loading to hint at the interactive reveal.
  let peek: gsap.core.Timeline | null = null;
  if (!prefersReducedMotion) {
    const scale = () => host.clientWidth / sourceWidth;
    peek = gsap.timeline({ delay: PEEK_DELAY, onUpdate: render });
    peek
      .set(lens, { x: () => 600 * scale(), y: () => 330 * scale() })
      .to(lens, { r: () => lensRadius, duration: 0.5, ease: 'power2.out' })
      .to(lens, { x: () => 1000 * scale(), y: () => 300 * scale(), duration: 1.6, ease: 'sine.inOut' }, '<')
      .to(lens, { r: 0, duration: 0.45, ease: 'power2.in' }, '-=0.35');
  }

  let touchHide: gsap.core.Tween | null = null;
  const revealAtPointer = (event: PointerEvent) => {
    touchHide?.kill();
    touchHide = null;
    if (peek) {
      peek.kill();
      peek = null;
    }
    const rect = host.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (prefersReducedMotion || event.pointerType === 'touch') {
      gsap.killTweensOf(lens);
      lensOpen = true;
      Object.assign(lens, { x, y, r: lensRadius });
      render();
      return;
    }
    // Suljettu linssi aukeaa suoraan kursorin kohdalle eikä liu'u sinne.
    if (!lensOpen) {
      lensOpen = true;
      gsap.set(lens, { x, y });
      showLens(true);
    }
    moveX(x);
    moveY(y);
  };

  const hideLens = () => {
    touchHide?.kill();
    touchHide = null;
    lensOpen = false;
    if (prefersReducedMotion) {
      lens.r = 0;
      render();
      return;
    }
    showLens(false);
  };

  host.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') revealAtPointer(event);
  });
  host.addEventListener('pointermove', revealAtPointer);
  host.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return;
    // Keep the code visible briefly after the finger no longer covers it.
    touchHide = gsap.delayedCall(1.2, hideLens);
  });
  host.addEventListener('pointercancel', hideLens);
  host.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'touch') hideLens();
  });
};

setupLaptopReveal();
