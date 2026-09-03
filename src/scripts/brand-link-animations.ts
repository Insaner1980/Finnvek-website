import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const setupWordmarkAnimation = (
  trigger: HTMLElement,
  wordmark: HTMLElement,
  automaticTrigger: 'load' | 'visible' | 'reveal',
) => {
  const accessibleName = wordmark.getAttribute('aria-label');
  const split = new SplitText(wordmark, { type: 'chars', charsClass: 'split-char' });
  const chars = split.chars as HTMLElement[];
  let activeTimeline: gsap.core.Timeline | null = null;

  if (accessibleName) {
    wordmark.setAttribute('aria-label', accessibleName);
  } else {
    wordmark.removeAttribute('aria-label');
  }

  const play = () => {
    if (activeTimeline?.isActive()) return;

    activeTimeline = gsap
      .timeline({ onComplete: () => { activeTimeline = null; } })
      .fromTo(
        chars,
        { y: 3 },
        {
          y: 0,
          duration: 0.32,
          ease: 'power2.out',
          stagger: 0.025,
        },
      )
      .to(
        chars,
        {
          color: '#D9A24E',
          duration: 0.18,
          ease: 'sine.inOut',
          stagger: 0.035,
          yoyo: true,
          repeat: 1,
        },
        0,
      );
  };

  trigger.addEventListener('focus', play);

  if (hasFinePointer) {
    trigger.addEventListener('pointerenter', play);
  }

  if (automaticTrigger === 'reveal') {
    trigger.addEventListener('finnvek:logo-visible', play);
    return;
  }

  if (hasFinePointer) return;

  if (automaticTrigger === 'load') {
    play();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    play();
  }, { threshold: 0.55 });

  observer.observe(trigger);
};

if (!prefersReducedMotion) {
  const topbarLogo = document.querySelector<HTMLElement>('[data-animated-topbar-logo]');
  if (topbarLogo) {
    const automaticTrigger = topbarLogo.closest('.site-header--home') ? 'reveal' : 'load';
    setupWordmarkAnimation(topbarLogo, topbarLogo, automaticTrigger);
  }

  const footerBrand = document.querySelector<HTMLElement>('[data-animated-footer-brand]');
  const footerWordmark = footerBrand?.querySelector<HTMLElement>('.footer-wordmark');
  if (footerBrand && footerWordmark) setupWordmarkAnimation(footerBrand, footerWordmark, 'visible');
}
