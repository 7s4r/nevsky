/*
 * Calendrier liturgique de la paroisse (calendrier julien de l'Église russe).
 * - Calcule Pâques, les fêtes fixes et mobiles, les périodes de jeûne,
 *   les jours sans jeûne et les samedis des défunts.
 * - Ajoute les mémoires des saints du jour (js/saints.js, chargé à la demande).
 * - Affiche le calendrier mensuel de la page d'accueil, les prochaines fêtes,
 *   les prochains offices (js/offices.js) et génère un fichier agenda (.ics).
 * Les dates civiles = dates juliennes + 13 jours (valable de 1900 à 2099).
 */
(function () {
  'use strict';

  const DAY = 86400000;
  const JULIAN_OFFSET = 13;

  /* ---------- Dates ---------- */
  const mk = (y, m, d) => new Date(y, m - 1, d, 12); // midi : évite les décalages d'heure d'été
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const key = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const sameDay = (a, b) => key(a) === key(b);
  const diffDays = (a, b) => Math.round((mk(a.getFullYear(), a.getMonth() + 1, a.getDate()) - mk(b.getFullYear(), b.getMonth() + 1, b.getDate())) / DAY);
  const julianToCivil = (y, m, d) => addDays(mk(y, m, d), JULIAN_OFFSET);
  const civilToJulian = (d) => { const j = addDays(d, -JULIAN_OFFSET); return { m: j.getMonth() + 1, d: j.getDate() }; };

  /** Pâques orthodoxe (algorithme de Meeus pour le calendrier julien), en date civile. */
  function pascha(y) {
    const a = y % 4, b = y % 7, c = y % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    return julianToCivil(y, month, day);
  }

  /* ---------- Textes ---------- */
  // rank : 'pascha' | 'great12' (douze grandes fêtes) | 'great' | 'parish' | 'saint' | 'lent' | 'departed'
  const FIXED = [ // [mois julien, jour julien, rang, fr, ru, en]
    [1, 1, 'great', 'Circoncision du Seigneur · saint Basile le Grand', 'Обрезание Господне · свт. Василия Великого', 'Circumcision of the Lord · St Basil the Great'],
    [1, 2, 'saint', 'Saint Séraphin de Sarov', 'Прп. Серафима Саровского (преставление)', 'St Seraphim of Sarov'],
    [1, 6, 'great12', 'Théophanie — Baptême du Seigneur', 'Крещение Господне (Богоявление)', 'Theophany — Baptism of the Lord'],
    [2, 2, 'great12', 'Présentation du Seigneur au Temple', 'Сретение Господне', 'Meeting of the Lord in the Temple'],
    [3, 25, 'great12', 'Annonciation', 'Благовещение Пресвятой Богородицы', 'Annunciation'],
    [6, 24, 'great', 'Nativité de saint Jean-Baptiste', 'Рождество Иоанна Предтечи', 'Nativity of St John the Baptist'],
    [6, 29, 'great', 'Saints apôtres Pierre et Paul', 'Свв. первоверховных апостолов Петра и Павла', 'Holy Apostles Peter and Paul'],
    [7, 19, 'saint', 'Saint Séraphin de Sarov (reliques)', 'Прп. Серафима Саровского (обретение мощей)', 'St Seraphim of Sarov (relics)'],
    [8, 6, 'great12', 'Transfiguration du Seigneur', 'Преображение Господне', 'Transfiguration of the Lord'],
    [8, 15, 'great12', 'Dormition de la Mère de Dieu', 'Успение Пресвятой Богородицы', 'Dormition of the Theotokos'],
    [8, 29, 'great', 'Décollation de saint Jean-Baptiste', 'Усекновение главы Иоанна Предтечи', 'Beheading of St John the Baptist'],
    [8, 30, 'parish', 'Saint Alexandre Nevsky (translation des reliques)', 'Блгв. кн. Александра Невского (перенесение мощей)', 'St Alexander Nevsky (translation of relics)'],
    [9, 6, 'saint', 'Miracle de l’archange Michel à Chones', 'Воспоминание чуда Архистратига Михаила в Хонех', 'Miracle of the Archangel Michael at Chonae'],
    [9, 8, 'great12', 'Nativité de la Mère de Dieu', 'Рождество Пресвятой Богородицы', 'Nativity of the Theotokos'],
    [9, 11, 'saint', 'Saint Silouane l’Athonite', 'Прп. Силуана Афонского', 'St Silouan the Athonite'],
    [9, 14, 'great12', 'Exaltation de la Croix', 'Воздвижение Креста Господня', 'Exaltation of the Cross'],
    [10, 1, 'great', 'Protection de la Mère de Dieu', 'Покров Пресвятой Богородицы', 'Protection of the Theotokos'],
    [10, 19, 'saint', 'Saint Jean de Cronstadt (canonisation)', 'Св. прав. Иоанна Кронштадтского (прославление)', 'St John of Kronstadt (glorification)'],
    [11, 8, 'saint', 'Synaxe de l’archistratège Michel et des puissances célestes', 'Собор Архистратига Михаила и прочих Небесных сил бесплотных', 'Synaxis of the Archistrategos Michael and the Bodiless Powers'],
    [11, 21, 'great12', 'Entrée de la Mère de Dieu au Temple', 'Введение во храм Пресвятой Богородицы', 'Entry of the Theotokos into the Temple'],
    [11, 23, 'parish', 'Saint Alexandre Nevsky — fête patronale', 'Блгв. вел. кн. Александра Невского — престольный праздник', 'St Alexander Nevsky — patronal feast'],
    [12, 6, 'saint', 'Saint Nicolas le Thaumaturge', 'Свт. Николая Чудотворца', 'St Nicholas the Wonderworker'],
    [12, 20, 'saint', 'Saint Jean de Cronstadt', 'Св. прав. Иоанна Кронштадтского', 'St John of Kronstadt'],
    [12, 25, 'great12', 'Nativité du Christ', 'Рождество Христово', 'Nativity of Christ'],
  ];
  const MOVABLE = [ // [jours depuis Pâques, rang, fr, ru, en]
    [-70, 'lent', 'Dimanche du Publicain et du Pharisien', 'Неделя о мытаре и фарисее', 'Sunday of the Publican and the Pharisee'],
    [-63, 'lent', 'Dimanche du Fils prodigue', 'Неделя о блудном сыне', 'Sunday of the Prodigal Son'],
    [-57, 'departed', 'Samedi des défunts (avant le Carnaval)', 'Вселенская родительская (мясопустная) суббота', 'Meatfare Saturday of the departed'],
    [-56, 'lent', 'Dimanche du Jugement dernier', 'Неделя о Страшном суде (мясопустная)', 'Sunday of the Last Judgement'],
    [-49, 'lent', 'Dimanche du Pardon', 'Прощеное воскресенье', 'Forgiveness Sunday'],
    [-48, 'lent', 'Lundi pur — début du Grand Carême', 'Чистый понедельник — начало Великого поста', 'Clean Monday — beginning of Great Lent'],
    [-42, 'lent', 'Dimanche de l’Orthodoxie', 'Торжество Православия', 'Sunday of Orthodoxy'],
    [-36, 'departed', 'Samedi des défunts', 'Родительская суббота', 'Saturday of the departed'],
    [-35, 'lent', 'Saint Grégoire Palamas', 'Свт. Григория Паламы', 'St Gregory Palamas'],
    [-29, 'departed', 'Samedi des défunts', 'Родительская суббота', 'Saturday of the departed'],
    [-28, 'lent', 'Vénération de la Croix', 'Крестопоклонная неделя', 'Veneration of the Cross'],
    [-22, 'departed', 'Samedi des défunts', 'Родительская суббота', 'Saturday of the departed'],
    [-21, 'lent', 'Saint Jean Climaque', 'Прп. Иоанна Лествичника', 'St John of the Ladder'],
    [-14, 'lent', 'Sainte Marie l’Égyptienne', 'Прп. Марии Египетской', 'St Mary of Egypt'],
    [-8, 'lent', 'Samedi de Lazare', 'Лазарева суббота', 'Lazarus Saturday'],
    [-7, 'great12', 'Entrée du Seigneur à Jérusalem (Rameaux)', 'Вход Господень в Иерусалим', 'Entry of the Lord into Jerusalem (Palm Sunday)'],
    [-3, 'lent', 'Jeudi saint', 'Великий четверг', 'Holy Thursday'],
    [-2, 'lent', 'Vendredi saint', 'Великая пятница', 'Holy Friday'],
    [-1, 'lent', 'Samedi saint', 'Великая суббота', 'Holy Saturday'],
    [0, 'pascha', 'PÂQUES — Résurrection du Christ', 'ПАСХА — Светлое Христово Воскресение', 'PASCHA — Resurrection of Christ'],
    [7, 'saint', 'Dimanche de Thomas', 'Антипасха (Фомина неделя)', 'Thomas Sunday'],
    [9, 'departed', 'Radonitsa — mémoire des défunts', 'Радоница', 'Radonitsa — commemoration of the departed'],
    [24, 'saint', 'Mi-Pentecôte', 'Преполовение Пятидесятницы', 'Mid-Pentecost'],
    [39, 'great12', 'Ascension du Seigneur', 'Вознесение Господне', 'Ascension of the Lord'],
    [48, 'departed', 'Samedi des défunts (de la Trinité)', 'Троицкая родительская суббота', 'Trinity Saturday of the departed'],
    [49, 'great12', 'Pentecôte — Sainte Trinité', 'День Святой Троицы (Пятидесятница)', 'Pentecost — Holy Trinity'],
    [50, 'saint', 'Lundi du Saint-Esprit', 'День Святого Духа', 'Monday of the Holy Spirit'],
    [56, 'saint', 'Dimanche de tous les saints', 'Неделя всех святых', 'Sunday of All Saints'],
    [63, 'saint', 'Tous les saints de Russie', 'Всех святых, в земле Российской просиявших', 'All Saints of Russia'],
  ];
  const T = {
    fr: {
      week: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
      lent: 'Grand Carême', apostles: 'Jeûne des Apôtres', dormition: 'Jeûne de la Dormition', nativity: 'Jeûne de la Nativité',
      fastDay: 'Jour de jeûne', wedfri: 'Jour de jeûne (mercredi et vendredi)', noFast: 'Pas de jeûne', cheese: 'Semaine des laitages : sans viande',
      fishFeast: 'Jour de jeûne adouci par la fête : poisson permis',
      strict: 'Jeûne strict',
      dmitri: 'Samedi des défunts de saint Démétrios', offices: 'Offices', noOffice: 'Aucun office annoncé ce jour-là.',
      upcomingFeasts: 'Prochaines fêtes', upcomingOffices: 'Prochains offices', noOffices: 'Aucun office n’est annoncé pour le moment. Inscrivez-vous à la newsletter pour connaître la reprise des offices.',
      today: 'Aujourd’hui', period: 'Période actuelle', julian: 'calendrier julien', legend: ['Grande fête', 'Saint, fête patronale', 'Jeûne', 'Office'],
      ics: 'Calendrier de la paroisse Saint-Alexandre-Nevsky', icsDesc: 'Fêtes et offices de l’église orthodoxe russe Saint-Alexandre-Nevsky de Pau.',
      sundays: 'Dimanche',
    },
    ru: {
      week: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      lent: 'Великий пост', apostles: 'Петров пост', dormition: 'Успенский пост', nativity: 'Рождественский пост',
      fastDay: 'Постный день', wedfri: 'Постный день (среда и пятница)', noFast: 'Сплошная седмица (поста нет)', cheese: 'Сырная седмица: без мяса',
      fishFeast: 'Постный день, ослабленный праздником: разрешается рыба',
      strict: 'Строгий пост',
      dmitri: 'Дмитриевская родительская суббота', offices: 'Богослужения', noOffice: 'Богослужений в этот день не объявлено.',
      upcomingFeasts: 'Ближайшие праздники', upcomingOffices: 'Ближайшие богослужения', noOffices: 'Пока богослужения не объявлены. Подпишитесь на рассылку, чтобы узнать о их возобновлении.',
      today: 'Сегодня', period: 'Сейчас', julian: 'по старому стилю', legend: ['Великий праздник', 'Святой, престольный праздник', 'Пост', 'Богослужение'],
      ics: 'Календарь прихода св. Александра Невского', icsDesc: 'Праздники и богослужения русского православного храма св. Александра Невского в По.',
      sundays: 'Воскресенье',
    },
    en: {
      week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      lent: 'Great Lent', apostles: 'Apostles’ Fast', dormition: 'Dormition Fast', nativity: 'Nativity Fast',
      fastDay: 'Fast day', wedfri: 'Fast day (Wednesday and Friday)', noFast: 'Fast-free week', cheese: 'Cheesefare week: no meat',
      fishFeast: 'Fast day relaxed for the feast: fish allowed',
      strict: 'Strict fast',
      dmitri: 'St Demetrius Saturday of the departed', offices: 'Services', noOffice: 'No service announced for this day.',
      upcomingFeasts: 'Upcoming feasts', upcomingOffices: 'Upcoming services', noOffices: 'No services have been announced yet. Subscribe to the newsletter to hear when services resume.',
      today: 'Today', period: 'Current period', julian: 'Julian calendar', legend: ['Great feast', 'Saint, patronal feast', 'Fast', 'Service'],
      ics: 'St Alexander Nevsky parish calendar', icsDesc: 'Feasts and services of the St Alexander Nevsky Russian Orthodox Church in Pau.',
      sundays: 'Sunday',
    },
  };
  const LANGS = { fr: 3, ru: 4, en: 5 };
  const LOCALE = { fr: 'fr-FR', ru: 'ru-RU', en: 'en-GB' };
  const WEEKDAYS = { dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6 };

  const isGreat = (r) => r === 'pascha' || r === 'great12' || r === 'great';

  /* ---------- Calcul d'un jour ---------- */
  const cache = {};
  function yearData(y) {
    if (cache[y]) return cache[y];
    const P = pascha(y);
    // Samedi de saint Démétrios : samedi précédant le 26 octobre julien (8 novembre civil)
    let dm = julianToCivil(y, 10, 26); dm = addDays(dm, -1);
    while (dm.getDay() !== 6) dm = addDays(dm, -1);
    return (cache[y] = { P, dmitri: dm });
  }

  /** Renvoie les informations liturgiques d'une date civile. */
  function dayInfo(date, lang) {
    const L = T[lang] || T.fr, li = LANGS[lang] || 3;
    const y = date.getFullYear(), { P, dmitri } = yearData(y);
    const p = diffDays(date, P);
    const j = civilToJulian(date);
    const feasts = [];
    FIXED.forEach((f) => { if (f[0] === j.m && f[1] === j.d) feasts.push({ rank: f[2], name: f[li] }); });
    MOVABLE.forEach((f) => { if (f[0] === p) feasts.push({ rank: f[1], name: f[li - 1] }); });
    if (sameDay(date, dmitri)) feasts.push({ rank: 'departed', name: L.dmitri });
    // Mémoires des saints du jour (js/saints.js, chargé à l'affichage du calendrier)
    ((window.NEVSKY_SAINTS || {})[j.m + '-' + j.d] || []).forEach((f) => feasts.push({ rank: f[3] ? 'saint' : 'memory', name: f[li - 3] }));

    // Périodes de jeûne
    let fast = null;
    const md = (date.getMonth() + 1) * 100 + date.getDate();
    const apostlesEnd = mk(y, 7, 11), apostlesStart = addDays(P, 57);
    if (p >= -48 && p <= -1) fast = { kind: 'lent', name: L.lent };
    else if (date >= apostlesStart && date <= apostlesEnd) fast = { kind: 'period', name: L.apostles };
    else if (md >= 814 && md <= 827) fast = { kind: 'period', name: L.dormition };
    else if (md >= 1128 || md <= 106) fast = { kind: 'period', name: L.nativity };
    else if (md === 118 || md === 911 || md === 927) fast = { kind: 'day', name: L.strict };

    // Semaines sans jeûne et mercredis / vendredis
    let note = null;
    const freeWeek = (md >= 107 && md <= 117) || (p >= -69 && p <= -64) || (p >= 1 && p <= 6) || (p >= 50 && p <= 56);
    if (p >= -55 && p <= -50) note = L.cheese;
    else if (freeWeek) note = L.noFast;
    else if (!fast && (date.getDay() === 3 || date.getDay() === 5)) fast = { kind: 'day', name: feasts.some((f) => isGreat(f.rank)) ? L.fishFeast : L.wedfri };
    return { feasts, fast, note };
  }

  /* ---------- Offices (js/offices.js) ---------- */
  function officesOn(date, lang) {
    const data = window.NEVSKY_OFFICES || {};
    const k = key(date), out = [];
    if (!(data.cancelled || []).includes(k)) {
      (data.weekly || []).forEach((o) => {
        if (WEEKDAYS[String(o.day).toLowerCase()] !== date.getDay()) return;
        if (o.from && k < o.from) return;
        if (o.until && k > o.until) return;
        out.push(o);
      });
    }
    (data.dates || []).forEach((o) => { if (o.date === k) out.push(o); });
    return out.map((o) => ({ time: o.time || '', duration: o.duration || 120, name: o[lang] || o.fr || '', note: o['note' + lang.charAt(0).toUpperCase() + lang.slice(1)] || o.noteFr || '' }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  /* ---------- Rendu ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtDate = (d, lang, opts) => d.toLocaleDateString(LOCALE[lang] || 'fr-FR', opts || { weekday: 'long', day: 'numeric', month: 'long' });
  const julianLabel = (d, lang) => { const j = addDays(d, -JULIAN_OFFSET); return j.toLocaleDateString(LOCALE[lang] || 'fr-FR', { day: 'numeric', month: 'long' }); };

  let state = { month: null, lang: 'fr', selected: null };

  function detailHtml(date, lang) {
    const L = T[lang] || T.fr, info = dayInfo(date, lang), off = officesOn(date, lang);
    let h = `<p class="font-semibold text-slate-900">${esc(fmtDate(date, lang).replace(/^./, (c) => c.toUpperCase()))} <span class="font-normal text-slate-500">(${esc(julianLabel(date, lang))}, ${esc(L.julian)})</span></p>`;
    if (info.feasts.length) h += '<ul class="mt-2 space-y-1">' + info.feasts.map((f) => `<li class="flex gap-2"><span class="mt-2 h-2 w-2 flex-none rounded-full ${isGreat(f.rank) ? 'bg-[#d4af37]' : f.rank === 'departed' || f.rank === 'lent' ? 'bg-slate-400' : f.rank === 'memory' ? 'bg-slate-300' : 'bg-[#1B3B6F]'}"></span><span class="${f.rank === 'pascha' || f.rank === 'great12' ? 'font-semibold text-slate-900' : f.rank === 'memory' ? 'text-sm text-slate-600' : 'text-slate-700'}">${esc(f.name)}</span></li>`).join('') + '</ul>';
    if (info.fast) h += `<p class="mt-2 text-sm text-violet-800"><span class="inline-block h-2 w-2 rounded-full bg-violet-500 align-middle"></span> ${esc(info.fast.name)}</p>`;
    if (info.note) h += `<p class="mt-2 text-sm text-emerald-800">${esc(info.note)}</p>`;
    h += `<p class="mt-3 text-sm font-semibold text-slate-900">${esc(L.offices)}</p>`;
    h += off.length ? '<ul class="mt-1 space-y-1 text-sm text-slate-700">' + off.map((o) => `<li><span class="font-semibold">${esc(o.time)}</span> ${esc(o.name)}${o.note ? ' — ' + esc(o.note) : ''}</li>`).join('') + '</ul>' : `<p class="mt-1 text-sm text-slate-500">${esc(L.noOffice)}</p>`;
    return h;
  }

  function renderMonth() {
    const grid = document.getElementById('calendarGrid'), title = document.getElementById('calendarTitle'), head = document.getElementById('calendarHead');
    if (!grid) return;
    const { month, lang } = state, L = T[lang] || T.fr;
    title.textContent = month.toLocaleDateString(LOCALE[lang] || 'fr-FR', { month: 'long', year: 'numeric' }).replace(/^./, (c) => c.toUpperCase());
    if (head) head.innerHTML = L.week.map((w) => `<div>${w}</div>`).join('');
    const first = mk(month.getFullYear(), month.getMonth() + 1, 1);
    const start = (first.getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const today = new Date();
    let html = '';
    for (let i = 0; i < start; i++) html += '<div class="h-11"></div>';
    for (let d = 1; d <= days; d++) {
      const date = mk(month.getFullYear(), month.getMonth() + 1, d);
      const info = dayInfo(date, lang), off = officesOn(date, lang);
      const great = info.feasts.some((f) => isGreat(f.rank)), pas = info.feasts.some((f) => f.rank === 'pascha');
      const saint = info.feasts.some((f) => f.rank === 'parish' || f.rank === 'saint');
      const sel = state.selected && sameDay(state.selected, date);
      const cls = ['relative h-11 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-[#ffd615]'];
      cls.push(pas ? 'border-[#d4af37] bg-[#fff7d1] font-bold text-slate-900' : great ? 'border-[#d4af37] font-semibold text-slate-900' : 'border-slate-200 text-slate-700');
      if (info.fast && !pas) cls.push('bg-violet-50');
      if (date.getDay() === 0 && !pas) cls.push('text-red-700');
      if (sameDay(date, today)) cls.push('ring-2 ring-[#1B3B6F]');
      if (sel) cls.push('outline outline-2 outline-offset-1 outline-[#d4af37]');
      cls.push('hover:bg-slate-50');
      const dots = (great ? '<span class="h-1.5 w-1.5 rounded-full bg-[#d4af37]"></span>' : '') + (saint ? '<span class="h-1.5 w-1.5 rounded-full bg-[#1B3B6F]"></span>' : '') + (off.length ? '<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>' : '');
      const label = fmtDate(date, lang) + (info.feasts.some((f) => f.rank !== 'memory') ? ' — ' + info.feasts.filter((f) => f.rank !== 'memory').map((f) => f.name).join(', ') : '') + (info.fast ? ' — ' + info.fast.name : '');
      html += `<button type="button" class="${cls.join(' ')}" data-date="${key(date)}" aria-label="${esc(label)}" aria-pressed="${sel ? 'true' : 'false'}">${d}<span class="absolute inset-x-0 bottom-1 flex justify-center gap-0.5">${dots}</span></button>`;
    }
    grid.innerHTML = html;
    const legend = document.getElementById('calendarLegend');
    if (legend) legend.innerHTML = [['bg-[#d4af37]', L.legend[0]], ['bg-[#1B3B6F]', L.legend[1]], ['bg-violet-300', L.legend[2]], ['bg-emerald-500', L.legend[3]]]
      .map(([c, t]) => `<span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full ${c}"></span>${esc(t)}</span>`).join('');
    showDetail(state.selected && state.selected.getMonth() === month.getMonth() ? state.selected : null);
  }

  function showDetail(date) {
    const box = document.getElementById('calendarDetail');
    if (!box) return;
    const d = date || (state.month.getMonth() === new Date().getMonth() && state.month.getFullYear() === new Date().getFullYear() ? new Date() : null);
    box.innerHTML = d ? detailHtml(mk(d.getFullYear(), d.getMonth() + 1, d.getDate()), state.lang) : '';
    box.hidden = !d;
  }

  /** Prochaines fêtes et offices (colonne de gauche). */
  function renderUpcoming() {
    const lang = state.lang, L = T[lang] || T.fr;
    const feastsBox = document.getElementById('upcomingFeasts'), officesBox = document.getElementById('upcomingOffices');
    const today = new Date(), start = mk(today.getFullYear(), today.getMonth() + 1, today.getDate());
    if (feastsBox) {
      const items = [];
      let current = dayInfo(start, lang).fast;
      for (let i = 0; i < 400 && items.length < 6; i++) {
        const d = addDays(start, i);
        dayInfo(d, lang).feasts.filter((f) => isGreat(f.rank) || f.rank === 'parish').forEach((f) => items.push({ d, f }));
      }
      feastsBox.innerHTML = `<h3 class="text-lg font-semibold text-slate-900">${esc(L.upcomingFeasts)}</h3>`
        + (current && current.kind !== 'day' ? `<p class="mt-2 text-sm text-violet-800"><span class="font-semibold">${esc(L.period)} :</span> ${esc(current.name)}</p>` : '')
        + '<ul class="mt-3 divide-y divide-slate-100">' + items.slice(0, 6).map(({ d, f }) => `<li class="flex items-baseline justify-between gap-4 py-2"><span class="${f.rank === 'pascha' || f.rank === 'great12' ? 'font-semibold text-slate-900' : 'text-slate-700'}">${esc(f.name)}</span><span class="flex-none text-sm text-slate-500">${esc(fmtDate(d, lang, { day: 'numeric', month: 'short' }))}</span></li>`).join('') + '</ul>';
    }
    if (officesBox) {
      const items = [];
      for (let i = 0; i < 120 && items.length < 5; i++) { const d = addDays(start, i); officesOn(d, lang).forEach((o) => items.push({ d, o })); }
      officesBox.innerHTML = `<h3 class="text-lg font-semibold text-slate-900">${esc(L.upcomingOffices)}</h3>`
        + (items.length ? '<ul class="mt-3 divide-y divide-slate-100">' + items.slice(0, 5).map(({ d, o }) => `<li class="flex items-baseline justify-between gap-4 py-2"><span class="text-slate-700">${esc(o.name)}${o.note ? ' — ' + esc(o.note) : ''}</span><span class="flex-none text-sm text-slate-500">${esc(fmtDate(d, lang, { weekday: 'short', day: 'numeric', month: 'short' }))} · ${esc(o.time)}</span></li>`).join('') + '</ul>'
          : `<p class="mt-2 text-sm text-slate-600">${esc(L.noOffices)}</p>`);
    }
  }

  /* ---------- Fichier agenda (.ics) ---------- */
  const icsEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const icsDate = (d) => key(d).replace(/-/g, '');
  const fold = (line) => { const out = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); };
  function buildIcs(lang) {
    const L = T[lang] || T.fr, now = new Date();
    const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//nevsky.fr//Calendrier paroissial//' + lang.toUpperCase(), 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'X-WR-CALNAME:' + icsEsc(L.ics), 'X-WR-TIMEZONE:Europe/Paris',
      'BEGIN:VTIMEZONE', 'TZID:Europe/Paris',
      'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
      'END:VTIMEZONE'];
    const start = mk(now.getFullYear(), now.getMonth() + 1, now.getDate());
    for (let i = 0; i < 366; i++) {
      const d = addDays(start, i);
      dayInfo(d, lang).feasts.filter((f) => isGreat(f.rank) || f.rank === 'parish').forEach((f, n) => {
        lines.push('BEGIN:VEVENT', `UID:feast-${icsDate(d)}-${n}@nevsky.fr`, 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + icsDate(d), 'DTEND;VALUE=DATE:' + icsDate(addDays(d, 1)),
          'SUMMARY:' + icsEsc(f.name), 'TRANSP:TRANSPARENT', 'END:VEVENT');
      });
      officesOn(d, lang).forEach((o, n) => {
        if (!/^\d{1,2}:\d{2}$/.test(o.time)) return;
        const [h, m] = o.time.split(':').map(Number);
        const s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m), e = new Date(s.getTime() + o.duration * 60000);
        const f = (x) => icsDate(x) + 'T' + String(x.getHours()).padStart(2, '0') + String(x.getMinutes()).padStart(2, '0') + '00';
        lines.push('BEGIN:VEVENT', `UID:office-${f(s)}-${n}@nevsky.fr`, 'DTSTAMP:' + stamp, 'DTSTART;TZID=Europe/Paris:' + f(s), 'DTEND;TZID=Europe/Paris:' + f(e),
          'SUMMARY:' + icsEsc(o.name), 'LOCATION:' + icsEsc('Église orthodoxe russe Saint-Alexandre-Nevsky, Pau'), o.note ? 'DESCRIPTION:' + icsEsc(o.note) : 'DESCRIPTION:' + icsEsc(L.icsDesc), 'END:VEVENT');
      });
    }
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }
  function downloadIcs() {
    const blob = new Blob([buildIcs(state.lang)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nevsky-calendrier.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- Initialisation ---------- */
  let wired = false;
  function wire() {
    if (wired) return; wired = true;
    document.getElementById('prevMonth')?.addEventListener('click', () => { state.month = mk(state.month.getFullYear(), state.month.getMonth(), 1); renderMonth(); });
    document.getElementById('nextMonth')?.addEventListener('click', () => { state.month = mk(state.month.getFullYear(), state.month.getMonth() + 2, 1); renderMonth(); });
    document.getElementById('calendarGrid')?.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-date]'); if (!b) return;
      const [y, m, d] = b.dataset.date.split('-').map(Number);
      state.selected = mk(y, m, d); renderMonth();
    });
    document.getElementById('icsBtn')?.addEventListener('click', (e) => { e.preventDefault(); downloadIcs(); });
  }

  /** Appelé par main.js à chaque changement de langue. */
  // Le calendrier est calculé seulement quand la section approche de l'écran,
  // pour ne pas ralentir le chargement de la page.
  let visible = false, observer = null;
  let saintsRequested = false;
  /** Charge js/saints.min.js une seule fois, puis redessine le mois. */
  function loadSaints() {
    if (saintsRequested || window.NEVSKY_SAINTS) return;
    saintsRequested = true;
    const src = document.querySelector('script[src*="calendar"]')?.getAttribute('src') || 'js/calendar.min.js';
    const s = document.createElement('script');
    s.src = src.replace(/calendar(\.min)?\.js.*$/, 'saints.min.js');
    s.defer = true;
    s.onload = () => renderMonth();
    document.head.appendChild(s);
  }
  function draw() { wire(); renderMonth(); renderUpcoming(); loadSaints(); }
  function render(lang) {
    state.lang = T[lang] ? lang : 'fr';
    if (!state.month) { const n = new Date(); state.month = mk(n.getFullYear(), n.getMonth() + 1, 1); }
    wire();
    const section = document.getElementById('events');
    if (visible || !section || !('IntersectionObserver' in window)) { visible = true; draw(); return; }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { visible = true; observer.disconnect(); draw(); }
      }, { rootMargin: '600px 0px' });
      observer.observe(section);
    }
  }

  window.NevskyCalendar = { render, dayInfo, pascha, buildIcs, officesOn };
})();
