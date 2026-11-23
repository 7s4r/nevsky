#!/usr/bin/env python3
"""
Extrait de la Bible Crampon 1923 (domaine public) les versets de la citation
biblique du jour, pour le français.

Source : la transcription de Wikisource (« Bible Crampon 1923 »), exportée en
EPUB par l'outil officiel de Wikisource :
  https://ws-export.wmcloud.org/?format=epub-3&lang=fr&page=Bible_Crampon_1923&images=false

Usage :
  python3 scripts/extract-crampon.py chemin/vers/Bible_Crampon_1923.epub
puis :
  node scripts/build-verses.mjs

Le script lit data/versets.txt et écrit data/crampon-versets.json :
{ "Ps 23:1": "texte…", … } pour chaque référence (et chaque verset d'une plage).
À relancer seulement si data/versets.txt change.

Adaptation à l'usage orthodoxe : le nom divin « Yahweh », que Crampon
transcrit, est rendu par « le Seigneur », comme dans la Septante et la liturgie.
"""
import html, json, re, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Code des livres (data/versets.txt) -> nom du fichier dans l'EPUB
FILES = {
    'Gen': 'Genese', 'Exod': 'Exode', 'Lev': 'Levitique', 'Num': 'Nombres', 'Deut': 'Deuteronome',
    'Josh': 'Josue', 'Judg': 'Juges', 'Ruth': 'Ruth', '1Sam': '1_Samuel', '2Sam': '2_Samuel',
    '1Kgs': '1_Rois', '2Kgs': '2_Rois', '1Chr': '1_Chroniques', '2Chr': '2_Chroniques', 'Ezra': 'Esdras',
    'Neh': 'Nehemie', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psaumes_', 'Prov': 'Proverbes',
    'Eccl': 'Ecclesiaste', 'Song': 'Cantique', 'Isa': 'Isaie', 'Jer': 'Jeremie', 'Lam': 'Lamentations',
    'Ezek': 'Ezechiel', 'Dan': 'Daniel', 'Hos': 'Osee', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Abdias',
    'Jonah': 'Jonas', 'Mic': 'Michee', 'Nah': 'Nahum', 'Hab': 'Habacuc', 'Zeph': 'Sophonie', 'Hag': 'Aggee',
    'Zech': 'Zacharie', 'Mal': 'Malachie', 'Matt': 'Matthieu', 'Mark': 'Marc', 'Luke': 'Luc', 'John': 'Jean',
    'Acts': 'Actes', 'Rom': 'Romains', '1Cor': '1_Corinthiens', '2Cor': '2_Corinthiens', 'Gal': 'Galates',
    'Eph': 'Ephesiens', 'Phil': 'Philippiens', 'Col': 'Colossiens', '1Thess': '1_Thessaloniciens',
    '2Thess': '2_Thessaloniciens', '1Tim': '1_Timothee', '2Tim': '2_Timothee', 'Titus': 'Tite',
    'Phlm': 'Philemon', 'Heb': 'Hebreux', 'Jas': 'Jacques', '1Pet': '1_Pierre', '2Pet': '2_Pierre',
    '1John': '1_Jean', '2John': '2_Jean', '3John': '3_Jean', 'Jude': 'Jude', 'Rev': 'Apocalypse',
}

MARK = re.compile(r'<span id="id-(\d+)-(\d+)(?:-n\d+)?">')


def strip(fragment):
    """HTML d'un verset -> texte simple."""
    s = re.sub(r'<sup[^>]*class="[^"]*(?:reference|verset-num)[^"]*"[^>]*>.*?</sup>', '', fragment, flags=re.S)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s).replace(' ', ' ').replace(' ', ' ')
    # Lettres hébraïques des psaumes alphabétiques (« ALEPH. », « BETH. »…)
    s = re.sub(r'\b(?:ALEPH|BETH|GHIMEL|DALETH|HÉ|VAV|ZAÏN|HETH|TETH|YOD|CAPH|LAMED|MEM|NUN|SAMECH|AÏN|PHÉ|TSADÉ|QOPH|RESCH|SCHIN|SIN|THAV)\.?(?=\s|$)', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def parse(text):
    """Contenu d'un livre -> {(chapitre, verset): texte}."""
    # Notes, titres de section et sommaires ne font pas partie du texte
    text = re.sub(r'<ol class="mw-references.*?</ol>', '', text, flags=re.S)
    text = re.sub(r'<h[1-6][^>]*>.*?</h[1-6]>', '', text, flags=re.S)
    # Sommaires des psaumes et des chapitres, numéros de chapitre, numéros de page
    text = re.sub(r'<div class="alinea(?:negatif)?"[^>]*>.*?</div>', '', text, flags=re.S)
    text = re.sub(r'<div style="padding-bottom[^>]*>.*?</div>', '', text, flags=re.S)
    text = re.sub(r'<div[^>]*>\s*<a [^>]*mw-selflink[^>]*>.*?</a>\s*</div>', '', text, flags=re.S)
    text = re.sub(r'<span[^>]*class="pagenum[^"]*"[^>]*/>', '', text)
    marks = list(MARK.finditer(text))
    verses = {}
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
        chunk = text[m.end():end]
        # Fin du chapitre ou du livre : s'arrêter au premier bloc de mise en page suivant
        chunk = re.split(r'<section', chunk)[0]
        verses[(int(m.group(1)), int(m.group(2)))] = strip(chunk)
    return verses


def orthodox(s):
    """« Yahweh » -> « Seigneur » / « le Seigneur », selon l'usage de la Septante."""
    s = s.replace('Seigneur Yahweh', 'Seigneur Dieu')
    s = re.sub(r'\ben Yahweh\b', 'dans le Seigneur', s)
    # Vocatif : « …, Yahweh, … », « : Yahweh, … », « Yahweh, … » en tête de phrase
    s = re.sub(r'([,:] )Yahweh(?=\s*(?:[,;!?.]|$))', r'\1Seigneur', s)
    s = re.sub(r'(^|[.!?«] )Yahweh(?=,)', r'\1Seigneur', s)
    s = re.sub(r'\b([ôÔ]) Yahweh\b', r'\1 Seigneur', s)
    s = re.sub(r'\b([dD])e Yahweh\b', lambda m: m.group(1) + 'u Seigneur', s)
    s = re.sub(r'\b([àÀ]) Yahweh\b', lambda m: ('A' if m.group(1) == 'À' else 'a') + 'u Seigneur', s)
    s = re.sub(r'(^|[.!?«] )Yahweh\b', r'\1Le Seigneur', s)
    return s.replace('Yahweh', 'le Seigneur')


# Corrections manuelles, relues verset par verset : apposition plutôt que
# vocatif, titre de section entré dans le verset, tiret de fin de réplique.
FIXES = {
    'Deut 6:4': ('Israël : Seigneur, notre Dieu, est seul le Seigneur.', 'Israël : le Seigneur, notre Dieu, est le seul Seigneur.'),
    'Ps 18:4': ('digne de louange, Seigneur,', 'digne de louange, le Seigneur,'),
    'Isa 54:10': ('compassion de toi, Seigneur.', 'compassion de toi, le Seigneur.'),
    'Zeph 3:17': ('Seigneur, ton Dieu, est au milieu', 'Le Seigneur, ton Dieu, est au milieu'),
    'Mal 3:6': ('moi, Seigneur, je ne change', 'moi, le Seigneur, je ne change'),
    'Prov 16:9': (' Devoirs des rois ; leur faveur (xvi, 10-15).', ''),
    'Ps 46:12': (' — Séla.', ''),
    'Ps 133:3': (' Ps. cxxxiv (Vulg. cxxxiii) : Que sans trêve prêtres et lévites bénissent le Seigneur !', ''),
    '2Sam 22:2': ('Il dit : le Seigneur', 'Il dit : Le Seigneur'),
}


def tidy(key, s):
    if key in FIXES:
        old, new = FIXES[key]
        if old not in s:
            raise SystemExit(f'{key} : correction manuelle à revoir ({old!r} absent)')
        s = s.replace(old, new)
    s = re.sub(r'^—\s*', '', s)
    return re.sub(r'\s*—\s*$', '', s)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    z = zipfile.ZipFile(sys.argv[1])
    names = z.namelist()
    books = {}

    def book(code):
        if code not in books:
            key = FILES[code]
            files = [n for n in names if re.search(r'_Bible_Crampon_1923_' + re.escape(key) + (r'\d+' if code == 'Ps' else '') + r'\.xhtml$', n)]
            if not files:
                raise SystemExit(f'{code} : fichier introuvable dans l’EPUB')
            books[code] = {}
            for f in files:
                books[code].update(parse(z.read(f).decode('utf-8')))
        return books[code]

    refs = [l.strip() for l in (ROOT / 'data/versets.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]
    out = {}
    for ref in refs:
        m = re.match(r'^(\S+) (\d+):(\d+)(?:-(\d+))?((?: (?:fr|ru)=\d+:\d+(?:-\d+)?)*)$', ref)
        code, ch, a, b = m.group(1), int(m.group(2)), int(m.group(3)), int(m.group(4) or m.group(3))
        fr = re.search(r'fr=(\d+):(\d+)(?:-(\d+))?', m.group(5) or '')
        if fr:
            ch, a, b = int(fr.group(1)), int(fr.group(2)), int(fr.group(3) or fr.group(2))
        data = book(code)
        if code == 'Ps':
            # Psaumes : le titre compte parfois comme un ou deux versets (numérotation
            # hébraïque) ; on garde les versets a..b+2 et le nombre de versets du
            # psaume, et build-verses.mjs calcule le décalage avec l'anglais.
            out[f'Ps {ch}:count'] = max(v for (c, v) in data if c == ch)
            for v in range(a, b + 3):
                if data.get((ch, v)):
                    out[f'Ps {ch}:{v}'] = tidy(f'Ps {ch}:{v}', orthodox(data[(ch, v)]))
            continue
        for v in range(a, b + 1):
            t = data.get((ch, v))
            if not t:
                raise SystemExit(f'{ref} : verset {ch}:{v} introuvable')
            out[f'{code} {ch}:{v}'] = tidy(f'{code} {ch}:{v}', orthodox(t))
    (ROOT / 'data/crampon-versets.json').write_text(json.dumps(out, ensure_ascii=False, indent=0) + '\n')
    print(f'data/crampon-versets.json : {len(out)} entrées')


if __name__ == '__main__':
    main()
