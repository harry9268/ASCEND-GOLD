/* ==========================================================================
   ASCEND GOLD · components/animaciones.js
   Aparición suave al hacer scroll con IntersectionObserver.
   Solo oculta los elementos que están fuera de pantalla al cargar,
   así no hay parpadeo y sin JS todo el contenido es visible.
   ========================================================================== */
(function () {
  'use strict';
  window.AG = window.AG || {};

  window.AG.animaciones = {
    init: function () {
      var items = document.querySelectorAll('[data-reveal]');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!items.length || reduced || !('IntersectionObserver' in window)) return;

      var vh = window.innerHeight;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top > vh * 0.95) {
          el.classList.add('reveal-pending');
          observer.observe(el);
        }
      });
    }
  };
})();
