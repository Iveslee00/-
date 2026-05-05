/* =========================================================
   端午活動頁 — Interactions
   - 錨點平滑滾動
   - 滾動跟隨高亮(scrollspy)
   - sticky 導覽列陰影狀態
   - reveal on scroll
   ========================================================= */
(function () {
  'use strict';

  const anchorBar  = document.querySelector('[data-module="anchor"]');
  const anchorPills = document.querySelectorAll('.anchor-pill');
  const sections   = document.querySelectorAll('[data-product-section]');
  const reveals    = document.querySelectorAll('.reveal');

  /* ---------- 錨點點擊 ---------- */
  anchorPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const id = pill.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      const offset = (anchorBar?.offsetHeight || 0) + 12;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Scrollspy (高亮目前區塊) ---------- */
  const setActive = (id) => {
    anchorPills.forEach((p) => {
      const match = p.getAttribute('href') === '#' + id;
      p.classList.toggle('is-active', match);
      // 把 active pill 滾入視野(行動版橫向捲)
      if (match && window.innerWidth < 960) {
        p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      // 取得最靠近視窗中央的區塊
      let best = null;
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (!best || en.intersectionRatio > best.intersectionRatio) best = en;
        }
      });
      if (best) setActive(best.target.id);
    }, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Sticky bar 陰影 ---------- */
  const onScroll = () => {
    if (!anchorBar) return;
    const stuck = window.scrollY > (document.querySelector('.module-kv')?.offsetHeight || 400) - 1;
    anchorBar.classList.toggle('is-stuck', stuck);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const rev = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          rev.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach((el) => rev.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
})();
