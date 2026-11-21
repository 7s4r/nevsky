/*
 * Génère sitemap.xml à partir des pages HTML du site (appelé par build-home.mjs).
 *
 * Chaque page .html à la racine est lue : son adresse canonique
 * (<link rel="canonical">) et ses versions dans les autres langues
 * (<link rel="alternate" hreflang="…">) donnent son entrée dans le sitemap.
 * Une nouvelle page apparaît donc automatiquement dès qu'elle a ces balises.
 * Les pages en noindex ou sans adresse canonique sont ignorées.
 *
 * <lastmod> est la date du dernier commit de la page (ou la date du jour si
 * elle a des modifications pas encore commitées).
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = 'https://nevsky.fr/';
const HOME = new Set([SITE, `${SITE}ru.html`, `${SITE}en.html`]);
const LANG_ORDER = ['fr', 'ru', 'en', 'x-default'];

const attr = (tag, name) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function git(root, args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

/** Date de dernière modification d'un fichier, au format AAAA-MM-JJ. */
function lastModified(root, file) {
  const today = new Date().toISOString().slice(0, 10);
  if (git(root, ['status', '--porcelain', '--', file])) return today;
  return git(root, ['log', '-1', '--format=%cs', '--', file]) || today;
}

function readPage(root, file) {
  const html = readFileSync(join(root, file), 'utf8');
  const head = html.slice(0, html.indexOf('</head>') + 1 || undefined);
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(head)) return null;
  const links = head.match(/<link\b[^>]*>/g) || [];
  const canonical = links.map((l) => attr(l, 'rel') === 'canonical' && attr(l, 'href')).find(Boolean);
  if (!canonical) return null;
  const alternates = {};
  for (const l of links) {
    if (attr(l, 'rel') === 'alternate' && attr(l, 'hreflang')) alternates[attr(l, 'hreflang')] = attr(l, 'href');
  }
  const lang = Object.keys(alternates).find((k) => k !== 'x-default' && alternates[k] === canonical);
  return { file, canonical, alternates, lang };
}

export function buildSitemap(root) {
  const files = readdirSync(root).filter((f) => f.endsWith('.html')).sort();
  const pages = [];
  const skipped = [];
  for (const file of files) {
    const page = readPage(root, file);
    if (page) pages.push(page);
    else skipped.push(file);
  }

  // Vérifie que chaque version linguistique annoncée existe et renvoie vers la page
  const byUrl = new Map(pages.map((p) => [p.canonical, p]));
  const warnings = [];
  for (const p of pages) {
    for (const [lang, href] of Object.entries(p.alternates)) {
      const other = byUrl.get(href);
      if (!other) warnings.push(`${p.file} : version ${lang} introuvable (${href})`);
      else if (lang !== 'x-default' && !Object.values(other.alternates).includes(p.canonical))
        warnings.push(`${other.file} ne renvoie pas vers ${p.file}`);
    }
  }

  // Accueil d'abord, puis les autres pages par groupe de langues
  const group = (p) => p.alternates['x-default'] || p.canonical;
  pages.sort((a, b) => {
    const ha = HOME.has(a.canonical) ? 0 : 1;
    const hb = HOME.has(b.canonical) ? 0 : 1;
    return ha - hb || group(a).localeCompare(group(b)) || LANG_ORDER.indexOf(a.lang) - LANG_ORDER.indexOf(b.lang);
  });

  const entries = pages.map((p) => {
    const home = HOME.has(p.canonical);
    const main = p.lang === 'fr';
    const priority = home ? (main ? '1.0' : '0.9') : main ? '0.8' : '0.7';
    const alternates = Object.entries(p.alternates)
      .sort(([a], [b]) => LANG_ORDER.indexOf(a) - LANG_ORDER.indexOf(b))
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${xml(lang)}" href="${xml(href)}"/>`);
    return `  <url>
    <loc>${xml(p.canonical)}</loc>
${alternates.join('\n')}
    <lastmod>${lastModified(root, p.file)}</lastmod>
    <changefreq>${home ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  writeFileSync(
    join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<!-- Fichier généré par scripts/build-home.mjs (npm run build:home) : ne pas modifier à la main. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`,
  );
  console.log(`sitemap.xml : ${pages.length} pages${skipped.length ? ` (ignorées : ${skipped.join(', ')})` : ''}`);
  for (const w of warnings) console.warn(`  attention : ${w}`);
}
