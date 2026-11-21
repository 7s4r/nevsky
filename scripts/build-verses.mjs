#!/usr/bin/env node
/*
 * Génère la citation biblique du jour (js/verses.fr.js, js/verses.ru.js,
 * js/verses.en.js) à partir de data/versets.txt.
 *
 * Usage : node scripts/build-verses.mjs   (Node 18+, accès à api.getbible.net)
 *
 * Traductions du domaine public : Louis Segond 1910 (français), traduction
 * synodale (russe), King James (anglais). Les chapitres téléchargés sont gardés
 * dans .cache/bible/ pour ne pas les retélécharger.
 *
 * Les Psaumes sont cités dans la numérotation française / anglaise ; pour le
 * russe, le script passe à la numérotation de la Septante (Пс 22 = Ps 23) et
 * décale les versets quand la traduction synodale compte le titre comme verset.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, '.cache', 'bible');
mkdirSync(cacheDir, { recursive: true });

// [numéro, code, français, russe, anglais]
const BOOKS = [
  [1, 'Gen', 'Genèse', 'Быт.', 'Genesis'], [2, 'Exod', 'Exode', 'Исх.', 'Exodus'], [3, 'Lev', 'Lévitique', 'Лев.', 'Leviticus'],
  [4, 'Num', 'Nombres', 'Чис.', 'Numbers'], [5, 'Deut', 'Deutéronome', 'Втор.', 'Deuteronomy'], [6, 'Josh', 'Josué', 'Нав.', 'Joshua'],
  [7, 'Judg', 'Juges', 'Суд.', 'Judges'], [8, 'Ruth', 'Ruth', 'Руф.', 'Ruth'], [9, '1Sam', '1 Samuel', '1 Цар.', '1 Samuel'],
  [10, '2Sam', '2 Samuel', '2 Цар.', '2 Samuel'], [11, '1Kgs', '1 Rois', '3 Цар.', '1 Kings'], [12, '2Kgs', '2 Rois', '4 Цар.', '2 Kings'],
  [13, '1Chr', '1 Chroniques', '1 Пар.', '1 Chronicles'], [14, '2Chr', '2 Chroniques', '2 Пар.', '2 Chronicles'], [15, 'Ezra', 'Esdras', '1 Ездр.', 'Ezra'],
  [16, 'Neh', 'Néhémie', 'Неем.', 'Nehemiah'], [17, 'Esth', 'Esther', 'Есф.', 'Esther'], [18, 'Job', 'Job', 'Иов.', 'Job'],
  [19, 'Ps', 'Psaume', 'Пс.', 'Psalm'], [20, 'Prov', 'Proverbes', 'Притч.', 'Proverbs'], [21, 'Eccl', 'Ecclésiaste', 'Еккл.', 'Ecclesiastes'],
  [22, 'Song', 'Cantique des cantiques', 'Песн.', 'Song of Songs'], [23, 'Isa', 'Ésaïe', 'Ис.', 'Isaiah'], [24, 'Jer', 'Jérémie', 'Иер.', 'Jeremiah'],
  [25, 'Lam', 'Lamentations', 'Плач.', 'Lamentations'], [26, 'Ezek', 'Ézéchiel', 'Иез.', 'Ezekiel'], [27, 'Dan', 'Daniel', 'Дан.', 'Daniel'],
  [28, 'Hos', 'Osée', 'Ос.', 'Hosea'], [29, 'Joel', 'Joël', 'Иоил.', 'Joel'], [30, 'Amos', 'Amos', 'Ам.', 'Amos'],
  [31, 'Obad', 'Abdias', 'Авд.', 'Obadiah'], [32, 'Jonah', 'Jonas', 'Ион.', 'Jonah'], [33, 'Mic', 'Michée', 'Мих.', 'Micah'],
  [34, 'Nah', 'Nahum', 'Наум.', 'Nahum'], [35, 'Hab', 'Habacuc', 'Авв.', 'Habakkuk'], [36, 'Zeph', 'Sophonie', 'Соф.', 'Zephaniah'],
  [37, 'Hag', 'Aggée', 'Агг.', 'Haggai'], [38, 'Zech', 'Zacharie', 'Зах.', 'Zechariah'], [39, 'Mal', 'Malachie', 'Мал.', 'Malachi'],
  [40, 'Matt', 'Matthieu', 'Мф.', 'Matthew'], [41, 'Mark', 'Marc', 'Мк.', 'Mark'], [42, 'Luke', 'Luc', 'Лк.', 'Luke'],
  [43, 'John', 'Jean', 'Ин.', 'John'], [44, 'Acts', 'Actes', 'Деян.', 'Acts'], [45, 'Rom', 'Romains', 'Рим.', 'Romans'],
  [46, '1Cor', '1 Corinthiens', '1 Кор.', '1 Corinthians'], [47, '2Cor', '2 Corinthiens', '2 Кор.', '2 Corinthians'], [48, 'Gal', 'Galates', 'Гал.', 'Galatians'],
  [49, 'Eph', 'Éphésiens', 'Еф.', 'Ephesians'], [50, 'Phil', 'Philippiens', 'Флп.', 'Philippians'], [51, 'Col', 'Colossiens', 'Кол.', 'Colossians'],
  [52, '1Thess', '1 Thessaloniciens', '1 Фес.', '1 Thessalonians'], [53, '2Thess', '2 Thessaloniciens', '2 Фес.', '2 Thessalonians'], [54, '1Tim', '1 Timothée', '1 Тим.', '1 Timothy'],
  [55, '2Tim', '2 Timothée', '2 Тим.', '2 Timothy'], [56, 'Titus', 'Tite', 'Тит.', 'Titus'], [57, 'Phlm', 'Philémon', 'Флм.', 'Philemon'],
  [58, 'Heb', 'Hébreux', 'Евр.', 'Hebrews'], [59, 'Jas', 'Jacques', 'Иак.', 'James'], [60, '1Pet', '1 Pierre', '1 Пет.', '1 Peter'],
  [61, '2Pet', '2 Pierre', '2 Пет.', '2 Peter'], [62, '1John', '1 Jean', '1 Ин.', '1 John'], [63, '2John', '2 Jean', '2 Ин.', '2 John'],
  [64, '3John', '3 Jean', '3 Ин.', '3 John'], [65, 'Jude', 'Jude', 'Иуд.', 'Jude'], [66, 'Rev', 'Apocalypse', 'Откр.', 'Revelation'],
];
const BY_CODE = Object.fromEntries(BOOKS.map((b) => [b[1], b]));
const TRANSLATIONS = { fr: 'ls1910', ru: 'synodal', en: 'kjv' };
// Chapitres de longueur différente, mais verset vérifié identique
const OK = new Set(['Mark 9:23 fr', 'Rom 14:8 ru', 'Josh 24:15 ru', 'Prov 4:23 ru', 'Eccl 4:9 fr', 'Eccl 4:9 ru', 'Nah 1:7 fr']);
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Psaume (numérotation hébraïque) → psaume de la Septante (russe). */
function lxxPsalm(n) {
  if (n <= 8 || n >= 148) return n;
  if (n === 9 || n === 10 || n === 114 || n === 115 || n === 116 || n === 147) throw new Error(`Psaume ${n} : découpage différent en russe, choisir un autre psaume`);
  return n - 1;
}

async function chapter(tr, book, ch) {
  const file = join(cacheDir, `${tr}-${book}-${ch}.json`);
  if (!existsSync(file)) {
    const res = await fetch(`https://api.getbible.net/v2/${tr}/${book}/${ch}.json`);
    if (!res.ok) throw new Error(`${tr} ${book}:${ch} : HTTP ${res.status}`);
    writeFileSync(file, await res.text());
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

const clean = (s) => s.replace(/[  ]+/g, ' ').replace(/\s+([,;:!?.»])/g, (m, p) => (/[;:!?»]/.test(p) ? ' ' + p : p)).replace(/\s+/g, ' ').trim();

const refs = readFileSync(join(root, 'data/versets.txt'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
if (refs.length !== 366) throw new Error(`data/versets.txt : ${refs.length} références au lieu de 366`);

const out = { fr: {}, ru: {}, en: {} };
const warnings = [];
let i = 0;
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= DAYS[m - 1]; d++, i++) {
    const ref = refs[i];
    const r = /^(\S+) (\d+):(\d+)(?:-(\d+))?((?: (?:fr|ru)=\d+:\d+(?:-\d+)?)*)$/.exec(ref);
    if (!r || !BY_CODE[r[1]]) throw new Error(`Référence invalide : ${ref}`);
    const [, code, ch, v1, v2 = v1, extra] = r;
    // Corrections pour une traduction dont la numérotation diffère (ex. « fr=9:5 »)
    const fix = Object.fromEntries([...extra.matchAll(/(fr|ru)=(\d+):(\d+)(?:-(\d+))?/g)].map(([, l, c, a, b]) => [l, [+c, +a, +(b || a)]]));
    const book = BY_CODE[code];
    const key = `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const kjv = await chapter('kjv', book[0], +ch);
    for (const [lang, tr] of Object.entries(TRANSLATIONS)) {
      let c = +ch, a = +v1, b = +v2;
      let data = lang === 'en' ? kjv : null;
      if (fix[lang]) {
        [c, a, b] = fix[lang];
        data = await chapter(tr, book[0], c);
      } else if (lang !== 'en' && book[0] === 19) {
        // Psaumes : la Bible russe suit la Septante ; Segond et la traduction
        // synodale comptent parfois le titre du psaume comme un verset.
        if (lang === 'ru') c = lxxPsalm(+ch);
        data = await chapter(tr, 19, c);
        const offset = data.verses.length - kjv.verses.length;
        if (offset < 0 || offset > 2) warnings.push(`${ref} : décalage de versets inattendu en ${lang} (${offset})`);
        a += offset; b += offset;
      } else if (!data) {
        data = await chapter(tr, book[0], c);
        if (data.verses.length !== kjv.verses.length && !OK.has(`${ref} ${lang}`)) warnings.push(`${ref} : ${lang} compte ${data.verses.length} versets dans ce chapitre (anglais : ${kjv.verses.length}), à vérifier`);
      }
      const verses = data.verses.filter((v) => v.verse >= a && v.verse <= b);
      if (verses.length !== b - a + 1) throw new Error(`${ref} : versets introuvables en ${lang}`);
      let text = clean(verses.map((v) => v.text).join(' '));
      // Titre du psaume compté dans le verset 1 (« Cantique de David. … »)
      if (book[0] === 19) text = text.replace(/^(?:(?:Cantique|Psaume|Au chef des chantres|Prière|Hymne|Maskil|Miktam)[^.]*\.\s+)+/, '');
      if (lang === 'ru') text = text.replace(/ - /g, ' — ');
      // Citation coupée au milieu d'une phrase : finir par des points de suspension
      text = text.replace(/[\s,;:\u202f-]+$/, '').replace(/([^.!?…»”"])$/, '$1…');
      const name = book[{ fr: 2, ru: 3, en: 4 }[lang]];
      const range = a === b ? `${a}` : `${a}-${b}`;
      const label = lang === 'fr' ? `${name} ${c}, ${range}` : `${name} ${c}:${range}`;
      out[lang][key] = [text, label];
    }
  }
}

for (const lang of Object.keys(out)) {
  const file = join(root, `js/verses.${lang}.js`);
  writeFileSync(file, `/* Citation biblique du jour (${TRANSLATIONS[lang]}, domaine public). Fichier généré par scripts/build-verses.mjs depuis data/versets.txt : ne pas modifier à la main. */\nwindow.NEVSKY_VERSES=${JSON.stringify(out[lang])};\n`);
  console.log(`js/verses.${lang}.js : ${Object.keys(out[lang]).length} jours`);
}
for (const w of warnings) console.warn('  attention : ' + w);
