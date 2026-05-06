/* =========================================================
   端午活動頁 — Interactions
   ========================================================= */
(() => {
  // 1) Sticky shadow toggle
  const anchor = document.querySelector('.module-anchor');
  if (anchor){
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    anchor.parentNode.insertBefore(sentinel, anchor);
    new IntersectionObserver(([e]) => {
      anchor.classList.toggle('is-stuck', !e.isIntersecting);
    }, { rootMargin: '0px 0px 0px 0px', threshold: 0 }).observe(sentinel);
  }

  // 2) Anchor pills smooth scroll + offset for sticky bar
  const pills = document.querySelectorAll('.anchor-pill');
  pills.forEach(p => {
    p.addEventListener('click', (ev) => {
      const id = p.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      const stickyH = anchor && getComputedStyle(anchor).position === 'sticky'
        ? anchor.getBoundingClientRect().height : 0;
      const y = target.getBoundingClientRect().top + window.pageYOffset - stickyH - 12;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // 3) Scrollspy — highlight active pill
  const sections = [...document.querySelectorAll('[data-product-section]')];
  const map = new Map(sections.map(s => [s.id, document.querySelector(`.anchor-pill[href="#${s.id}"]`)]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      const pill = map.get(en.target.id);
      if (!pill) return;
      if (en.isIntersecting){
        pills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        // mobile auto-scroll active pill into view
        if (window.matchMedia('(max-width: 768px)').matches){
          pill.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
        }
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  // 4) Reveal on scroll
  const revealItems = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add('is-in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObs.observe(el));
})();
