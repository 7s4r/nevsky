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
/** Language helpers: URL param (?lang=fr|ru) has priority over localStorage */
function getLangFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const l = (params.get('lang') || '').toLowerCase();
    return l === 'fr' || l === 'ru' || l === 'en' ? l : null;
  } catch (_) {
    return null;
  }
}

function setLangParamInUrl(lang) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    // Do not create a new history entry; keep navigation clean
    window.history.replaceState({}, '', url);
  } catch (_) {}
}

let currentLang = getLangFromUrl() || localStorage.getItem('lang') || 'fr';
// Ensure URL reflects the chosen language on first load
setLangParamInUrl(currentLang);

function formatMonthYear(d) {
  const localeMap = { fr: 'fr-FR', ru: 'ru-RU', en: 'en-GB' };
  const loc = localeMap[currentLang] || 'fr-FR';
  return d
    .toLocaleDateString(loc, { month: 'long', year: 'numeric' })
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
    cell.addEventListener('click', () => {
      const msgPrefix =
        currentLang === 'ru'
          ? 'Богослужения на '
          : currentLang === 'en'
          ? 'Services on '
          : 'Offices pour le ';
      alert(msgPrefix + d + ' ' + formatMonthYear(date) + ' — (à compléter)');
    });
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
  en: translations.en,
};
/** ---- SEO helpers: canonical, hreflang, title & descriptions per language ---- */
function ensureAltLink(hreflang) {
  let el = document.querySelector(
    `link[rel="alternate"][hreflang="${hreflang}"]`
  );
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  return el;
}

function updateSeoTags() {
  const lang = typeof currentLang === 'string' ? currentLang : 'fr';

  // Canonical self-referencing per language (?lang=fr|ru)
  try {
    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      (() => {
        const c = document.createElement('link');
        c.setAttribute('rel', 'canonical');
        document.head.appendChild(c);
        return c;
      })();
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    canonical.setAttribute('href', url.toString());
  } catch {}

  // Hreflang alternates (+ x-default -> FR)
  try {
    const base = new URL(window.location.origin + window.location.pathname);
    const fr = new URL(base);
    fr.searchParams.set('lang', 'fr');
    const ru = new URL(base);
    ru.searchParams.set('lang', 'ru');
    const en = new URL(base);
    en.searchParams.set('lang', 'en');

    const linkFr = ensureAltLink('fr');
    const linkRu = ensureAltLink('ru');
    const linkEn = ensureAltLink('en');
    const linkXd = ensureAltLink('x-default');

    linkFr.setAttribute('href', fr.toString());
    linkRu.setAttribute('href', ru.toString());
    linkEn.setAttribute('href', en.toString());
    linkXd.setAttribute('href', fr.toString()); // default to FR
  } catch {}

  // Title & meta descriptions (HTML + OpenGraph)
  try {
    const dict = t && t[lang] ? t[lang] : (t && t['fr']) || {};
    const titleStr = dict['meta.title'] || document.title;
    const descStr =
      dict['meta.description'] ||
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ||
      '';

    // <title>
    document.title = titleStr;

    // <meta name="description">
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', descStr);

    // OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', titleStr);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', descStr);

    // og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', new URL(window.location.href).toString());
  } catch {}
}

currentLang =
  getLangFromUrl() || localStorage.getItem('lang') || currentLang || 'fr';

function applyI18n() {
  document.documentElement.lang = currentLang || 'fr';
  document.title = t[currentLang]['meta.title'];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[currentLang][key]) el.textContent = t[currentLang][key];
  });
  syncLangSelect();
  buildCalendar(current);
  updateSeoTags();
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  setLangParamInUrl(lang);
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

const contactForm = document.getElementById('contactForm');
const contactResult = document.getElementById('contactResult');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterResult = document.getElementById('newsletterResult');

function displayFormResult(element, type, message) {
  element.className = `font-semibold ${
    type === 'success'
      ? 'text-green-600'
      : type === 'error'
      ? 'text-red-600'
      : 'text-blue-600'
  }`;
  element.innerHTML = message;
  element.style.display = '';
}

function sendFormData(form, url, resultElement) {
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: json,
  })
    .then((response) => {
      if (response.status == 200) {
        displayFormResult(
          resultElement,
          'success',
          translations[currentLang]['contact.form.success'] ||
            'Your message has been sent successfully.'
        );
      } else {
        displayFormResult(
          resultElement,
          'error',
          translations[currentLang]['contact.form.error'] ||
            'There was an error sending your message. Please try again.'
        );
      }
    })
    .catch((error) => {
      console.log(error);
      displayFormResult(
        resultElement,
        'error',
        translations[currentLang]['contact.form.error'] ||
          'Something went wrong!'
      );
    });
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  displayFormResult(
    contactResult,
    'info',
    translations[currentLang]['contact.form.wait'] || 'Please wait...'
  );

  sendFormData(
    contactForm,
    'https://api.web3forms.com/submit',
    contactResult
  ).then(function () {
    contactForm.reset();
    setTimeout(() => {
      contactResult.style.display = 'none';
    }, 3000);
  });
});

newsletterForm.addEventListener('submit', function (e) {
  e.preventDefault();

  displayFormResult(
    newsletterResult,
    'info',
    translations[currentLang]['contact.form.wait'] || 'Please wait...'
  );

  sendFormData(
    newsletterForm,
    'https://api.web3forms.com/submit',
    newsletterResult
  ).then(function () {
    newsletterForm.reset();
    setTimeout(() => {
      newsletterResult.style.display = 'none';
    }, 3000);
  });
});

(function () {
  var el = document.getElementById('contactEmail');
  if (!el) return;
  var u = el.getAttribute('data-user');
  var d = el.getAttribute('data-domain');
  if (!u || !d) return;
  var addr = u + '@' + d;
  el.textContent = addr;
  el.setAttribute('href', 'mailto:' + addr);
})();
