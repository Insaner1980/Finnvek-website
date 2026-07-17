import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topbar = document.querySelector<HTMLElement>('.topbar');
const heroSection = document.querySelector<HTMLElement>('.hero');
const heroMeta = document.querySelector<HTMLElement>('.hero-meta');
const heroWordmark = document.querySelector<HTMLElement>('.hero-wordmark');
const heroTagline = document.querySelector<HTMLElement>('.hero-tagline');
const heroScrollCue = document.querySelector<HTMLElement>('.hero-scroll-cue');
const siteFooter = document.querySelector<HTMLElement>('.site-footer');
const aboutSection = document.querySelector<HTMLElement>('[data-about]');
const aboutLines = Array.from(document.querySelectorAll<HTMLElement>('[data-about-line]'));
const productSections = Array.from(document.querySelectorAll<HTMLElement>('[data-product]'));
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
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        success = true;
      } else if (data.error) {
        errorMessage = data.error;
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

const setupTopbarHeroReveal = () => {
  const heroEls = [heroMeta, heroWordmark, heroTagline].filter(Boolean) as HTMLElement[];
  if (!topbar && heroEls.length === 0) return;

  if (prefersReducedMotion) {
    if (topbar) gsap.set(topbar, { autoAlpha: 1 });
    if (heroEls.length) gsap.set(heroEls, { autoAlpha: 1, y: 0 });
    return;
  }

  if (topbar) gsap.set(topbar, { autoAlpha: 0 });
  if (heroMeta) gsap.set(heroMeta, { autoAlpha: 0, y: 8 });
  if (heroTagline) gsap.set(heroTagline, { autoAlpha: 0, y: 14 });
  if (heroScrollCue) gsap.set(heroScrollCue, { autoAlpha: 0 });

  let wordmarkChars: HTMLElement[] = [];
  if (heroWordmark) {
    const split = new SplitText(heroWordmark, { type: 'chars', charsClass: 'split-char' });
    wordmarkChars = split.chars as HTMLElement[];
    gsap.set(wordmarkChars, { autoAlpha: 0, y: 26 });
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });
  if (topbar) tl.to(topbar, { autoAlpha: 1, duration: 0.5 });
  if (heroMeta) tl.to(heroMeta, { autoAlpha: 1, y: 0, duration: 0.5 }, 0);
  if (wordmarkChars.length) {
    tl.to(wordmarkChars, {
      autoAlpha: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
      stagger: 0.09,
    }, 0.15);
  }
  if (heroTagline) tl.to(heroTagline, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.9);
  if (heroScrollCue) tl.to(heroScrollCue, { autoAlpha: 1, duration: 0.6 }, 1.4);
  if (wordmarkChars.length) {
    tl.to(wordmarkChars, {
      color: '#D9A24E',
      duration: 0.45,
      ease: 'sine.inOut',
      stagger: 0.07,
      yoyo: true,
      repeat: 1,
    }, 1.8);
  }
};

const setupHeroMouseParallax = () => {
  if (prefersReducedMotion || !heroSection) return;
  if (!window.matchMedia('(min-width: 761px) and (pointer: fine)').matches) return;
  if (!heroWordmark && !heroTagline) return;

  gsap.delayedCall(2.4, () => {
    const movers: Array<{ x: (v: number) => void; y: (v: number) => void; fx: number; fy: number }> = [];

    if (heroWordmark) {
      movers.push({
        x: gsap.quickTo(heroWordmark, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(heroWordmark, 'y', { duration: 0.8, ease: 'power3.out' }),
        fx: 6,
        fy: 4,
      });
    }

    if (heroTagline) {
      movers.push({
        x: gsap.quickTo(heroTagline, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(heroTagline, 'y', { duration: 0.8, ease: 'power3.out' }),
        fx: -5,
        fy: -3,
      });
    }

    if (!heroSection) return;

    heroSection.addEventListener('mousemove', (event) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      movers.forEach((m) => {
        m.x(nx * m.fx);
        m.y(ny * m.fy);
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      movers.forEach((m) => {
        m.x(0);
        m.y(0);
      });
    });
  });
};

const setupLocalTime = () => {
  const timeEl = document.querySelector<HTMLElement>('[data-local-time]');
  if (!timeEl) return;

  const formatter = new Intl.DateTimeFormat('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Helsinki',
  });

  const update = () => {
    timeEl.textContent = ` — ${formatter.format(new Date())}`;
  };

  update();
  window.setInterval(update, 30000);
};

const setupScrollCueFade = () => {
  if (prefersReducedMotion || !heroSection || !heroScrollCue) return;

  gsap.to(heroScrollCue, {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: '25% top',
      scrub: true,
    },
  });
};

const setupAboutReveal = () => {
  if (!aboutSection || aboutLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(aboutLines, { autoAlpha: 1 });
    return;
  }

  const textEls = aboutSection.querySelectorAll<HTMLElement>(
    'h2[data-about-line], p[data-about-line], .section-label[data-about-line]',
  );
  const signature = aboutSection.querySelector<HTMLElement>('.about-sig');

  const splits = Array.from(textEls).map(
    (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
  );
  const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

  gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });
  if (signature) gsap.set(signature, { autoAlpha: 0, x: -16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%',
      once: true,
    },
  });

  tl.to(allWords, {
    autoAlpha: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.015,
  });

  if (signature) {
    tl.to(signature, {
      autoAlpha: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '+=0.4');
  }
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

const setupProductReveals = () => {
  productSections.forEach((section) => {
    const lines = Array.from(section.querySelectorAll<HTMLElement>('[data-product-line]'));
    const logo = section.querySelector<HTMLElement>('[data-product-logo]');
    const name = section.querySelector<HTMLElement>('.product-name');
    if (lines.length === 0 && !logo && !name) return;

    const logoSignals = logo?.hasAttribute('data-logo-signal') ?? false;
    const signalParts = logo && logoSignals ? getSignalLogoParts(logo) : null;

    if (prefersReducedMotion) {
      if (lines.length) gsap.set(lines, { autoAlpha: 1 });
      if (logo) gsap.set(logo, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotation: 0 });
      if (signalParts) gsap.set(signalParts.all, { autoAlpha: 1, scale: 1, scaleY: 1, x: 0 });
      if (name) gsap.set(name, { autoAlpha: 1, y: 0 });
      return;
    }

    const textEls = section.querySelectorAll<HTMLElement>(
      'p[data-product-line], .section-label[data-product-line]',
    );
    const otherEls = lines.filter((el) => !el.matches('p, .section-label'));
    const logoRises = logo?.hasAttribute('data-logo-rise') ?? false;
    const logoRolls = logo?.hasAttribute('data-logo-roll') ?? false;

    const splits = Array.from(textEls).map(
      (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
    );
    const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

    gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });
    gsap.set(otherEls, { autoAlpha: 0, y: 16 });
    if (logo) {
      if (logoRolls) {
        gsap.set(logo, { autoAlpha: 0, x: 150, rotation: 240, transformOrigin: 'center center' });
      } else if (logoSignals && signalParts) {
        gsap.set(logo, { autoAlpha: 0, scale: 0.94, rotation: -4, transformOrigin: 'center center' });
        gsap.set(signalParts.divider, { autoAlpha: 0, scaleY: 0.16, transformOrigin: '50% 50%' });
        gsap.set(signalParts.letterD, { autoAlpha: 0, scale: 0.82, x: 18, transformOrigin: '50% 50%' });
        gsap.set(signalParts.letterB, { autoAlpha: 0, scale: 0.82, x: -18, transformOrigin: '50% 50%' });
        gsap.set(signalParts.ticks, { autoAlpha: 0, scaleY: 0.18, transformOrigin: '50% 50%' });
      } else if (logoRises) {
        gsap.set(logo, { autoAlpha: 0, y: 30 });
      } else {
        gsap.set(logo, { autoAlpha: 0, scale: 0.98, transformOrigin: 'center center' });
      }
    }
    if (name) gsap.set(name, { autoAlpha: 0, y: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    });

    tl.to(allWords, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.014,
    }, 0);

    if (logo) {
      if (logoRolls) {
        tl.to(logo, { autoAlpha: 1, duration: 0.35, ease: 'none' }, 0.1);
        tl.to(logo, { x: 0, rotation: 0, duration: 1.6, ease: 'power2.out' }, 0.1);
      } else if (logoSignals && signalParts) {
        tl.to(logo, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.78, ease: 'power3.out' }, 0.1);
        tl.to(signalParts.divider, { autoAlpha: 1, scaleY: 1, duration: 0.56, ease: 'back.out(1.8)' }, 0.14);
        tl.to(
          signalParts.letters,
          { autoAlpha: 1, scale: 1, x: 0, duration: 0.64, ease: 'back.out(1.7)', stagger: 0.07 },
          0.24,
        );
        tl.to(
          signalParts.ticks,
          { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 },
          0.42,
        );
      } else if (logoRises) {
        tl.to(logo, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.1);
      } else {
        tl.to(logo, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.1);
      }
    }

    if (name) {
      const nameRevealStart = logoRolls ? 0.9 : logoSignals ? 0.82 : 0.55;
      tl.to(name, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, nameRevealStart);
    }

    tl.to(otherEls, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.06,
    }, '-=0.3');
  });
};

const setupLogoMotion = () => {
  if (prefersReducedMotion) return;

  document.querySelectorAll<HTMLElement>('[data-logo-stamp]').forEach((logo) => {
    const lockup = logo.closest<HTMLElement>('[data-product-lockup]');
    if (!lockup) return;
    let stampTl: gsap.core.Timeline | null = null;

    lockup.addEventListener('mouseenter', () => {
      stampTl?.kill();
      stampTl = gsap
        .timeline()
        .to(lockup, { scale: 0.95, duration: 0.12, ease: 'power2.in' })
        .to(lockup, { scale: 1, duration: 0.45, ease: 'back.out(2.5)' });
    });
  });

  document.querySelectorAll<HTMLElement>('[data-logo-nudge]').forEach((logo) => {
    const lockup = logo.closest<HTMLElement>('[data-product-lockup]');
    if (!lockup) return;
    let nudgeTl: gsap.core.Timeline | null = null;

    lockup.addEventListener('mouseenter', () => {
      nudgeTl?.kill();
      nudgeTl = gsap
        .timeline()
        .to(logo, { y: -7, duration: 0.18, ease: 'power2.out' })
        .to(logo, { y: 0, duration: 0.5, ease: 'back.out(2)' });
    });

    lockup.addEventListener('mouseleave', () => {
      nudgeTl?.kill();
      nudgeTl = null;
      gsap.to(logo, { y: 0, duration: 0.25, ease: 'power2.out' });
    });
  });

  document.querySelectorAll<HTMLElement>('[data-logo-signal]').forEach((logo) => {
    const lockup = logo.closest<HTMLElement>('[data-product-lockup]');
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
setupTopbarHeroReveal();
setupScrollCueFade();
setupHeroMouseParallax();
setupLocalTime();
setupAboutReveal();
setupSectionLines();
setupProductReveals();
setupLogoMotion();
setupFooterReveal();
