/* Prière de Jésus — accordéons, sommaire actif, retour en haut (pages FR / RU / EN) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Accordéons (questions fréquentes)
  const setAcc = (item, open) => {
    item.classList.toggle('open', open);
    $('.acc-trigger', item).setAttribute('aria-expanded', open);
  };
  $$('.acc-item').forEach((item, i) => {
    const trig = $('.acc-trigger', item);
    const panel = $('.acc-panel', item);
    panel.id = (item.id || 'acc-' + i) + '-panel';
    panel.setAttribute('role', 'region');
    trig.setAttribute('aria-controls', panel.id);
    trig.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      setAcc(item, open);
      if (open && item.id) history.replaceState(null, '', '#' + item.id);
    });
  });
  // Lien direct vers une question : on l'ouvre
  const openFromHash = () => {
    const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el && el.classList.contains('acc-item')) setAcc(el, true);
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  // Sommaire : met en évidence la partie en cours de lecture
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) tocLinks.forEach((a) => a.classList.toggle('current', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    tocLinks.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) io.observe(t); });
  }

  // Retour en haut + année du pied de page
  const toTop = $('.to-top');
  window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
  $$('[data-top]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  $('#year').textContent = new Date().getFullYear();
})();
