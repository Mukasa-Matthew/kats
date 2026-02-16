/**
 * Scroll-reveal — 2025 UX: reveal elements as user scrolls
 * Use class "reveal-on-scroll" on sections or cards; add "revealed" when in viewport.
 */
(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var els = document.querySelectorAll('.reveal-on-scroll');
  if (!els.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
})();

/**
 * Image error handling — hide broken images so layout stays clean
 */
(function () {
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      img.classList.add('img-error');
    }
    img.addEventListener('error', function () {
      this.classList.add('img-error');
    });
  });
})();
