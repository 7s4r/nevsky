#!/usr/bin/env node
/*
 * Génère les pages d'accueil en russe (ru.html) et en anglais (en.html)
 * à partir de index.html (français) et des traductions de js/locales.js.
 *
 * Usage : npm run build:home
 *
 * À relancer après toute modification de index.html ou de js/locales.js,
 * puis committer ru.html et en.html. Aucune dépendance : Node seul suffit.
 *
 * Principe : chaque élément portant data-i18n="clé" reçoit le texte traduit,
 * chaque data-i18n-href="clé" reçoit le lien traduit, et l'en-tête (<title>,
 * description, Open Graph, canonical, langue) est adapté. Les visiteurs et
 * les moteurs de recherche reçoivent ainsi directement la bonne langue,
 * sans attendre le JavaScript.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'index.html'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'js/locales.js'), 'utf8'), sandbox);
const locales = sandbox.window.locales;

const PAGES = {
  ru: { file: 'ru.html', url: 'https://nevsky.fr/ru.html', ogLocale: 'ru_RU' },
  en: { file: 'en.html', url: 'https://nevsky.fr/en.html', ogLocale: 'en_GB' },
};
// Attributs d'accessibilité qui ne passent pas par js/locales.js
const ATTRS = {
  ru: { 'Ouvrir le menu': 'Открыть меню', 'Sélection de la langue': 'Выбор языка', 'Liens utiles': 'Полезные ссылки', 'Aller au contenu': 'Перейти к содержанию' },
  en: { 'Ouvrir le menu': 'Open the menu', 'Sélection de la langue': 'Language selection', 'Liens utiles': 'Useful links', 'Aller au contenu': 'Skip to content' },
};

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');
const VOID = new Set(['meta', 'link', 'img', 'input', 'br', 'hr', 'source']);

/** Remplace le contenu de chaque élément data-i18n par sa traduction. */
function translate(html, dict) {
  const missing = new Set();
  const startTag = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)\bdata-i18n="([^"]+)"([^>]*)>/g;
  let out = '', pos = 0, m;
  while ((m = startTag.exec(html))) {
    const [tag, name, , keyName] = m;
    const value = dict[keyName];
    let start = tag;
    // Lien traduit sur le même élément
    const hrefKey = /data-i18n-href="([^"]+)"/.exec(tag);
    if (hrefKey && dict[hrefKey[1]]) start = start.replace(/\bhref="[^"]*"/, `href="${escAttr(dict[hrefKey[1]])}"`);
    if (value === undefined) { missing.add(keyName); out += html.slice(pos, m.index) + start; pos = m.index + tag.length; continue; }
    if (VOID.has(name.toLowerCase())) {
      start = start.replace(/\bcontent="[^"]*"/, `content="${escAttr(value)}"`);
      out += html.slice(pos, m.index) + start; pos = m.index + tag.length; continue;
    }
    // Trouver la balise fermante correspondante (en comptant les balises du même nom)
    const re = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi');
    re.lastIndex = m.index + tag.length;
    let depth = 1, end;
    while ((end = re.exec(html))) { depth += end[1] ? -1 : 1; if (depth === 0) break; }
    if (!end) throw new Error(`Balise non fermée pour data-i18n="${keyName}"`);
    out += html.slice(pos, m.index) + start + escText(value) + end[0];
    pos = end.index + end[0].length;
    startTag.lastIndex = pos;
  }
  out += html.slice(pos);
  // Liens traduits sur des éléments sans data-i18n
  out = out.replace(/<([a-zA-Z]+)\b([^>]*?)\bdata-i18n-href="([^"]+)"([^>]*)>/g, (tag, n, a, k) =>
    (/data-i18n="/.test(tag) || !dict[k]) ? tag : tag.replace(/\bhref="[^"]*"/, `href="${escAttr(dict[k])}"`));
  return { html: out, missing };
}

for (const [lang, page] of Object.entries(PAGES)) {
  const dict = locales[lang];
  let { html, missing } = translate(source, dict);
  html = html
    .replace('<html lang="fr">', `<html lang="${lang}" data-static-lang="${lang}">`)
    .replace('<link rel="canonical" href="https://nevsky.fr/" />', `<link rel="canonical" href="${page.url}" />`)
    .replace('<meta property="og:url" content="https://nevsky.fr/" />', `<meta property="og:url" content="${page.url}" />`)
    .replace('<meta property="og:locale" content="fr_FR" />', `<meta property="og:locale" content="${page.ogLocale}" />`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escAttr(dict['meta.title'])}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escAttr(dict['meta.description'])}$2`)
    .replace(/<option value="fr">/, '<option value="fr">')
    .replace(new RegExp(`<option value="${lang}">`), `<option value="${lang}" selected>`);
  for (const [fr, tr] of Object.entries(ATTRS[lang])) html = html.split(`"${fr}"`).join(`"${tr}"`);
  html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<!-- Fichier généré par scripts/build-home.mjs à partir de index.html et js/locales.js : ne pas modifier à la main. -->`);
  writeFileSync(join(root, page.file), html);
  console.log(`${page.file} : écrit${missing.size ? ` (clés sans traduction : ${[...missing].join(', ')})` : ''}`);
}
