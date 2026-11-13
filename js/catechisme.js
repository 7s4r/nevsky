/* ==========================================================
   Catéchèse orthodoxe — logique de l'application (vanilla JS)
   Modules : onglets · accordéons · modales · recherche globale ·
             filtres FAQ · navigation par ancres · retour en haut
   ========================================================== */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Normalise un texte pour la recherche : minuscules, sans accents, apostrophes unifiées. */
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'");
  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------------------------------------------------
     0. LANGUE + DONNÉES
     La langue est celle de <html lang="…"> ; les données du catéchisme
     viennent de js/catechisme-data.<langue>.js (window.CATECHISM_DATA).
     --------------------------------------------------------- */
  const LANG = (document.documentElement.lang || 'fr').slice(0, 2);
  const { chapters: CATECHISM_CHAPTERS, items: CATECHISM, creedLines: CREED_LINES } = window.CATECHISM_DATA;

  /** Pluriel russe : 1 вопрос, 2-4 вопроса, 5+ вопросов. */
  const ruPlural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  const frS = (n) => (n > 1 ? 's' : '');

  const I18N = {
    fr: {
      qn: 'Q',
      deepen: (n) => `Approfondir : ${n} questions du catéchisme sur cet article →`,
      kinds: { fond: 'I · Fondements', credo: 'II · Credo', keys: 'III · Sept clés', faq: 'IV · Vie pratique', cat: 'IV · Credo en questions' },
      results: (n, q, where) => `<strong>${n} résultat${frS(n)}</strong> pour « ${q} » ${where}`,
      inAll: 'dans toutes les rubriques',
      inOne: (label) => `dans la rubrique ${label}`,
      more: (n) => `Les ${n} plus pertinents sont affichés — précisez votre recherche pour affiner.`,
      none: (q) => `Aucun résultat pour « ${q} ». Essayez « Trinité », « icône », « confession »…`,
      shown: (n) => `${n} question${frS(n)} affichée${frS(n)}`,
      sections: { fondements: 'I · Les Fondements de la Foi', credo: 'II · Le Symbole de la Foi', cles: 'III · Les Sept Clés de la Vie Spirituelle', questions: 'IV · Questions & Réponses' },
      prev: '← Rubrique précédente', next: 'Rubrique suivante →', restart: 'Revenir au début ↺', sectionNav: 'Navigation entre les rubriques'
    },
    en: {
      qn: 'Q',
      deepen: (n) => `Go deeper: ${n} catechism questions on this article →`,
      kinds: { fond: 'I · Foundations', credo: 'II · Creed', keys: 'III · Seven keys', faq: 'IV · Practical life', cat: 'IV · The Creed in questions' },
      results: (n, q, where) => `<strong>${n} result${n > 1 ? 's' : ''}</strong> for “${q}” ${where}`,
      inAll: 'across all sections',
      inOne: (label) => `in section ${label}`,
      more: (n) => `Showing the ${n} most relevant — refine your search to narrow it down.`,
      none: (q) => `No results for “${q}”. Try “Trinity”, “icon”, “confession”…`,
      shown: (n) => `${n} question${n > 1 ? 's' : ''} shown`,
      sections: { fondements: 'I · Foundations of the Faith', credo: 'II · The Symbol of Faith', cles: 'III · Seven Keys to the Spiritual Life', questions: 'IV · Questions & Answers' },
      prev: '← Previous section', next: 'Next section →', restart: 'Back to the beginning ↺', sectionNav: 'Navigation between sections'
    },
    ru: {
      qn: '№',
      deepen: (n) => `Подробнее: ${n} ${ruPlural(n, 'вопрос', 'вопроса', 'вопросов')} катехизиса об этом члене →`,
      kinds: { fond: 'I · Основы', credo: 'II · Символ веры', keys: 'III · Семь ключей', faq: 'IV · Церковная жизнь', cat: 'IV · Символ веры в вопросах' },
      results: (n, q, where) => `<strong>${n} ${ruPlural(n, 'результат', 'результата', 'результатов')}</strong> по запросу «${q}» ${where}`,
      inAll: 'во всех разделах',
      inOne: (label) => `в разделе ${label}`,
      more: (n) => `Показаны ${n} наиболее подходящих — уточните запрос.`,
      none: (q) => `По запросу «${q}» ничего не найдено. Попробуйте «Троица», «икона», «исповедь»…`,
      shown: (n) => `${ruPlural(n, 'Показан', 'Показано', 'Показано')} ${n} ${ruPlural(n, 'вопрос', 'вопроса', 'вопросов')}`,
      sections: { fondements: 'I · Основы веры', credo: 'II · Символ веры', cles: 'III · Семь ключей духовной жизни', questions: 'IV · Вопросы и ответы' },
      prev: '← Предыдущий раздел', next: 'Следующий раздел →', restart: 'Вернуться к началу ↺', sectionNav: 'Навигация по разделам'
    }
  };
  const T = I18N[LANG] || I18N.fr;

  /** Rendu des questions du catéchisme (rubrique IV) à partir des données (avant l'initialisation des accordéons). */
  (function renderCatechism() {
    const chevron = '<span class="acc-icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6" /></svg></span>';
    let html = '';
    CATECHISM_CHAPTERS.forEach((ch) => {
      html += `<h3 class="cat-group" data-chap="${ch.id}">${ch.short} · ${ch.title}</h3>`;
      CATECHISM.filter((it) => it.c === ch.id).forEach((it) => {
        html += `<div class="acc-item" id="cat-q${it.n}" data-chap="${it.c}" data-search data-kind="cat" data-title="${it.q.replace(/"/g, '&quot;')}">` +
          `<button class="acc-trigger" aria-expanded="false"><span><span class="qn">${T.qn} ${it.n}</span> <span class="acc-title">${it.q}</span></span>${chevron}</button>` +
          `<div class="acc-panel"><div class="acc-inner"><div class="acc-body"><p>${it.a}</p></div></div></div></div>`;
      });
    });
    document.getElementById('cat-list').innerHTML = html;
    document.getElementById('cat-chapters').innerHTML =
      CATECHISM_CHAPTERS.map((ch) => `<button class="filter" type="button" data-qa="cat" data-chap="${ch.id}" aria-pressed="false">${ch.short}<small>${ch.title}</small></button>`).join('');
    // Passerelles depuis chaque article du Credo (rubrique II)
    CATECHISM_CHAPTERS.slice(1).forEach((ch) => {
      const body = document.querySelector(`#credo-${ch.id} .acc-body`);
      if (!body) return;
      const n = CATECHISM.filter((it) => it.c === ch.id).length;
      const p = document.createElement('p');
      p.className = 'see-also';
      p.innerHTML = `<button class="link-btn" data-catchap="${ch.id}">${T.deepen(n)}</button>`;
      body.appendChild(p);
    });
  })();

  /* ---------------------------------------------------------
     1. ONGLETS (navigation sans rechargement, ARIA + clavier)
     --------------------------------------------------------- */
  const tabs = $$('.tab');
  const panels = $$('.panel');

  function activateTab(name, { focus = false, updateHash = true } = {}) {
    const tab = tabs.find((t) => t.dataset.tab === name);
    if (!tab) return;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle('active', p.id === name));
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (updateHash) history.replaceState(null, '', '#' + name);
  }

  /** Fait défiler jusqu’au début d’une rubrique, juste sous la barre d’onglets sticky. */
  function scrollToPanel(id, smooth = true) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const top = panel.getBoundingClientRect().top + window.scrollY - $('.main-nav').offsetHeight;
    if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.tab);
      // Toujours amener le début de la rubrique sous les onglets, même depuis le haut de page :
      // le changement de contenu est ainsi immédiatement visible.
      scrollToPanel(tab.dataset.tab);
    });
    tab.addEventListener('keydown', (e) => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activateTab(tabs[j].dataset.tab, { focus: true }); }
    });
  });

  /* ---------------------------------------------------------
     2. ACCORDÉONS (Credo + FAQ) — animation CSS grid 0fr→1fr
     --------------------------------------------------------- */
  function setAcc(item, open) {
    item.classList.toggle('open', open);
    const trig = $('.acc-trigger', item);
    if (trig) trig.setAttribute('aria-expanded', open);
  }
  $$('.acc-item').forEach((item, idx) => {
    const trig = $('.acc-trigger', item);
    const panel = $('.acc-panel', item);
    const pid = (item.id || 'acc-' + idx) + '-panel';
    panel.id = pid;
    panel.setAttribute('role', 'region');
    trig.setAttribute('aria-controls', pid);
    trig.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      setAcc(item, open);
      if (open && item.id) history.replaceState(null, '', '#' + item.id);
    });
  });
  $$('[data-acc-all]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.dataset.accAll === 'open';
      $$('.acc-item', $(btn.dataset.accTarget)).forEach((it) => setAcc(it, open));
    });
  });

  /* ---------------------------------------------------------
     3. MODALE DE LECTURE (Sept clés) avec navigation préc./suiv.
     --------------------------------------------------------- */
  const reader = $('#reader');
  const keys = $$('.key');
  let currentKey = -1;

  function openKey(index) {
    if (index < 0 || index >= keys.length) return;
    currentKey = index;
    const key = keys[index];
    $('#reader-num').textContent = $('.key-num', key).textContent;
    $('#reader-title').textContent = $('h3', key).textContent;
    $('#reader-body').innerHTML = $('.key-full', key).innerHTML;
    $('#reader-body').scrollTop = 0;
    $('#reader-prev').disabled = index === 0;
    $('#reader-next').disabled = index === keys.length - 1;
    $('#reader-prev').style.visibility = index === 0 ? 'hidden' : 'visible';
    $('#reader-next').style.visibility = index === keys.length - 1 ? 'hidden' : 'visible';
    if (typeof reader.showModal === 'function') {
      if (!reader.open) reader.showModal();
    } else {
      reader.setAttribute('open', '');
    }
    history.replaceState(null, '', '#' + key.id);
  }
  function closeReader() {
    if (reader.open) reader.close ? reader.close() : reader.removeAttribute('open');
  }

  $$('[data-open]').forEach((btn) => btn.addEventListener('click', () => openKey(keys.findIndex((k) => k.id === btn.dataset.open))));
  $('#reader-prev').addEventListener('click', () => openKey(currentKey - 1));
  $('#reader-next').addEventListener('click', () => openKey(currentKey + 1));
  $('[data-close]', reader).addEventListener('click', closeReader);
  // Clic sur le fond (backdrop) = fermeture
  reader.addEventListener('click', (e) => { if (e.target === reader) closeReader(); });
  reader.addEventListener('close', () => {
    const k = keys[currentKey];
    if (k) { history.replaceState(null, '', '#cles'); $('[data-open]', k).focus({ preventScroll: true }); }
  });
  reader.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && !e.target.closest('input')) openKey(currentKey + 1);
    if (e.key === 'ArrowLeft' && !e.target.closest('input')) openKey(currentKey - 1);
  });

  /* ---------------------------------------------------------
     4. NAVIGATION VERS UNE CIBLE (ancre profonde)
        Détermine l'onglet, ouvre l'accordéon / la modale, défile.
     --------------------------------------------------------- */
  function goTo(id, { flash = true } = {}) {
    const el = document.getElementById(id);
    if (!el) return false;
    const panel = el.closest('.panel');
    if (!panel) return false;
    closeReader();
    activateTab(panel.id, { updateHash: false });

    if (el.classList.contains('key')) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => openKey(keys.indexOf(el)), 250);
      return true;
    }
    if (el.classList.contains('acc-item')) {
      // S'assure que la question est visible malgré les filtres FAQ
      if (el.hidden) resetQa();
      setAcc(el, true);
      if (flash) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    }
    history.replaceState(null, '', '#' + id);
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    return true;
  }

  // Liens internes "Pour aller plus loin" et sommaire
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto], [data-jump]');
    if (!g) return;
    e.preventDefault();
    goTo(g.dataset.goto || g.dataset.jump);
  });

  /* ---------------------------------------------------------
     5. RECHERCHE GLOBALE — index construit à partir du DOM
     --------------------------------------------------------- */
  const index = $$('[data-search]').map((el) => {
    // Copie du contenu avec un espace après chaque bloc, pour éviter les mots collés dans les extraits
    const clone = (el.querySelector('.key-full, .acc-body') || el).cloneNode(true);
    clone.querySelectorAll('small, p, li, h3, h4, div, blockquote, cite, b, td, th').forEach((n) => n.append(' '));
    const text = clone.textContent.replace(/\s+/g, ' ').trim();
    const title = el.dataset.title;
    return { id: el.id, kind: el.dataset.kind, title, text, nTitle: norm(title), nText: norm(text) };
  });

  const input = $('#global-search');
  const results = $('#search-results');
  const clearBtn = $('.search-clear');
  let active = -1;

  /** Extrait un passage autour de la première occurrence et surligne les termes. */
  function snippet(item, terms) {
    const pos = terms.map((t) => item.nText.indexOf(t)).filter((p) => p >= 0).sort((a, b) => a - b)[0] ?? 0;
    const start = Math.max(0, pos - 60);
    let s = (start > 0 ? '…' : '') + item.text.slice(start, start + 180) + (start + 180 < item.text.length ? '…' : '');
    return highlight(s, terms);
  }
  /** Surligne les termes (insensible aux accents) dans un texte brut. */
  function highlight(raw, terms) {
    const n = norm(raw);
    const marks = [];
    terms.forEach((t) => { let i = n.indexOf(t); while (t && i >= 0) { marks.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } });
    if (!marks.length) return escapeHtml(raw);
    marks.sort((a, b) => a[0] - b[0]);
    let out = '', last = 0;
    marks.forEach(([a, b]) => { if (a < last) return; out += escapeHtml(raw.slice(last, a)) + '<mark>' + escapeHtml(raw.slice(a, b)) + '</mark>'; last = b; });
    return out + escapeHtml(raw.slice(last));
  }

  function search(q) {
    const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    return index
      .map((it) => {
        let score = 0;
        for (const t of terms) {
          const inTitle = it.nTitle.includes(t);
          const inText = it.nText.includes(t);
          if (!inTitle && !inText) return null; // tous les termes doivent figurer
          score += (inTitle ? 10 : 0) + (inText ? Math.min(it.nText.split(t).length - 1, 6) : 0);
        }
        return { it, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map(({ it }) => ({ ...it, html: snippet(it, terms), titleHtml: highlight(it.title, terms) }));
  }

  /** Rubriques couvertes par la recherche globale (étiquette affichée sur chaque résultat). */
  const KINDS = [
    { kind: 'fond', label: T.kinds.fond },
    { kind: 'credo', label: T.kinds.credo },
    { kind: 'keys', label: T.kinds.keys, gold: true },
    { kind: 'faq', label: T.kinds.faq },
    { kind: 'cat', label: T.kinds.cat, gold: true }
  ];

  function renderResults() {
    const q = input.value.trim();
    clearBtn.classList.toggle('show', q.length > 0);
    if (q.length < 2) { results.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); return; }
    const all = search(q);
    const list = all.slice(0, 30);
    active = -1;
    // Répartition des résultats par rubrique (la recherche couvre toutes les rubriques)
    const perKind = KINDS.map((k) => ({ ...k, n: all.filter((r) => r.kind === k.kind).length })).filter((k) => k.n);
    results.innerHTML = all.length
      ? `<div class="meta">${T.results(all.length, escapeHtml(q), perKind.length > 1 ? T.inAll : T.inOne(perKind[0].label))}` +
          `<span class="meta-kinds">${perKind.map((k) => `<span>${k.label} <b>${k.n}</b></span>`).join('')}</span>` +
          (all.length > list.length ? `<span class="meta-more">${T.more(list.length)}</span>` : '') + `</div>` +
        list.map((r, i) => { const k = KINDS.find((x) => x.kind === r.kind); return `<button type="button" class="result" role="option" id="res-${i}" data-target="${r.id}"><span class="badge ${k.gold ? 'gold' : ''}">${k.label}</span><span class="result-title">${r.titleHtml}</span><span class="result-snippet">${r.html}</span></button>`; }).join('')
      : `<div class="no-result">${T.none(escapeHtml(q))}</div>`;
    results.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
  }

  let debounce;
  input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(renderResults, 90); });
  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) renderResults(); });
  input.addEventListener('keydown', (e) => {
    const items = $$('.result', results);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!items.length) return;
      e.preventDefault();
      active = e.key === 'ArrowDown' ? (active + 1) % items.length : (active - 1 + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle('active', i === active));
      input.setAttribute('aria-activedescendant', items[active].id);
      items[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      const pick = items[active >= 0 ? active : 0];
      if (pick) { e.preventDefault(); choose(pick.dataset.target); }
    } else if (e.key === 'Escape') {
      results.classList.remove('open');
    }
  });
  results.addEventListener('click', (e) => { const r = e.target.closest('.result'); if (r) choose(r.dataset.target); });
  clearBtn.addEventListener('click', () => { input.value = ''; renderResults(); input.focus(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) results.classList.remove('open'); });
  $$('.search-hints [data-q]').forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.q; renderResults(); input.focus(); }));

  /** Ramène à la recherche globale depuis n’importe quelle rubrique. */
  function focusSearch() {
    const top = $('.search').getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    setTimeout(() => { input.focus({ preventScroll: true }); input.select(); if (input.value.trim().length >= 2) renderResults(); }, 350);
  }
  $('.nav-search').addEventListener('click', focusSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, [contenteditable]') || reader.open) return;
    e.preventDefault();
    focusSearch();
  });

  function choose(id) {
    results.classList.remove('open');
    input.blur();
    goTo(id);
  }

  /* ---------------------------------------------------------
     6. QUESTIONS & RÉPONSES — un seul champ et une seule rangée de filtres
        pour les questions pratiques (#faq-list) et le catéchisme (#cat-list).
        État : { scope: 'all' | 'faq' | 'cat', cat (catégorie pratique), chap (chapitre du Credo) }
     --------------------------------------------------------- */
  const faqItems = $$('#faq-list .acc-item');
  const catItems = $$('#cat-list .acc-item');
  const catGroups = $$('#cat-list .cat-group');
  const qaInput = $('#qa-search');
  const qaFilters = $$('[data-qa]');
  const qa = { scope: 'all', cat: 'all', chap: 'all' };

  // Compteurs
  qaFilters.forEach((f) => {
    const c = $('.count', f);
    if (!c) return;
    let n = 0;
    if (f.dataset.qa === 'all') n = faqItems.length + catItems.length;
    else if (f.dataset.qa === 'faq') n = f.dataset.cat === 'all' ? faqItems.length : faqItems.filter((i) => i.dataset.cat === f.dataset.cat).length;
    c.textContent = ' (' + n + ')';
  });

  /** Filtre une liste d’accordéons ; renvoie le nombre d’éléments visibles. */
  function filterItems(items, terms, keep) {
    let shown = 0;
    items.forEach((item) => {
      const ok = keep(item) && terms.every((t) => norm(item.textContent).includes(t));
      item.hidden = !ok;
      if (ok) shown++;
      const title = $('.acc-title', item);
      if (!title.dataset.raw) title.dataset.raw = title.innerHTML;
      title.innerHTML = terms.length ? highlight(title.textContent, terms) : title.dataset.raw;
    });
    return shown;
  }

  function applyQa() {
    const terms = norm(qaInput.value).split(/\s+/).filter(Boolean);
    const showFaq = qa.scope !== 'cat';
    const showCat = qa.scope !== 'faq';
    const nFaq = filterItems(faqItems, terms, (i) => showFaq && (qa.cat === 'all' || i.dataset.cat === qa.cat));
    const nCat = filterItems(catItems, terms, (i) => showCat && (qa.chap === 'all' || i.dataset.chap === qa.chap));
    $('#qa-title-faq').hidden = !nFaq;
    $('#qa-title-cat').hidden = !nCat;
    const perChap = {};
    catItems.forEach((i) => { if (!i.hidden) perChap[i.dataset.chap] = true; });
    catGroups.forEach((g) => { g.hidden = qa.chap !== 'all' || !perChap[g.dataset.chap]; });
    const head = $('#cat-chapter-head');
    if (qa.scope === 'cat' && qa.chap !== 'all' && nCat) {
      const ch = CATECHISM_CHAPTERS[+qa.chap];
      head.innerHTML = `<h3>${ch.short} · ${ch.title}</h3><p>${CREED_LINES[ch.id]}</p>`;
      head.hidden = false;
    } else head.hidden = true;
    const shown = nFaq + nCat;
    $('#qa-empty').style.display = shown ? 'none' : 'block';
    $('#qa-status').textContent = (terms.length || qa.scope !== 'all') ? T.shown(shown) : '';
    qaFilters.forEach((f) => {
      const on = f.dataset.qa === qa.scope &&
        (f.dataset.qa === 'all' || (f.dataset.qa === 'faq' ? f.dataset.cat === qa.cat : f.dataset.chap === qa.chap));
      f.setAttribute('aria-pressed', on);
    });
  }
  function setQa(scope, value) {
    qa.scope = scope;
    qa.cat = scope === 'faq' ? value : 'all';
    qa.chap = scope === 'cat' ? String(value) : 'all';
    applyQa();
  }
  function resetQa() { qaInput.value = ''; setQa('all'); }
  qaFilters.forEach((f) => f.addEventListener('click', () => {
    setQa(f.dataset.qa, f.dataset.qa === 'faq' ? f.dataset.cat : f.dataset.chap);
  }));
  qaInput.addEventListener('input', applyQa);
  applyQa();

  // Lien « Approfondir » depuis un article du Credo → questions du chapitre correspondant
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-catchap]');
    if (!b) return;
    qaInput.value = '';
    setQa('cat', b.dataset.catchap);
    activateTab('questions');
    scrollToPanel('questions');
  });

  /* ---------------------------------------------------------
     7. SOMMAIRE ACTIF (Fondements) via IntersectionObserver
     --------------------------------------------------------- */
  const tocLinks = $$('.toc a');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) tocLinks.forEach((a) => a.classList.toggle('current', a.dataset.jump === en.target.id));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.prose > article').forEach((a) => obs.observe(a));
  }

  /* ---------------------------------------------------------
     7 bis. NAVIGATION ENTRE RUBRIQUES (précédente / suivante)
     --------------------------------------------------------- */
  const SECTION_TITLES = T.sections;
  panels.forEach((panel, i) => {
    const prev = panels[i - 1];
    const next = panels[i + 1] || panels[0];
    const nav = document.createElement('nav');
    nav.className = 'section-nav';
    nav.setAttribute('aria-label', T.sectionNav);
    nav.innerHTML =
      (prev ? `<a class="prev" href="#${prev.id}" data-section="${prev.id}"><span class="dir">${T.prev}</span><span class="ttl">${SECTION_TITLES[prev.id]}</span></a>` : '') +
      `<a class="next" href="#${next.id}" data-section="${next.id}"><span class="dir">${panels[i + 1] ? T.next : T.restart}</span><span class="ttl">${SECTION_TITLES[next.id]}</span></a>`;
    // Dans « Fondements », la dernière section est une grille (sommaire + texte) : on insère dans la colonne de texte.
    const containers = panel.querySelectorAll('.section > .container');
    const last = containers[containers.length - 1];
    (last.querySelector('.prose') || last).appendChild(nav);
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-section]');
    if (!a) return;
    e.preventDefault();
    activateTab(a.dataset.section);
    scrollToPanel(a.dataset.section);
  });

  /* ---------------------------------------------------------
     8. RETOUR EN HAUT + année du pied de page
     --------------------------------------------------------- */
  const toTop = $('.to-top');
  window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
  $$('[data-top]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  $('#year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     9. ROUTAGE INITIAL (#credo, #credo-5, #cle-3, #faq-communion…)
     --------------------------------------------------------- */
  function route() {
    let id = decodeURIComponent(location.hash.slice(1));
    if (id === 'catechisme') id = 'questions'; // ancienne rubrique V, fusionnée dans IV
    if (!id) return;
    if (tabs.some((t) => t.dataset.tab === id)) { activateTab(id, { updateHash: false }); scrollToPanel(id, false); }
    else goTo(id, { flash: true });
  }
  route();
  window.addEventListener('hashchange', route);
  // Les polices web modifient la hauteur de la bannière après le premier rendu :
  // on repositionne une fois la mise en page stabilisée (lien direct vers une rubrique).
  const settle = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (tabs.some((t) => t.dataset.tab === id)) scrollToPanel(id, false);
  };
  window.addEventListener('load', settle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
})();
