/**
 * Wings — professional internal page transitions (no full-screen curtain).
 * Out: brief fade + slight lift on header + main. In: soft fade-up on arrival.
 * Add data-no-transition on any <a> to skip.
 */
(function () {
  var STORAGE = 'wings-pt-out';
  var OUT_MS = 200;
  var ENTER_ANIM_MS = 520;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isInternalNavLink(a) {
    if (!a || a.tagName !== 'A') return false;
    if (a.hasAttribute('data-no-transition')) return false;
    if (a.target === '_blank' || a.download) return false;
    var href = a.getAttribute('href');
    if (!href || href === '#' || /^\s*#/.test(href)) return false;
    if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) return false;
    try {
      var next = new URL(a.href, window.location.href);
      if (next.origin !== window.location.origin) return false;
      var curPath = window.location.pathname + window.location.search;
      var nextPath = next.pathname + next.search;
      if (nextPath === curPath && next.hash) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearLeavingState() {
    document.documentElement.classList.remove('wings-pt-leaving');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var html = document.documentElement;
    var main = document.getElementById('main-content');
    var header = document.getElementById('main-header');

    if (html.classList.contains('wings-pt-pending-enter')) {
      html.classList.remove('wings-pt-pending-enter');
      if (!prefersReducedMotion()) {
        if (main) main.classList.add('wings-pt-enter');
        if (header) header.classList.add('wings-pt-enter');
        setTimeout(function () {
          if (main) main.classList.remove('wings-pt-enter');
          if (header) header.classList.remove('wings-pt-enter');
        }, ENTER_ANIM_MS);
      }
    }

    document.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest('a');
        if (!isInternalNavLink(a)) return;
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        var dest = a.href;
        if (prefersReducedMotion()) {
          try {
            sessionStorage.setItem(STORAGE, '1');
          } catch (err) {}
          window.location.href = dest;
          return;
        }
        html.classList.add('wings-pt-leaving');
        setTimeout(function () {
          try {
            sessionStorage.setItem(STORAGE, '1');
          } catch (err) {}
          window.location.href = dest;
        }, OUT_MS);
      },
      false
    );

    window.addEventListener('pageshow', function (e) {
      clearLeavingState();
      if (e.persisted) {
        if (main) main.classList.remove('wings-pt-enter');
        if (header) header.classList.remove('wings-pt-enter');
      }
    });

    window.addEventListener('load', clearLeavingState);
  });
})();
