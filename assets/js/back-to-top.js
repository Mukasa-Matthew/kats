/**
 * Back to top — 2025 UX
 * Shows a button after scrolling; smooth scroll to top on click.
 */
(function () {
  var threshold = 400;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function updateVisibility() {
    if (window.scrollY >= threshold) {
      btn.classList.add('back-to-top-visible');
    } else {
      btn.classList.remove('back-to-top-visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('load', updateVisibility);
  document.body.appendChild(btn);
})();
