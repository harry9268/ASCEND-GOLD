/* ==========================================================================
   ASCEND GOLD · components/formulario.js
   Validación en cliente y envío por fetch a php/enviar.php.
   La validación definitiva se repite en el servidor (enviar.php).
   ========================================================================== */
(function () {
  'use strict';
  window.AG = window.AG || {};

  var MSG = {
    es: {
      required: 'Este campo es obligatorio.',
      email: 'Introduce un email válido.',
      phone: 'Introduce un teléfono válido.',
      privacy: 'Debes aceptar la política de privacidad.',
      sending: 'Enviando…',
      ok: 'Gracias. Hemos recibido tu mensaje y te responderemos en breve.',
      error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.',
      fix: 'Revisa los campos marcados.'
    },
    en: {
      required: 'This field is required.',
      email: 'Please enter a valid email.',
      phone: 'Please enter a valid phone number.',
      privacy: 'You must accept the privacy policy.',
      sending: 'Sending…',
      ok: 'Thank you. We have received your message and will reply shortly.',
      error: 'Your message could not be sent. Please try again or contact us via WhatsApp.',
      fix: 'Please review the highlighted fields.'
    }
  };

  function setError(field, msg) {
    var wrap = field.closest('.field') || field.closest('.checkbox');
    if (!wrap) return;
    var out = wrap.querySelector('.field__error') || (wrap.parentElement && wrap.parentElement.querySelector('[data-error-for="' + field.name + '"]'));
    wrap.classList.toggle('has-error', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (out) out.textContent = msg || '';
  }

  function validate(form, t) {
    var ok = true;
    var first = null;
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      if (f.type === 'hidden' || f.closest('.hp-field')) return;
      var v = (f.type === 'checkbox') ? f.checked : f.value.trim();
      var msg = '';
      if (f.required && !v) msg = f.type === 'checkbox' ? t.privacy : t.required;
      else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = t.email;
      else if (f.type === 'tel' && v && !/^[+()\d\s.-]{6,20}$/.test(v)) msg = t.phone;
      setError(f, msg);
      if (msg) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus();
    return ok;
  }

  window.AG.formulario = {
    init: function () {
      var forms = document.querySelectorAll('form[data-ajax-form]');
      var lang = (document.documentElement.lang || 'es').slice(0, 2);
      var t = MSG[lang] || MSG.es;

      forms.forEach(function (form) {
        var status = form.querySelector('.form__status');
        var btn = form.querySelector('button[type="submit"]');
        var stamp = form.querySelector('input[name="form_time"]');
        if (stamp) stamp.value = String(Date.now()); // antispam: tiempo mínimo de rellenado

        // Preselecciona el interés desde la URL (?interes=consultoria)
        var select = form.querySelector('select[name="interes"]');
        var pre = new URLSearchParams(window.location.search).get('interes');
        if (select && pre && select.querySelector('option[value="' + pre.replace(/[^a-z-]/g, '') + '"]')) {
          select.value = pre;
        }

        form.setAttribute('novalidate', '');
        form.addEventListener('input', function (e) {
          if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
        });

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!validate(form, t)) {
            status.hidden = false;
            status.className = 'form__status form__status--error';
            status.textContent = t.fix;
            return;
          }
          var label = btn.innerHTML;
          btn.disabled = true;
          btn.textContent = t.sending;
          status.hidden = true;

          fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'fetch' }
          })
            .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
            .then(function (res) {
              status.hidden = false;
              if (res && res.ok) {
                status.className = 'form__status form__status--ok';
                status.textContent = res.message || t.ok;
                form.reset();
                if (stamp) stamp.value = String(Date.now());
              } else {
                status.className = 'form__status form__status--error';
                status.textContent = (res && res.message) || t.error;
              }
            })
            .catch(function () {
              status.hidden = false;
              status.className = 'form__status form__status--error';
              status.textContent = t.error;
            })
            .then(function () {
              btn.disabled = false;
              btn.innerHTML = label;
              status.focus();
            });
        });
      });
    }
  };
})();
