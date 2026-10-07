import gsap from 'gsap';

// Sovelluspolaroidin fokusnäkymä. Painike avaa dialogin natiivisti command/commandfor-
// attribuuteilla; tämä skripti ottaa avauksen ja sulkemisen hoitaakseen ja nostaa
// saman polaroid-elementin sivulta dialogiin ja takaisin (FLIP). Teippi jää sivulle.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const centerOf = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const setupAppFocus = (trigger: HTMLButtonElement) => {
  const dialogId = trigger.getAttribute('commandfor');
  const dialog = dialogId ? document.getElementById(dialogId) : null;
  const slot = trigger.querySelector<HTMLElement>('[data-app-card-slot]');
  const card = trigger.querySelector<HTMLElement>('[data-app-card]');
  if (!(dialog instanceof HTMLDialogElement) || !slot || !card) return;

  const target = dialog.querySelector<HTMLElement>('[data-app-card-target]');
  const backdrop = dialog.querySelector<HTMLElement>('[data-focus-backdrop]');
  const detailsRoot = dialog.querySelector<HTMLElement>('[data-focus-details]');
  if (!target || !backdrop || !detailsRoot) return;

  const closeButton = dialog.querySelector<HTMLElement>('[data-focus-close]');
  const detailEls = Array.from(detailsRoot.children) as HTMLElement[];
  if (closeButton) detailEls.push(closeButton);
  const fadingEls = [backdrop, ...detailEls];
  let motion: gsap.core.Timeline | null = null;
  // Kulma, johon polaroid palaa sivulla (CSS:n --tilt).
  let restRotation = 0;

  // Palauttaa polaroidin sivulle ja nollaa animaatiotilan. Toimii myös silloin,
  // kun selain sulkee dialogin itse (esim. toistuva Esc).
  const restore = () => {
    motion?.kill();
    motion = null;
    if (card.parentElement !== slot) slot.append(card);
    gsap.set(card, { clearProps: 'transform' });
    gsap.set(fadingEls, { clearProps: 'opacity,visibility,transform' });
    if (dialog.open) dialog.close();
  };

  const open = () => {
    if (dialog.open) return;

    // Sivun paljastus voi olla vielä kesken; polaroid otetaan sen hetkisestä kohdasta.
    gsap.killTweensOf(card);
    gsap.set(card, { autoAlpha: 1 });
    const from = card.getBoundingClientRect();
    restRotation = Number(gsap.getProperty(card, 'rotation'));

    dialog.showModal();
    target.append(card);
    gsap.set(card, { clearProps: 'transform' });

    if (prefersReducedMotion) return;

    const fromCenter = centerOf(from);
    const toCenter = centerOf(card.getBoundingClientRect());

    motion = gsap.timeline({ onComplete: () => { motion = null; } });
    motion.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0);
    motion.fromTo(
      card,
      {
        x: fromCenter.x - toCenter.x,
        y: fromCenter.y - toCenter.y,
        scale: from.width / card.offsetWidth,
        rotation: restRotation,
      },
      { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.8, ease: 'expo.out' },
      0,
    );
    motion.fromTo(
      detailEls,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 },
      0.2,
    );
  };

  const close = () => {
    if (!dialog.open || (motion && motion.data === 'closing')) return;

    if (prefersReducedMotion) {
      restore();
      trigger.focus();
      return;
    }

    motion?.kill();
    const fromCenter = centerOf(card.getBoundingClientRect());
    const toCenter = centerOf(slot.getBoundingClientRect());

    motion = gsap.timeline({
      data: 'closing',
      onComplete: () => {
        restore();
        trigger.focus();
      },
    });
    motion.to(detailEls, {
      autoAlpha: 0,
      y: -8,
      duration: 0.2,
      ease: 'power1.in',
    }, 0);
    motion.to(backdrop, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, 0.1);
    motion.to(card, {
      x: `+=${toCenter.x - fromCenter.x}`,
      y: `+=${toCenter.y - fromCenter.y}`,
      scale: slot.offsetWidth / card.offsetWidth,
      rotation: restRotation,
      duration: 0.65,
      ease: 'power3.inOut',
    }, 0);
  };

  // preventDefault ohittaa natiivin commandin, jotta animaatio ehtii mukaan.
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    open();
  });

  dialog.querySelectorAll<HTMLElement>('[data-focus-close], [data-focus-backdrop]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      close();
    });
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  dialog.addEventListener('close', () => {
    if (card.parentElement !== slot) restore();
  });
};

document.querySelectorAll<HTMLButtonElement>('[data-app-trigger]').forEach(setupAppFocus);
