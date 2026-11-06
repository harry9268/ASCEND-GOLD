/* ==========================================================================
   ASCEND GOLD · components/cookies.js
   Banner de cookies RGPD: aceptar, rechazar y configurar.
   - El consentimiento se guarda en localStorage ('ag_cookie_consent').
   - Las cookies no necesarias NO se cargan hasta que hay consentimiento.
   - Para añadir analítica/marketing en el futuro, escucha el evento
     'ag:consent' (detail = { analytics: bool, marketing: bool }) y carga
     los scripts solo si la categoría está aceptada.
   ========================================================================== */
(function () {
  'use strict';
  window.AG = window.AG || {};

  var KEY = 'ag_cookie_consent';
  var VERSION = 1; // súbelo si cambian las categorías para volver a pedir consentimiento

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      return c && c.v === VERSION ? c : null;
    } catch (e) { return null; }
  }
  function save(analytics, marketing) {
    var c = { v: VERSION, necessary: true, analytics: !!analytics, marketing: !!marketing, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* modo privado */ }
    apply(c);
    return c;
  }
  function apply(c) {
    window.AG_CONSENT = c;
    document.dispatchEvent(new CustomEvent('ag:consent', { detail: c }));
  }

  window.AG.cookies = {
    init: function () {
      var banner = document.getElementById('cookie-banner');
      var modal = document.getElementById('cookie-modal');
      if (!banner || !modal) return;
      var lastFocus = null;
      var chkA = modal.querySelector('[name="cookies_analytics"]');
      var chkM = modal.querySelector('[name="cookies_marketing"]');

      function hideBanner() { banner.hidden = true; }
      function openModal() {
        var c = read();
        chkA.checked = !!(c && c.analytics);
        chkM.checked = !!(c && c.marketing);
        lastFocus = document.activeElement;
        modal.hidden = false;
        modal.querySelector('h2').focus();
      }
      function closeModal() {
        modal.hidden = true;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }

      var current = read();
      if (current) apply(current); else banner.hidden = false;

      document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-cookies]');
        if (!b) return;
        var action = b.getAttribute('data-cookies');
        if (action === 'accept') { save(true, true); hideBanner(); closeModal(); }
        if (action === 'reject') { save(false, false); hideBanner(); closeModal(); }
        if (action === 'settings') { openModal(); }
        if (action === 'save') { save(chkA.checked, chkM.checked); hideBanner(); closeModal(); }
        if (action === 'close') { closeModal(); }
      });
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
        // Mantiene el foco dentro del panel
        if (e.key === 'Tab' && !modal.hidden) {
          var f = modal.querySelectorAll('button, input, a[href]');
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
  };
})();
