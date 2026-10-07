import gsap from 'gsap';

// Vaihtaa läppärin ruudun käsialatekstin Suomen kellonajan mukaan. Tekstit
// tulevat index.astro:sta data-notes-attribuutissa; HTML:ssä on valmiiksi
// työpäivän teksti, joka jää näkyviin ilman JavaScriptiä.

interface LaptopNote {
  from: number;
  lines: string[];
}

const CHECK_INTERVAL_MS = 60_000;

const helsinkiHour = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: 'Europe/Helsinki',
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const parseNotes = (raw: string | undefined): LaptopNote[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((note): note is LaptopNote =>
        typeof note?.from === 'number' && Array.isArray(note.lines) && note.lines.every((line: unknown) => typeof line === 'string'))
      .sort((a, b) => a.from - b.from);
  } catch {
    return [];
  }
};

// Viimeinen teksti, jonka alkutunti on jo ohitettu.
const pickNote = (notes: LaptopNote[], hour: number) =>
  notes.reduce((picked, note) => (note.from <= hour ? note : picked), notes[0]);

const setupLaptopNote = () => {
  const noteEl = document.querySelector<HTMLElement>('[data-laptop-note]');
  if (!noteEl) return;

  const notes = parseNotes(noteEl.dataset.notes);
  const lineEls = Array.from(noteEl.querySelectorAll<HTMLElement>('[data-laptop-note-line]'));
  if (notes.length === 0 || lineEls.length === 0) return;

  let shown = '';

  const writeLines = (note: LaptopNote) => {
    lineEls.forEach((lineEl, index) => {
      lineEl.textContent = note.lines[index] ?? '';
    });
  };

  const update = (animate: boolean) => {
    const note = pickNote(notes, Number(helsinkiHour.format(new Date())));
    const key = note.lines.join('\n');
    if (key === shown) return;
    shown = key;

    if (!animate || prefersReducedMotion) {
      writeLines(note);
      return;
    }

    gsap.timeline()
      .to(lineEls, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' })
      .add(() => writeLines(note))
      .to(lineEls, { autoAlpha: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12 });
  };

  // Ensimmäinen teksti asetetaan heti, ennen kuin hero tulee näkyviin.
  update(false);
  window.setInterval(() => update(true), CHECK_INTERVAL_MS);
};

setupLaptopNote();
