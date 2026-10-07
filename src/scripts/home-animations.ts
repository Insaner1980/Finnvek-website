import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const siteFooter = document.querySelector<HTMLElement>('.site-footer');
const appGrid = document.querySelector<HTMLElement>('[data-app-grid]');
const appTriggers = Array.from(document.querySelectorAll<HTMLElement>('[data-app-trigger]'));
const sectionLines = Array.from(document.querySelectorAll<HTMLElement>('[data-section-line]'));
const notifyForm = document.querySelector<HTMLFormElement>('[data-notify-form]');

const API_ENDPOINT = 'https://api.finnvek.com/subscribe';
const SUBSCRIBE_TIMEOUT_MS = 10000;

const setupNotifyForm = () => {
  if (!notifyForm) return;

  const submitBtn = notifyForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  const emailInput = notifyForm.querySelector<HTMLInputElement>('input[name="email"]');
  const honeypot = notifyForm.querySelector<HTMLInputElement>('input[name="website"]');
  const errorEl = document.querySelector<HTMLElement>('[data-notify-error]');
  const originalBtnText = submitBtn?.textContent ?? 'Notify me at launch';

  if (emailInput) emailInput.disabled = false;
  if (honeypot) honeypot.disabled = false;
  if (submitBtn) submitBtn.disabled = false;

  const showError = (message: string) => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  };

  const hideError = () => {
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  };

  notifyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!notifyForm.reportValidity()) return;

    hideError();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    let success = false;
    let errorMessage = 'Something went wrong. Please try again.';

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), SUBSCRIBE_TIMEOUT_MS);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          email: emailInput?.value.trim() ?? '',
          source: 'finnvek',
          website: honeypot?.value ?? '',
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      const responseData = typeof data === 'object' && data !== null
        ? data as Record<string, unknown>
        : {};
      if (res.ok && responseData.success === true) {
        success = true;
      } else if (typeof responseData.error === 'string' && responseData.error) {
        errorMessage = responseData.error;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = 'Network error. Please check your connection.';
      }
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (!success) {
      showError(errorMessage);
      return;
    }

    const finalize = () => {
      const message = document.createElement('span');
      message.setAttribute('role', 'status');
      message.textContent = "You're in!";
      notifyForm.replaceChildren(message);
      notifyForm.classList.add('is-complete');
    };

    if (prefersReducedMotion) {
      finalize();
      return;
    }

    const controls = Array.from(notifyForm.children) as HTMLElement[];

    gsap
      .timeline()
      .to(controls, {
        autoAlpha: 0,
        y: -6,
        duration: 0.16,
        stagger: 0.03,
        ease: 'power1.out',
      })
      .add(finalize)
      .fromTo(notifyForm, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' });
  });
};

const setupIntroMotion = () => {
  if (prefersReducedMotion) return;

  gsap.to('.hero-scroll-link svg', {
    y: 6, duration: 0.65, delay: 1, repeat: 3, yoyo: true, ease: 'sine.inOut',
  });
  gsap.fromTo('.hero-heading', { autoAlpha: 0, y: 18 }, {
    autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out',
  });
  gsap.fromTo('.hero-laptop', { autoAlpha: 0, y: 28 }, {
    autoAlpha: 1, y: 0, duration: 1.1, delay: 0.12, ease: 'power2.out',
  });
  // Ruudun käsialarivit piirtyvät vasemmalta oikealle kuten allekirjoitus.
  gsap.fromTo('.laptop-note > *', { clipPath: 'inset(-30% 100% -30% 0)' }, {
    clipPath: 'inset(-30% 0% -30% 0)', duration: 0.7, delay: 0.95, stagger: 0.4, ease: 'power1.inOut',
  });
  // Esittely tulee esiin, ja lopuksi allekirjoitus piirtyy vasemmalta oikealle.
  gsap.timeline({ scrollTrigger: { trigger: '.home-about', start: 'top 85%', once: true } })
    .fromTo('.home-about p', { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out',
    })
    .fromTo('.home-about-signature', { clipPath: 'inset(-20% 100% -20% 0)' }, {
      clipPath: 'inset(-20% 0% -20% 0)', duration: 1.15, ease: 'power1.inOut',
    }, '-=0.2');
};

const setupSectionLines = () => {
  if (sectionLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(sectionLines, { scaleX: 1 });
    return;
  }

  sectionLines.forEach((line) => {
    gsap.set(line, { scaleX: 0 });
    let maxProgress = 0;

    ScrollTrigger.create({
      trigger: line,
      start: 'top bottom',
      end: 'top 40%',
      onUpdate: (self) => {
        if (self.progress > maxProgress) {
          maxProgress = self.progress;
          gsap.set(line, { scaleX: maxProgress });
        }
      },
    });
  });
};

const getSignalLogoParts = (logo: HTMLElement) => {
  const ticks = Array.from(logo.querySelectorAll<SVGRectElement>('[data-logo-signal-tick]'));
  const letterD = logo.querySelector<SVGPathElement>('[data-logo-signal-letter="d"]');
  const letterB = logo.querySelector<SVGPathElement>('[data-logo-signal-letter="b"]');
  const divider = logo.querySelector<SVGRectElement>('[data-logo-signal-divider]');
  const letters = [letterD, letterB].filter((letter): letter is SVGPathElement => Boolean(letter));

  return {
    ticks,
    letterD,
    letterB,
    letters,
    divider,
    all: [...ticks, ...letters, ...(divider ? [divider] : [])],
  };
};

type SignalLogoParts = ReturnType<typeof getSignalLogoParts>;

const getRuncheckLogoParts = (logo: HTMLElement) => ({
  hook: logo.querySelector<SVGGElement>('.rc-hook'),
  arrow: logo.querySelector<SVGGElement>('.rc-arrow'),
  svg: logo.querySelector<SVGSVGElement>('svg'),
});

type RuncheckLogoParts = ReturnType<typeof getRuncheckLogoParts>;

// The fonecheck wordmark is one SVG with three paths in order: "fone", the
// orange rule and "check". The reveal mirrors the fonecheck.app intro.
const getFonecheckLogoParts = (logo: HTMLElement) => {
  const [fone, rule, check] = Array.from(logo.querySelectorAll<SVGPathElement>('path'));
  return { fone, rule, check };
};

type FonecheckLogoParts = ReturnType<typeof getFonecheckLogoParts>;

const hasFonecheckParts = (parts: FonecheckLogoParts | null): parts is FonecheckLogoParts =>
  Boolean(parts?.fone && parts.rule && parts.check);

const setInitialFonecheckLogoState = (logo: HTMLElement, parts: FonecheckLogoParts) => {
  // The pieces start outside the SVG box, so it must not clip them.
  gsap.set(logo, { autoAlpha: 1, overflow: 'visible' });
  gsap.set(parts.fone, { autoAlpha: 0, x: -170 });
  gsap.set(parts.check, { autoAlpha: 0, x: 170 });
  gsap.set(parts.rule, { scaleX: 0, transformOrigin: '50% 50%' });
};

const addFonecheckLogoReveal = (timeline: gsap.core.Timeline, parts: FonecheckLogoParts) => {
  timeline.to(parts.fone, { autoAlpha: 1, x: 0, duration: 1.05, ease: 'expo.out' }, 0.1);
  timeline.to(parts.check, { autoAlpha: 1, x: 0, duration: 1.05, ease: 'expo.out' }, 0.19);
  timeline.to(parts.rule, { scaleX: 1, duration: 0.56, ease: 'power2.inOut' }, 0.92);
};

const showAppWithoutMotion = (
  logo: HTMLElement | null,
  name: HTMLElement | null,
  signalParts: SignalLogoParts | null,
) => {
  if (logo) gsap.set(logo, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotation: 0 });
  if (signalParts) gsap.set(signalParts.all, { autoAlpha: 1, scale: 1, scaleY: 1, x: 0 });
  if (name) gsap.set(name, { autoAlpha: 1, y: 0 });
};

const setInitialProductLogoState = (
  logo: HTMLElement | null,
  logoRolls: boolean,
  logoSignals: boolean,
  signalParts: SignalLogoParts | null,
) => {
  if (!logo) return;

  if (logoRolls) {
    gsap.set(logo, { autoAlpha: 0, x: 150, rotation: 240, transformOrigin: 'center center' });
    return;
  }
  if (logoSignals && signalParts) {
    gsap.set(logo, { autoAlpha: 0, scale: 0.94, rotation: -4, transformOrigin: 'center center' });
    gsap.set(signalParts.divider, { autoAlpha: 0, scaleY: 0.16, transformOrigin: '50% 50%' });
    gsap.set(signalParts.letterD, { autoAlpha: 0, scale: 0.82, x: 18, transformOrigin: '50% 50%' });
    gsap.set(signalParts.letterB, { autoAlpha: 0, scale: 0.82, x: -18, transformOrigin: '50% 50%' });
    gsap.set(signalParts.ticks, { autoAlpha: 0, scaleY: 0.18, transformOrigin: '50% 50%' });
    return;
  }
  gsap.set(logo, { autoAlpha: 0, scale: 0.98, transformOrigin: 'center center' });
};

const addProductLogoReveal = (
  timeline: gsap.core.Timeline,
  logo: HTMLElement | null,
  logoRolls: boolean,
  logoSignals: boolean,
  signalParts: SignalLogoParts | null,
) => {
  if (!logo) return;

  if (logoRolls) {
    timeline.to(logo, { autoAlpha: 1, duration: 0.35, ease: 'none' }, 0.1);
    timeline.to(logo, { x: 0, rotation: 0, duration: 1.6, ease: 'power2.out' }, 0.1);
    return;
  }
  if (logoSignals && signalParts) {
    timeline.to(logo, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.78, ease: 'power3.out' }, 0.1);
    timeline.to(signalParts.divider, { autoAlpha: 1, scaleY: 1, duration: 0.56, ease: 'back.out(1.8)' }, 0.14);
    timeline.to(
      signalParts.letters,
      { autoAlpha: 1, scale: 1, x: 0, duration: 0.64, ease: 'back.out(1.7)', stagger: 0.07 },
      0.24,
    );
    timeline.to(
      signalParts.ticks,
      { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 },
      0.42,
    );
    return;
  }
  timeline.to(logo, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.1);
};

const getProductNameRevealStart = (
  logoRuncheck: boolean,
  logoRolls: boolean,
  logoSignals: boolean,
) => {
  if (logoRuncheck) return 0.95;
  if (logoRolls) return 0.9;
  if (logoSignals) return 0.82;
  return 0.55;
};

const showRuncheckWithoutMotion = (parts: RuncheckLogoParts | null) => {
  if (!parts) return;
  gsap.set([parts.hook, parts.arrow].filter(Boolean), { autoAlpha: 1, y: 0 });
};

const setInitialProductLogoRevealState = (
  logo: HTMLElement | null,
  logoRuncheck: boolean,
  logoRolls: boolean,
  logoSignals: boolean,
  signalParts: SignalLogoParts | null,
  runcheckParts: RuncheckLogoParts | null,
) => {
  if (logoRuncheck && runcheckParts?.hook && runcheckParts.arrow) {
    gsap.set(logo, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotation: 0 });
    gsap.set(runcheckParts.hook, { autoAlpha: 0, y: -58 });
    gsap.set(runcheckParts.arrow, { autoAlpha: 0, y: 620 });
    return;
  }
  setInitialProductLogoState(logo, logoRolls, logoSignals, signalParts);
};

const addRuncheckLogoReveal = (
  timeline: gsap.core.Timeline,
  parts: RuncheckLogoParts,
) => {
  if (!parts.hook || !parts.arrow) return false;

  timeline.to(parts.hook, {
    autoAlpha: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
  }, 0.1);
  timeline.to(parts.arrow, {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
  }, 0.3);
  if (parts.svg) {
    timeline.to(parts.svg, {
      filter: 'drop-shadow(0 0 1.9rem rgba(57, 167, 228, 0.85))',
      duration: 0.65,
      ease: 'sine.inOut',
    }, 0.95);
    timeline.to(parts.svg, {
      filter: 'drop-shadow(0 0 0.85rem rgba(57, 167, 228, 0.45))',
      duration: 0.85,
      ease: 'sine.inOut',
    }, 1.6);
  }
  return true;
};

const addProductLogoRevealToTimeline = (
  timeline: gsap.core.Timeline,
  logo: HTMLElement | null,
  logoRolls: boolean,
  logoSignals: boolean,
  signalParts: SignalLogoParts | null,
  runcheckParts: RuncheckLogoParts | null,
) => {
  if (runcheckParts && addRuncheckLogoReveal(timeline, runcheckParts)) return;
  addProductLogoReveal(timeline, logo, logoRolls, logoSignals, signalParts);
};

const POLAROID_STAGGER = 0.14;
const POLAROID_LOGO_DELAY = 0.4;

// Polaroidin kallistus tulee CSS-muuttujasta, jotta se on sama ilman JavaScriptiäkin.
const getTilt = (el: HTMLElement) => Number.parseFloat(getComputedStyle(el).getPropertyValue('--tilt')) || 0;

// Builds one app's logo and label reveal as its own timeline, so the grid can
// pop the icons in one by one and let each logo play its own intro.
const createAppLogoTimeline = (trigger: HTMLElement) => {
  const logo = trigger.querySelector<HTMLElement>('[data-app-logo]');
  const name = trigger.querySelector<HTMLElement>('.polaroid-caption');
  const logoSignals = logo?.dataset.logoSignal !== undefined;
  const signalParts = logo && logoSignals ? getSignalLogoParts(logo) : null;
  const logoRuncheck = logo?.dataset.logoRuncheck !== undefined;
  const runcheckParts = logo && logoRuncheck ? getRuncheckLogoParts(logo) : null;
  const fonecheckParts = logo && logo.dataset.logoFonecheck !== undefined ? getFonecheckLogoParts(logo) : null;
  const logoRolls = logo?.dataset.logoRoll !== undefined;

  if (prefersReducedMotion) {
    showAppWithoutMotion(logo, name, signalParts);
    showRuncheckWithoutMotion(runcheckParts);
    return null;
  }

  const tl = gsap.timeline();

  if (logo && hasFonecheckParts(fonecheckParts)) {
    setInitialFonecheckLogoState(logo, fonecheckParts);
    addFonecheckLogoReveal(tl, fonecheckParts);
  } else {
    setInitialProductLogoRevealState(logo, logoRuncheck, logoRolls, logoSignals, signalParts, runcheckParts);
    addProductLogoRevealToTimeline(tl, logo, logoRolls, logoSignals, signalParts, runcheckParts);
  }

  // Kuvateksti piirtyy vasemmalta oikealle kuin se kirjoitettaisiin.
  if (name) {
    gsap.set(name, { clipPath: 'inset(-30% 100% -30% 0)' });
    tl.to(name, { clipPath: 'inset(-30% 0% -30% 0)', duration: 0.6, ease: 'power1.inOut' }, getProductNameRevealStart(logoRuncheck, logoRolls, logoSignals));
  }

  return tl;
};

const setupAppReveals = () => {
  if (!appGrid || appTriggers.length === 0) return;

  const logoTimelines = appTriggers.map(createAppLogoTimeline);
  if (prefersReducedMotion) return;

  const page = gsap.timeline({
    scrollTrigger: { trigger: appGrid, start: 'top 80%', once: true },
  });

  appTriggers.forEach((trigger, index) => {
    const card = trigger.querySelector<HTMLElement>('[data-app-card]');
    const tape = trigger.querySelector<HTMLElement>('[data-polaroid-tape]');
    const at = index * POLAROID_STAGGER;
    const logoTimeline = logoTimelines[index];

    // Polaroid pudotetaan sivulle ja asettuu omaan kulmaansa; teippi painetaan päälle.
    if (card) {
      const tilt = getTilt(card);
      page.fromTo(
        card,
        { autoAlpha: 0, y: -32, scale: 1.06, rotation: tilt + (index % 2 === 0 ? -8 : 8) },
        { autoAlpha: 1, y: 0, scale: 1, rotation: tilt, duration: 0.65, ease: 'back.out(1.3)' },
        at,
      );
    }
    if (tape) {
      page.fromTo(
        tape,
        { autoAlpha: 0, clipPath: 'inset(0% 100% 0% 0%)' },
        { autoAlpha: 0.92, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, ease: 'power2.out' },
        at + 0.45,
      );
    }
    if (logoTimeline) page.add(logoTimeline, at + POLAROID_LOGO_DELAY);
  });

  // Lopuksi sivun kulmaan kirjoitetaan yhteinen huomautus.
  const note = document.querySelector<HTMLElement>('[data-notebook-note]');
  if (note) {
    page.fromTo(note, { clipPath: 'inset(-30% 100% -30% 0)' }, {
      clipPath: 'inset(-30% 0% -30% 0)', duration: 0.9, ease: 'power1.inOut',
    }, appTriggers.length * POLAROID_STAGGER + 0.9);
  }
};

const setupLogoMotion = () => {
  if (prefersReducedMotion) return;

  document.querySelectorAll<HTMLElement>('[data-logo-signal]').forEach((logo) => {
    const lockup = logo.closest<HTMLElement>('[data-app-trigger]');
    const parts = getSignalLogoParts(logo);
    if (!lockup || parts.all.length === 0) return;
    let signalTl: gsap.core.Timeline | null = null;

    const playSignal = () => {
      signalTl?.kill();
      gsap.killTweensOf(parts.all);
      gsap.set(parts.all, { autoAlpha: 1, scale: 1, scaleY: 1, x: 0 });

      signalTl = gsap.timeline();
      signalTl.to(parts.ticks, { scaleY: 1.22, duration: 0.14, ease: 'power2.out', stagger: 0.04 }, 0);
      if (parts.letterD) signalTl.to(parts.letterD, { x: -8, duration: 0.18, ease: 'power2.out' }, 0);
      if (parts.letterB) signalTl.to(parts.letterB, { x: 8, duration: 0.18, ease: 'power2.out' }, 0);
      if (parts.divider) signalTl.to(parts.divider, { scaleY: 1.08, duration: 0.16, ease: 'power2.out' }, 0);
      signalTl.to(parts.ticks, { scaleY: 1, duration: 0.36, ease: 'back.out(2.2)', stagger: 0.035 }, 0.12);
      signalTl.to(
        parts.letters,
        { x: 0, duration: 0.46, ease: 'back.out(2.8)', stagger: 0.025 },
        0.14,
      );
      if (parts.divider) signalTl.to(parts.divider, { scaleY: 1, duration: 0.4, ease: 'back.out(2.4)' }, 0.14);
    };

    lockup.addEventListener('mouseenter', playSignal);
    lockup.addEventListener('focus', playSignal);
    lockup.addEventListener('mouseleave', () => {
      signalTl?.kill();
      signalTl = null;
      gsap.to(parts.ticks, { scaleY: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
      gsap.to(parts.letters, { x: 0, duration: 0.22, ease: 'power2.out', overwrite: true });
      gsap.to(parts.divider, { scaleY: 1, duration: 0.22, ease: 'power2.out', overwrite: true });
    });
  });
};

const setupFooterReveal = () => {
  if (!siteFooter) return;

  const wordmark = siteFooter.querySelector<HTMLElement>('.footer-wordmark');
  const tagline = siteFooter.querySelector<HTMLElement>('.footer-tagline');
  const metaEls = Array.from(siteFooter.querySelectorAll<HTMLElement>('.footer-meta > *'));
  const els = [wordmark, tagline, ...metaEls].filter(Boolean) as HTMLElement[];
  if (els.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(els, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.set(els, { autoAlpha: 0, y: 12 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: siteFooter,
      start: 'top 92%',
      once: true,
    },
    defaults: { ease: 'power2.out' },
  });

  if (wordmark) tl.to(wordmark, { autoAlpha: 1, y: 0, duration: 0.5 }, 0);
  if (tagline) tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.25);
  if (metaEls.length) {
    tl.to(metaEls, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.15);
  }
};

setupNotifyForm();
setupIntroMotion();
setupSectionLines();
setupAppReveals();
setupLogoMotion();
setupFooterReveal();
