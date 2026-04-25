import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

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
      y: -520,
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
        duration: 1.35,
        ease: 'bounce.out',
        stagger: 0.16,
      },
      heroLogo ? '-=0.3' : 0,
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
  if (!aboutSection || aboutLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(aboutLines, { autoAlpha: 1 });
    return;
  }

  const textEls = aboutSection.querySelectorAll<HTMLElement>(
    'h2[data-about-line], p[data-about-line], .signature[data-about-line]',
  );
  const aboutImage = aboutSection.querySelector<HTMLElement>('.about-image');

  const splits = Array.from(textEls).map(
    (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
  );
  const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

  gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });
  if (aboutImage) gsap.set(aboutImage, { autoAlpha: 0, y: 18, scale: 0.98 });

  const tl = gsap.timeline({ delay: 0.6 });

  tl.to(allWords, {
    autoAlpha: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.015,
  });

  if (aboutImage) {
    tl.to(
      aboutImage,
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
      0.15,
    );
  }
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

const setupKnittoolsReveal = () => {
  if (!knittoolsSection || !knittoolsImage || knittoolsLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set([knittoolsImage, ...knittoolsLines], { autoAlpha: 1 });
    return;
  }

  const textEls = knittoolsSection.querySelectorAll<HTMLElement>(
    '.label[data-knittools-line], h2[data-knittools-line], p[data-knittools-line]',
  );
  const otherEls = knittoolsLines.filter((el) => !el.matches('.label, h2, p'));

  const splits = Array.from(textEls).map(
    (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
  );
  const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

  gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });
  gsap.set(otherEls, { autoAlpha: 0, y: 16 });
  gsap.set(knittoolsImage, { autoAlpha: 0, scale: 0.96, transformOrigin: 'center center' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: knittoolsSection,
      start: 'top 75%',
      once: true,
    },
  });

  tl.to(knittoolsImage, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0)
    .to(
      allWords,
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.014,
      },
      0.1,
    )
    .to(
      otherEls,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.06,
      },
      '-=0.3',
    );
};

setupNotifyForm();
setupHeroScrollReveal();
setupAboutReveal();
setupSectionLines();
setupScrollReveals();
setupParallax();
setupKnittoolsReveal();
