const header = document.querySelector<HTMLElement>('[data-site-header]');
const menuButton = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const navigation = header?.querySelector<HTMLElement>('.site-nav');

if (header && menuButton && navigation) {
  const setMenuOpen = (open: boolean) => {
    header.classList.toggle('is-menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) setMenuOpen(false);
  });

  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !header.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
    setMenuOpen(false);
    menuButton.focus();
  });

  const desktopQuery = window.matchMedia('(min-width: 761px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  if (header.classList.contains('site-header--home')) {
    const heroWordmark = document.querySelector<HTMLElement>('.hero-wordmark');
    const compactLogo = header.querySelector<HTMLElement>('[data-animated-topbar-logo]');

    if (heroWordmark && compactLogo) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;

        const showCompactLogo = !entry.isIntersecting || entry.intersectionRatio < 0.12;
        const wasVisible = header.classList.contains('is-logo-visible');
        header.classList.toggle('is-logo-visible', showCompactLogo);

        if (showCompactLogo && !wasVisible) {
          compactLogo.dispatchEvent(new Event('finnvek:logo-visible'));
        }
      }, { threshold: [0, 0.12] });

      observer.observe(heroWordmark);
    }
  }
}
