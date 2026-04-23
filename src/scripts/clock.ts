const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'Europe/Helsinki',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const formatter = new Intl.DateTimeFormat('en-GB', TIME_OPTIONS);

function updateTime(): void {
  const el = document.getElementById('local-time');
  if (!el) return;
  el.textContent = formatter.format(new Date());
}

updateTime();
setInterval(updateTime, 30_000);
