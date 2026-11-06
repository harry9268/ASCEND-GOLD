/* ==========================================================================
   ASCEND GOLD · components/testimonios.js
   Carga los testimonios desde assets/data/testimonios.json.
   - Si el JSON está vacío ([]) o no hay testimonios del idioma actual,
     la sección permanece oculta (atributo hidden) sin dejar hueco.
   - Si hay testimonios, monta un carrusel accesible.
   Campos: nombre, cargo, texto, foto (opcional), idioma ("es" | "en").
   Un testimonio sin "idioma" se muestra en ambas versiones.
   ========================================================================== */
(function () {
  'use strict';
  window.AG = window.AG || {};

  var ARROW_L = '<svg viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M15 6H1M6 1L1 6l5 5"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1 6h14M10 1l5 5-5 5"/></svg>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text; // textContent: evita inyección de HTML
    return n;
  }

  function build(section, items, lang) {
    var root = section.getAttribute('data-root') || '';
    var labels = lang === 'en'
      ? { prev: 'Previous testimonial', next: 'Next testimonial', go: 'Go to testimonial ', of: ' of ' }
      : { prev: 'Testimonio anterior', next: 'Testimonio siguiente', go: 'Ir al testimonio ', of: ' de ' };

    var mount = section.querySelector('[data-testimonials-mount]');
    var wrap = el('div', 'testimonials');
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-roledescription', 'carousel');
    var viewport = el('div', 'testimonials__viewport');
    var track = el('div', 'testimonials__track');
    track.setAttribute('aria-live', 'polite');

    items.forEach(function (t, i) {
      var slide = el('figure', 'testimonial');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + labels.of + items.length);
      var mark = el('span', 'testimonial__quote-mark', '“');
      mark.setAttribute('aria-hidden', 'true');
      slide.appendChild(mark);
      var quote = el('blockquote', 'testimonial__text');
      quote.appendChild(el('p', '', t.texto));
      slide.appendChild(quote);
      var cap = el('figcaption', 'testimonial__author');
      if (t.foto) {
        var img = el('img', 'testimonial__photo');
        img.src = /^https?:|^\//.test(t.foto) ? t.foto : root + t.foto;
        img.alt = t.nombre;
        img.width = 56; img.height = 56;
        img.loading = 'lazy';
        cap.appendChild(img);
      }
      var who = el('span');
      who.appendChild(el('span', 'testimonial__name', t.nombre));
      if (t.cargo) who.appendChild(el('span', 'testimonial__role', t.cargo));
      cap.appendChild(who);
      slide.appendChild(cap);
      track.appendChild(slide);
    });

    viewport.appendChild(track);
    wrap.appendChild(viewport);
    mount.appendChild(wrap);
    section.hidden = false;

    if (items.length < 2) return; // un solo testimonio: sin controles

    var index = 0;
    var controls = el('div', 'testimonials__controls');
    var prev = el('button', 'testimonials__btn'); prev.type = 'button'; prev.innerHTML = ARROW_L; prev.setAttribute('aria-label', labels.prev);
    var next = el('button', 'testimonials__btn'); next.type = 'button'; next.innerHTML = ARROW_R; next.setAttribute('aria-label', labels.next);
    var dots = el('div', 'testimonials__dots');
    var dotBtns = items.map(function (_, i) {
      var d = el('button', 'testimonials__dot'); d.type = 'button';
      d.setAttribute('aria-label', labels.go + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dots.appendChild(d);
      return d;
    });
    controls.appendChild(prev); controls.appendChild(dots); controls.appendChild(next);
    wrap.appendChild(controls);

    var slides = track.children;
    function go(i) {
      index = (i + items.length) % items.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      dotBtns.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
      Array.prototype.forEach.call(slides, function (s, k) { s.setAttribute('aria-hidden', k === index ? 'false' : 'true'); });
    }
    prev.addEventListener('click', function () { go(index - 1); restart(); });
    next.addEventListener('click', function () { go(index + 1); restart(); });

    // Autoplay suave (se pausa al pasar el ratón / foco y con movimiento reducido)
    var timer = null;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function start() { if (!reduced) timer = setInterval(function () { go(index + 1); }, 7000); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
    wrap.addEventListener('focusin', stop);
    wrap.addEventListener('focusout', start);

    // Gesto táctil
    var x0 = null;
    viewport.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });

    go(0);
    start();
  }

  window.AG.testimonios = {
    init: function () {
      var section = document.querySelector('[data-testimonials]');
      if (!section || !window.fetch) return;
      var lang = (document.documentElement.lang || 'es').slice(0, 2);
      fetch(section.getAttribute('data-src'), { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (data) {
          if (!Array.isArray(data)) return;
          var items = data.filter(function (t) {
            return t && t.nombre && t.texto && (!t.idioma || t.idioma === lang);
          });
          if (items.length) build(section, items, lang);
        })
        .catch(function () { /* sin testimonios: la sección sigue oculta */ });
    }
  };
})();
