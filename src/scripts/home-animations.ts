import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topbar = document.querySelector<HTMLElement>('.topbar');
const heroText = document.querySelector<HTMLElement>('.hero-text');
const aboutSection = document.querySelector<HTMLElement>('[data-about]');
const aboutLines = Array.from(document.querySelectorAll<HTMLElement>('[data-about-line]'));
const knittoolsSection = document.querySelector<HTMLElement>('[data-knittools]');
const knittoolsCard = document.querySelector<HTMLElement>('[data-knittools-card]');
const knittoolsLines = Array.from(document.querySelectorAll<HTMLElement>('[data-knittools-line]'));
const sectionLines = Array.from(document.querySelectorAll<HTMLElement>('[data-section-line]'));
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

const setupTopbarHeroReveal = () => {
  if (!topbar && !heroText) return;

  if (prefersReducedMotion) {
    if (topbar) gsap.set(topbar, { autoAlpha: 1 });
    if (heroText) gsap.set(heroText, { autoAlpha: 1, y: 0 });
    return;
  }

  if (topbar) gsap.set(topbar, { autoAlpha: 0 });
  if (heroText) gsap.set(heroText, { autoAlpha: 0, y: 16 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });
  if (topbar) tl.to(topbar, { autoAlpha: 1, duration: 0.5 });
  if (heroText) tl.to(heroText, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3');
};

const setupAboutReveal = () => {
  if (!aboutSection || aboutLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(aboutLines, { autoAlpha: 1 });
    return;
  }

  const textEls = aboutSection.querySelectorAll<HTMLElement>(
    'h2[data-about-line], p[data-about-line], .about-sig[data-about-line], .section-label[data-about-line]',
  );

  const splits = Array.from(textEls).map(
    (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
  );
  const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

  gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });

  gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top 80%',
      once: true,
    },
  }).to(allWords, {
    autoAlpha: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.015,
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
  if (!knittoolsSection || knittoolsLines.length === 0) return;

  if (prefersReducedMotion) {
    gsap.set(knittoolsLines, { autoAlpha: 1 });
    if (knittoolsCard) gsap.set(knittoolsCard, { autoAlpha: 1, scale: 1 });
    return;
  }

  const textEls = knittoolsSection.querySelectorAll<HTMLElement>(
    'h2[data-knittools-line], p[data-knittools-line], .section-label[data-knittools-line]',
  );
  const otherEls = knittoolsLines.filter((el) => !el.matches('h2, p, .section-label'));

  const splits = Array.from(textEls).map(
    (el) => new SplitText(el, { type: 'words', wordsClass: 'split-word' }),
  );
  const allWords = splits.flatMap((s) => s.words as HTMLElement[]);

  gsap.set(allWords, { autoAlpha: 0, y: 12, filter: 'blur(8px)' });
  gsap.set(otherEls, { autoAlpha: 0, y: 16 });
  if (knittoolsCard) gsap.set(knittoolsCard, { autoAlpha: 0, scale: 0.98, transformOrigin: 'center center' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: knittoolsSection,
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

  if (knittoolsCard) {
    tl.to(knittoolsCard, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.1);
  }

  tl.to(otherEls, {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.06,
  }, '-=0.3');
};

setupNotifyForm();
setupTopbarHeroReveal();
setupAboutReveal();
setupSectionLines();
setupKnittoolsReveal();
