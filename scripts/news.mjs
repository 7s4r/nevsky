/*
 * Actualités de la paroisse (appelé par build-home.mjs).
 *
 * - newsSection(lang) : les dernières actualités pour la page d'accueil,
 *   insérées entre <!-- actualites:start --> et <!-- actualites:end -->.
 * - buildNewsPages(root) : écrit actualites.html, novosti.html et news.html,
 *   la liste complète dans chaque langue.
 * Les textes viennent de data/actualites.mjs.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { actualites, HOME_NEWS } from '../data/actualites.mjs';

export const NEWS_FILES = { fr: 'actualites.html', ru: 'novosti.html', en: 'news.html' };
const LOCALE = { fr: 'fr-FR', ru: 'ru-RU', en: 'en-GB' };
const HOME = { fr: '/', ru: '/ru.html', en: '/en.html' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
// Espaces insécables de la typographie française
const nbsp = (s, lang) => (lang === 'fr' ? s.replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« ') : s);
const fmt = (date, lang) => new Date(date + 'T12:00:00').toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' });
const anchor = (n) => 'n-' + n.date;

function sorted() {
  const list = actualites.map((n, i) => ({ ...n, i })).sort((a, b) => b.date.localeCompare(a.date) || a.i - b.i);
  for (const n of list) for (const l of ['fr', 'ru', 'en']) {
    if (!n[l]?.title || !n[l]?.text) throw new Error(`data/actualites.mjs : texte ${l} manquant pour l’actualité du ${n.date}`);
  }
  // Ancres uniques même pour deux actualités le même jour
  const seen = {};
  return list.map((n) => { seen[n.date] = (seen[n.date] || 0) + 1; return { ...n, id: anchor(n) + (seen[n.date] > 1 ? '-' + seen[n.date] : '') }; });
}

const T = {
  fr: { more: 'Toutes les actualités →', read: 'Lire la suite →' },
  ru: { more: 'Все новости →', read: 'Читать дальше →' },
  en: { more: 'All news →', read: 'Read more →' },
};

/** Bloc des dernières actualités pour la page d'accueil. */
export function newsSection(lang) {
  const items = sorted().slice(0, HOME_NEWS).map((n) => {
    const t = n[lang], first = t.text.split(/\n\s*\n/)[0];
    return `          <article class="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <time class="text-xs font-semibold uppercase tracking-widest text-slate-500" datetime="${n.date}">${esc(fmt(n.date, lang))}</time>
            <h3 class="mt-2 text-lg font-semibold text-slate-900">${esc(nbsp(t.title, lang))}</h3>
            <p class="mt-2 flex-1 text-slate-600">${esc(nbsp(first, lang))}</p>
            <a class="mt-4 text-sm font-semibold underline link-gold-on-light" href="${NEWS_FILES[lang]}#${n.id}">${T[lang].read}</a>
          </article>`;
  });
  return `        <!-- actualites:start (généré par scripts/build-home.mjs depuis data/actualites.mjs) -->
        <div class="mt-10 grid gap-6 md:grid-cols-3">
${items.join('\n')}
        </div>
        <a href="${NEWS_FILES[lang]}" class="mt-8 inline-block text-sm underline font-semibold link-gold-on-light">${T[lang].more}</a>
        <!-- actualites:end -->`;
}

const PAGE = {
  fr: { title: 'Actualités de la paroisse | Église Nevsky Pau', desc: 'Les nouvelles de la paroisse orthodoxe russe Saint-Alexandre-Nevsky de Pau : travaux, fêtes, offices et nouveaux articles.', h1: 'Les <em>actualités</em>', eyebrow: 'La vie de la paroisse', lead: 'Les nouvelles de la paroisse : travaux de l’église, fêtes, offices et nouveaux articles du site.', sub: 'Actualités · Pau', back: '← Retour à nevsky.fr', skip: 'Aller au contenu', brand: 'Église Saint-Alexandre-Nevsky', langs: 'Langue', top: 'Retour en haut de page', ttop: 'Retour en haut ↑', foot: 'Pour ne rien manquer, inscrivez-vous à la newsletter de la paroisse.', nl: 'S’inscrire à la newsletter →', church: 'Église orthodoxe russe Saint-Alexandre-Nevsky — Pau', assoc: 'Association culturelle orthodoxe russe Saint-Alexandre-Nevsky', doxo: 'Gloire à Dieu pour tout !' },
  ru: { title: 'Новости прихода | Храм Невского, По', desc: 'Новости русского православного прихода святого Александра Невского в По: ремонт храма, праздники, богослужения и новые статьи.', h1: '<em>Новости</em> прихода', eyebrow: 'Жизнь прихода', lead: 'Новости прихода: ремонт храма, праздники, богослужения и новые статьи на сайте.', sub: 'Новости · По', back: '← На сайт nevsky.fr', skip: 'Перейти к содержанию', brand: 'Храм св. Александра Невского', langs: 'Язык', top: 'Вернуться наверх', ttop: 'Наверх ↑', foot: 'Чтобы ничего не пропустить, подпишитесь на рассылку прихода.', nl: 'Подписаться на рассылку →', church: 'Русский православный храм святого Александра Невского — По', assoc: 'Русское православное культурное общество святого Александра Невского', doxo: 'Слава Богу за всё!' },
  en: { title: 'Parish news | Nevsky Church, Pau', desc: 'News from the St Alexander Nevsky Russian Orthodox parish in Pau: church works, feasts, services and new articles.', h1: 'Parish <em>news</em>', eyebrow: 'Parish life', lead: 'News from the parish: works on the church, feasts, services and new articles on the site.', sub: 'News · Pau', back: '← Back to nevsky.fr', skip: 'Skip to content', brand: 'St Alexander Nevsky Church', langs: 'Language', top: 'Back to top of page', ttop: 'Back to top ↑', foot: 'So as not to miss anything, subscribe to the parish newsletter.', nl: 'Subscribe to the newsletter →', church: 'St Alexander Nevsky Russian Orthodox Church — Pau', assoc: 'St Alexander Nevsky Russian Orthodox Cultural Association', doxo: 'Glory to God for all things!' },
};

function page(lang) {
  const P = PAGE[lang], url = (l) => `https://nevsky.fr/${NEWS_FILES[l]}`;
  const items = sorted().map((n) => {
    const t = n[lang];
    const paras = t.text.split(/\n\s*\n/).map((p) => `          <p>${esc(nbsp(p.trim(), lang))}</p>`).join('\n');
    const link = t.link ? `\n          <p><a class="news-link" href="${escAttr(t.link.href)}">${esc(nbsp(t.link.label, lang))}</a></p>` : '';
    return `        <article class="news-item" id="${n.id}">
          <time datetime="${n.date}">${esc(fmt(n.date, lang))}</time>
          <h2>${esc(nbsp(t.title, lang))}</h2>
${paras}${link}
        </article>`;
  });
  const switcher = ['fr', 'ru', 'en'].map((l) => `        <a href="${NEWS_FILES[l]}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('\n');
  return `<!DOCTYPE html>
<!-- Fichier généré par scripts/build-home.mjs depuis data/actualites.mjs : ne pas modifier à la main. -->
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(P.title)}</title>
  <meta name="description" content="${escAttr(P.desc)}" />
  <link rel="canonical" href="${url(lang)}" />
  <link rel="alternate" hreflang="fr" href="${url('fr')}" />
  <link rel="alternate" hreflang="ru" href="${url('ru')}" />
  <link rel="alternate" hreflang="en" href="${url('en')}" />
  <link rel="alternate" hreflang="x-default" href="${url('fr')}" />
  <meta property="og:url" content="${url(lang)}" />
  <meta property="og:title" content="${escAttr(P.title.split(' | ')[0])}" />
  <meta property="og:description" content="${escAttr(P.desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://nevsky.fr/images/og/actualites.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#1B3B6F" />
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" /></noscript>
  <link rel="stylesheet" href="css/catechisme.css" />
  <link rel="stylesheet" href="css/priere.css" />
</head>

<body>
  <a class="skip-link" href="#contenu">${P.skip}</a>

  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="ortho-cross" viewBox="0 0 40 64">
      <g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round">
        <line x1="20" y1="2" x2="20" y2="62" />
        <line x1="13" y1="10" x2="27" y2="10" />
        <line x1="5" y1="21" x2="35" y2="21" />
        <line x1="11" y1="41" x2="29" y2="48" />
      </g>
    </symbol>
  </svg>

  <div class="topbar">
    <div class="container">
      <span>${esc(P.eyebrow)}</span>
      <a class="back" href="${HOME[lang]}">${P.back}</a>
    </div>
  </div>

  <header class="site-header">
    <div class="container">
      <a class="brand" href="${HOME[lang]}">
        <svg class="cross" aria-hidden="true"><use href="#ortho-cross" /></svg>
        <span class="brand-text">
          <span class="brand-title">${esc(P.brand)}</span>
          <span class="brand-sub">${esc(P.sub)}</span>
        </span>
      </a>
      <nav class="lang-switch" aria-label="${P.langs}">
${switcher}
      </nav>
    </div>
  </header>

  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <span class="eyebrow">${esc(P.eyebrow)}</span>
      <h1 id="hero-title">${P.h1}</h1>
      <div class="ornament" aria-hidden="true"><svg class="cross"><use href="#ortho-cross" /></svg></div>
      <p class="hero-lead">${esc(nbsp(P.lead, lang))}</p>
    </div>
  </section>

  <main id="contenu">
    <section class="section">
      <div class="container news-list">
${items.join('\n')}
        <p class="news-foot">${esc(nbsp(P.foot, lang))} <a href="${HOME[lang]}#newsletter">${esc(P.nl)}</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <span class="doxology">${esc(nbsp(P.doxo, lang))}</span>
        <span>© <span id="year"></span> ${esc(P.assoc)} · <a href="#" data-top>${P.ttop}</a></span>
      </div>
    </div>
  </footer>

  <button class="to-top" type="button" aria-label="${P.top}" data-top>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
  </button>

  <script src="js/priere.js" defer></script>
</body>
</html>
`;
}

/** Écrit les trois pages d'actualités. */
export function buildNewsPages(root) {
  for (const [lang, file] of Object.entries(NEWS_FILES)) writeFileSync(join(root, file), page(lang));
  console.log(`${Object.values(NEWS_FILES).join(', ')} : ${actualites.length} actualités`);
}
