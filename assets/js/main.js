/* ==========================================================================
   ASCEND GOLD · main.js
   Configuración global, header, menú móvil, WhatsApp e inicialización
   de componentes. JavaScript vanilla, sin dependencias.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIGURACIÓN DEL CLIENTE
     Cambia aquí los datos y se aplican en todas las páginas.
     ------------------------------------------------------------------------ */
  var CONFIG = {
    // [PENDIENTE] Número de WhatsApp en formato internacional sin "+" ni espacios. Ej: '34600000000'
    whatsapp: '',
    whatsappMessage: {
      es: 'Hola, me gustaría recibir información sobre Ascend Gold.',
      en: 'Hello, I would like to receive information about Ascend Gold.'
    }
  };
  window.AG_CONFIG = CONFIG;

  var lang = (document.documentElement.lang || 'es').slice(0, 2);

  /* ------------------------------------------------------------------------
     2. HEADER: fondo sólido al hacer scroll
     ------------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. MENÚ MÓVIL accesible (Esc para cerrar, foco devuelto al botón)
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) {
        menu.removeAttribute('inert');
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else {
        menu.setAttribute('inert', '');
      }
    }
    setOpen(false);
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && menu.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     4. WHATSAPP: construye los enlaces desde CONFIG.whatsapp
     Mientras el número esté [PENDIENTE], los enlaces llevan a contacto.
     ------------------------------------------------------------------------ */
  function initWhatsApp() {
    var links = document.querySelectorAll('[data-whatsapp]');
    if (!CONFIG.whatsapp) return; // se mantiene el href de respaldo (contacto.html)
    var text = encodeURIComponent(CONFIG.whatsappMessage[lang] || CONFIG.whatsappMessage.es);
    links.forEach(function (a) {
      a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + text;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ------------------------------------------------------------------------
     5. Año actual en el footer
     ------------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------------
     6. Arranque
     ------------------------------------------------------------------------ */
  function boot() {
    initHeader();
    initMobileMenu();
    initWhatsApp();
    initYear();
    var AG = window.AG || {};
    ['animaciones', 'cookies', 'testimonios', 'formulario'].forEach(function (name) {
      if (AG[name] && typeof AG[name].init === 'function') {
        try { AG[name].init(); } catch (err) { console.error('[Ascend Gold] ' + name, err); }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
