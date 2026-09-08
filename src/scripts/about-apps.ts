const filters = document.querySelector<HTMLElement>('.about-filters');
const list = document.querySelector<HTMLElement>('#about-app-list');
const empty = document.querySelector<HTMLElement>('.about-app-empty');
const count = document.querySelector<HTMLElement>('[data-app-count]');

if (filters && list && empty && count) {
  const buttons = filters.querySelectorAll<HTMLButtonElement>('[data-app-filter]');
  const rows = list.querySelectorAll<HTMLElement>('[data-app-status]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.appFilter;
      let visibleCount = 0;

      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      rows.forEach((row) => {
        row.hidden = selected !== 'all' && row.dataset.appStatus !== selected;
        if (!row.hidden) visibleCount++;
      });

      list.hidden = visibleCount === 0;
      empty.hidden = visibleCount !== 0;
      count.textContent = `${visibleCount} ${visibleCount === 1 ? 'app' : 'apps'}`;
    });
  });

  filters.hidden = false;
}
