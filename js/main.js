// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const btn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
btn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileMenu
  ?.querySelectorAll('a')
  .forEach((a) =>
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );

// Sticky header behavior
const header = document.getElementById('siteHeader');
const onScroll = () => {
  const scrolled = window.scrollY > 10;
  header.classList.toggle('scrolled', scrolled);
};
window.addEventListener('scroll', onScroll);
onScroll();

// Simple calendar generator
const title = document.getElementById('calendarTitle');
const grid = document.getElementById('calendarGrid');
const prev = document.getElementById('prevMonth');
const next = document.getElementById('nextMonth');

let current = new Date();
current.setDate(1);
let currentLang = localStorage.getItem('lang') || 'fr';

function formatMonthYear(d) {
  return d
    .toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'fr-FR', {
      month: 'long',
      year: 'numeric',
    })
    .replace(/^./, (c) => c.toUpperCase());
}

function buildCalendar(date) {
  grid.innerHTML = '';
  title.textContent = formatMonthYear(date);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  for (let i = 0; i < startDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'h-10 rounded-lg bg-transparent';
    grid.appendChild(cell);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className =
      'h-10 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ffd615]';
    cell.textContent = d;
    cell.addEventListener('click', () =>
      alert(
        (currentLang === 'ru' ? 'Богослужения на ' : 'Offices pour le ') +
          d +
          ' ' +
          formatMonthYear(date) +
          ' — (à compléter)'
      )
    );
    grid.appendChild(cell);
  }
}

prev?.addEventListener('click', () => {
  current.setMonth(current.getMonth() - 1);
  buildCalendar(current);
});
next?.addEventListener('click', () => {
  current.setMonth(current.getMonth() + 1);
  buildCalendar(current);
});
buildCalendar(current);

const translations = window.locales;
const t = {
  fr: translations.fr,
  ru: translations.ru,
};
currentLang = localStorage.getItem('lang') || 'fr';

function applyI18n() {
  document.documentElement.lang = currentLang === 'ru' ? 'ru' : 'fr';
  document.title = t[currentLang]['meta.title'];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[currentLang][key]) el.textContent = t[currentLang][key];
  });
  syncLangSelect();
  buildCalendar(current);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyI18n();
}

// Language selector in footer
let langSelect = null;
function syncLangSelect() {
  langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = currentLang;
}
document.addEventListener('DOMContentLoaded', () => {
  syncLangSelect();
  langSelect?.addEventListener('change', (e) => setLang(e.target.value));
});

applyI18n();
