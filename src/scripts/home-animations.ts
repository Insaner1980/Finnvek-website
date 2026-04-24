import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroLogo = document.querySelector<HTMLElement>('[data-hero-logo]');
const logoDots = Array.from(document.querySelectorAll<SVGElement>('[data-logo-dot]'));
const heroSection = document.querySelector<HTMLElement>('.hero');
const heroLabel = document.querySelector<HTMLElement>('.hero-label');
const heroHeadline = document.querySelector<HTMLElement>('[data-hero-line]');
const aboutSection = document.querySelector<HTMLElement>('[data-about]');
const aboutLines = Array.from(document.querySelectorAll<HTMLElement>('[data-about-line]'));
const knittoolsSection = document.querySelector<HTMLElement>('[data-knittools]');
const knittoolsImage = document.querySelector<HTMLElement>('[data-knittools-image]');
const knittoolsLines = Array.from(document.querySelectorAll<HTMLElement>('[data-knittools-line]'));
const sectionLines = Array.from(document.querySelectorAll<HTMLElement>('[data-section-line]'));
const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
const parallaxWrap = document.querySelector<HTMLElement>('[data-parallax-wrap]');
const parallaxImage = parallaxWrap?.querySelector<HTMLElement>('img');
const notifyForm = document.querySelector<HTMLFormElement>('[data-notify-form]');

const setupNotifyForm = () => {
  if (!notifyForm) return;

  notifyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!notifyForm.reportValidity()) return;

    const complete = () => {
      const message = document.createElement('span');
      message.textContent = "You're in!";
      notifyForm.replaceChildren(message);
      notifyForm.classList.add('is-complete');
    };

    if (prefersReducedMotion) {
      complete();
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
      .add(complete)
      .fromTo(notifyForm, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' });
  });
};

const setupHeroScrollReveal = () => {
  if (prefersReducedMotion) return;
  if (!heroSection || (!heroLabel && !heroHeadline)) return;

  if (heroLogo) gsap.set(heroLogo, { autoAlpha: 0, y: -8 });
  if (logoDots.length > 0) {
    gsap.set(logoDots, {
      y: -160,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
    });
  }
  if (heroLabel) gsap.set(heroLabel, { autoAlpha: 0, y: 10 });
  if (heroHeadline) gsap.set(heroHeadline, { autoAlpha: 0, y: 16 });

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.18,
  });

  if (heroLogo) {
    timeline.to(heroLogo, { autoAlpha: 1, y: 0, duration: 0.48 });
  }

  if (logoDots.length > 0) {
    timeline.to(
      logoDots,
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        ease: 'bounce.out',
        stagger: 0.14,
      },
      heroLogo ? '-=0.24' : 0,
    );
  }

  if (heroLabel) {
    timeline.to(heroLabel, { autoAlpha: 1, y: 0, duration: 0.44 }, heroLogo ? '-=0.18' : 0);
  }

  if (heroHeadline) {
    timeline.to(heroHeadline, { autoAlpha: 1, y: 0, duration: 0.62 }, heroLabel ? '-=0.22' : 0);
  }
};

const setupScrollReveals = () => {
  if (prefersReducedMotion) return;

  revealItems.forEach((item) => {
    gsap.fromTo(
      item,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 84%',
          once: true,
        },
      },
    );
  });
};

const setupAboutReveal = () => {
  if (prefersReducedMotion) return;
  if (!aboutSection || aboutLines.length === 0) return;

  gsap.set(aboutLines, { autoAlpha: 0, y: 20 });

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 78%',
      end: '+=420',
      scrub: 0.9,
    },
  }).to(
    aboutLines,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.18,
      stagger: 0.14,
    },
    0,
  );
};

const setupParallax = () => {
  if (prefersReducedMotion || !parallaxWrap || !parallaxImage) return;

  const media = gsap.matchMedia();

  media.add('(min-width: 769px)', () => {
    gsap.to(parallaxImage, {
      y: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxWrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });
};

const setupSectionLines = () => {
  if (sectionLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(sectionLines, { scaleX: 1 });
    return;
  }

  sectionLines.forEach((line) => {
    gsap.set(line, { scaleX: 0 });
    gsap.to(line, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: line,
        start: 'top bottom',
        end: 'top 40%',
        scrub: 1.2,
      },
    });
  });
};

const setupKnittoolsReveal = () => {
  if (prefersReducedMotion) return;
  if (!knittoolsSection || !knittoolsImage || knittoolsLines.length === 0) return;

  gsap.set(knittoolsImage, { autoAlpha: 0, x: -18, y: 18 });
  gsap.set(knittoolsLines, { autoAlpha: 0, y: 18 });

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: knittoolsSection,
      start: 'top 78%',
      end: '+=460',
      scrub: 0.9,
    },
  });

  timeline.to(knittoolsImage, { autoAlpha: 1, x: 0, y: 0, duration: 0.24 }, 0).to(
    knittoolsLines,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.14,
      stagger: 0.11,
    },
    0.06,
  );
};

setupNotifyForm();
setupHeroScrollReveal();
setupAboutReveal();
setupSectionLines();
setupScrollReveals();
setupParallax();
setupKnittoolsReveal();
