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

/* ---- Langue ----
 * La page d'accueil existe en trois fichiers : index.html (fr), ru.html, en.html
 * (ru.html et en.html sont générés par scripts/build-home.mjs).
 * Sur ru.html / en.html, la langue est fixée par <html data-static-lang>.
 * Sur index.html, les anciens liens « ?lang=ru » / « ?lang=en » renvoient
 * vers la page de la bonne langue. */
const HOME_PAGES = { fr: '/', ru: '/ru.html', en: '/en.html' };
const staticLang = document.documentElement.dataset.staticLang || null;

function getLangFromUrl() {
  try {
    const l = (new URLSearchParams(window.location.search).get('lang') || '').toLowerCase();
    return l === 'fr' || l === 'ru' || l === 'en' ? l : null;
  } catch (_) {
    return null;
  }
}
function goToLang(lang) {
  try { localStorage.setItem('lang', lang); } catch (_) {}
  const target = HOME_PAGES[lang] || '/';
  // En local (file://), garder des chemins relatifs
  const href = location.protocol === 'file:' ? (lang === 'fr' ? 'index.html' : target.slice(1)) : target;
  location.assign(href + location.hash);
}

let currentLang = staticLang || 'fr';
if (!staticLang) {
  const wanted = getLangFromUrl();
  if (wanted && wanted !== 'fr') {
    goToLang(wanted);
  } else if (getLangFromUrl()) {
    // ?lang=fr : nettoyer l'adresse
    try { history.replaceState({}, '', location.pathname + location.hash); } catch (_) {}
  }
}

const translations = window.locales;
const t = {
  fr: translations.fr,
  ru: translations.ru,
  en: translations.en,
};

function applyI18n() {
  document.documentElement.lang = currentLang || 'fr';
  document.title = t[currentLang]['meta.title'];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = t[currentLang][key];
    // Ne réécrire que si le texte change : réécrire un texte identique repousse
    // l’affichage de l’élément principal (LCP) au moment où ce script s’exécute.
    if (value && el.textContent.replace(/\s+/g, ' ').trim() !== value)
      el.textContent = value;
  });
  // Liens dont la cible dépend de la langue (ex. page du catéchisme FR / RU / EN)
  document.querySelectorAll('[data-i18n-href]').forEach((el) => {
    const key = el.getAttribute('data-i18n-href');
    if (t[currentLang][key]) el.setAttribute('href', t[currentLang][key]);
  });
  syncLangSelect();
  window.NevskyCalendar?.render(currentLang);
}

function setLang(lang) {
  if (lang === currentLang) return;
  goToLang(lang);
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
