(function () {
  'use strict';
  var root = document.documentElement;
  var WA_NUMBER = '972527993383';

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  var fab = document.querySelector('.fab-whatsapp');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (fab) fab.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
    });
  }

  // Highlight current section in nav
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('ul a[href^="#"]')) : [];
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) sectionObserver.observe(s);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Contact form -> WhatsApp
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var checks = [
      { el: form.elements.name, ok: function (v) { return v.trim().length > 1; } },
      { el: form.elements.phone, ok: function (v) { return /^[0-9+\-\s]{9,15}$/.test(v.trim()); } },
      { el: form.elements.consent, ok: function () { return form.elements.consent.checked; } }
    ];
    function validate(field) {
      var valid = field.ok(field.el.value);
      var err = document.getElementById(field.el.id + '-error');
      field.el.setAttribute('aria-invalid', String(!valid));
      if (valid) field.el.removeAttribute('aria-describedby'); else field.el.setAttribute('aria-describedby', err.id);
      err.hidden = valid;
      return valid;
    }
    checks.forEach(function (f) {
      f.el.addEventListener(f.el.type === 'checkbox' ? 'change' : 'blur', function () {
        if (f.el.hasAttribute('aria-invalid')) validate(f);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      checks.forEach(function (f) { if (!validate(f) && !firstInvalid) firstInvalid = f.el; });
      if (firstInvalid) {
        status.textContent = 'יש להשלים את השדות המסומנים.';
        firstInvalid.focus();
        return;
      }
      var lines = [
        'שלום אסתר, פנייה מהאתר:',
        'שם: ' + form.elements.name.value.trim(),
        'טלפון: ' + form.elements.phone.value.trim()
      ];
      var msg = form.elements.message.value.trim();
      if (msg) lines.push('הודעה: ' + msg);
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      status.textContent = 'נפתח חלון וואטסאפ עם ההודעה – נותר רק ללחוץ "שליחה".';
    });
  }

  // Accessibility widget
  var a11yToggle = document.querySelector('.a11y-toggle');
  var panel = document.getElementById('a11y-panel');
  var state;
  try { state = JSON.parse(localStorage.getItem('a11y') || '{}'); } catch (e) { state = {}; }

  function apply() {
    root.classList.remove('a11y-scale-1', 'a11y-scale-2');
    if (state.scale) root.classList.add('a11y-scale-' + state.scale);
    ['contrast', 'links', 'readable', 'still'].forEach(function (k) { root.classList.toggle('a11y-' + k, !!state[k]); });
    panel.querySelectorAll('[data-a11y]').forEach(function (b) {
      var k = b.getAttribute('data-a11y');
      if (k === 'scale') b.setAttribute('aria-pressed', String(String(state.scale || 0) === b.getAttribute('data-value')));
      else if (k !== 'reset') b.setAttribute('aria-pressed', String(!!state[k]));
    });
    try { localStorage.setItem('a11y', JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  function setPanel(open) {
    a11yToggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) panel.querySelector('button').focus();
  }
  a11yToggle.addEventListener('click', function () { setPanel(panel.hidden); });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a11y]');
    if (!b) return;
    var k = b.getAttribute('data-a11y');
    if (k === 'reset') state = {};
    else if (k === 'scale') state.scale = Number(b.getAttribute('data-value'));
    else state[k] = !state[k];
    apply();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setPanel(false); a11yToggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !e.target.closest('#a11y')) setPanel(false);
  });
  apply();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
