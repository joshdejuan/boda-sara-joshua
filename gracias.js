/* Cierre de la web después de la boda.
   A partir de content.json → closed.at (por defecto el sábado 21 a las 22:00) la web solo muestra
   un agradecimiento. Los paneles de administración (#admin) y la pantalla en directo (#pantalla…)
   siguen funcionando, para poder descargar las fotos y editar la web. */
(function () {
  'use strict';
  var DEF = {
    at: '2026-11-21T22:00:00+01:00',
    title: '¡Gracias por venir!',
    text: 'Gracias por acompañarnos en un día tan especial en nuestras vidas. Ha sido un regalo compartirlo con vosotros y lo recordaremos siempre.'
  };
  var root = document.documentElement;
  var cfg = DEF, shown = false, timer = null;
  var excluded = function () { return /^#(admin|pantalla)/.test(location.hash) || /[?&]abierta\b/.test(location.search); };
  var isClosed = function () { return !!cfg.at && Date.now() >= Date.parse(cfg.at); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* Mientras se confirma la fecha con content.json, se oculta la página si según la fecha por defecto ya está cerrada */
  if (isClosed() && !excluded()) root.classList.add('sj-closing');
  var st = document.createElement('style');
  st.textContent =
    'html.sj-closing body>*:not(#sj-thanks){visibility:hidden}' +
    'html.sj-closed,html.sj-closed body{overflow:hidden!important}' +
    '#sj-thanks{position:fixed;inset:0;z-index:2147483000;overflow:auto;display:grid;place-items:center;padding:32px 20px;' +
      'background:#F3EEE5 url("/images/paper.jpg") center/cover;color:#3B2210;font-family:"Hanken Grotesk",system-ui,sans-serif;text-align:center}' +
    '#sj-thanks .in{position:relative;max-width:560px;display:flex;flex-direction:column;align-items:center;gap:18px;animation:sjIn 1.2s cubic-bezier(.2,.7,.2,1) both}' +
    '#sj-thanks .br{position:absolute;width:clamp(110px,26vw,150px);top:-64px;right:-8px;opacity:.9;transform:rotate(12deg);pointer-events:none}' +
    '#sj-thanks .wm{width:min(300px,70vw);height:auto}' +
    '#sj-thanks h1{margin:6px 0 0;font:800 clamp(38px,9vw,64px)/1 "Bricolage Grotesque",system-ui,sans-serif;letter-spacing:-.02em;color:#3B2210}' +
    '#sj-thanks p{margin:0;font-size:clamp(17px,4.4vw,20px);line-height:1.55;color:#5a3a22}' +
    '#sj-thanks .heart{color:#ec8f6e;font-size:28px;line-height:1}' +
    '#sj-thanks .sig{font:700 15px/1.4 "Hanken Grotesk",system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#895129}' +
    '#sj-thanks .sig small{display:block;margin-top:6px;letter-spacing:.14em;font-weight:600;color:#ec8f6e}' +
    '@keyframes sjIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){#sj-thanks .in{animation:none}}';
  document.head.appendChild(st);

  function show() {
    if (shown || excluded()) return;
    var mount = function () {
      if (shown) return; shown = true;
      var d = document.createElement('div'); d.id = 'sj-thanks'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', cfg.title || DEF.title);
      d.innerHTML = '<div class="in"><img class="br" src="/images/eucalipto.webp" alt="">' +
        '<img class="wm" src="/images/wordmark.png" alt="Sara + Joshua" width="720" height="379">' +
        '<h1>' + esc(cfg.title || DEF.title) + '</h1>' +
        '<p>' + esc(cfg.text || DEF.text) + '</p>' +
        '<span class="heart" aria-hidden="true">♥</span>' +
        '<p class="sig">Sara &amp; Joshua<small>21 · 11 · 2026</small></p></div>';
      document.body.appendChild(d);
      root.classList.add('sj-closed'); root.classList.remove('sj-closing');
      document.title = '¡Gracias! · Sara & Joshua';
    };
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  }
  function hide() {
    var d = document.getElementById('sj-thanks'); if (d) d.remove();
    shown = false; root.classList.remove('sj-closed', 'sj-closing');
  }
  function apply() {
    clearTimeout(timer);
    if (excluded()) return hide();
    if (isClosed()) return show();
    root.classList.remove('sj-closing');
    var ms = Date.parse(cfg.at) - Date.now();
    if (ms > 0 && ms < 864e5 * 7) timer = setTimeout(apply, ms + 500);   // si alguien tiene la web abierta a las 22:00
  }

  apply();
  window.addEventListener('hashchange', apply);
  try {
    fetch('/content.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && j.closed) cfg = { at: j.closed.at || '', title: j.closed.title || DEF.title, text: j.closed.text || DEF.text };
        if (shown) hide();
        apply();
      })
      .catch(function () { apply(); });
  } catch (e) { apply(); }
})();
