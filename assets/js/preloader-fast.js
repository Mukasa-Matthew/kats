/**
 * Hide full-screen preloader as soon as DOM is ready — not on window "load".
 * Waiting for "load" blocks on every image, fonts, and third-party CSS (feels like "loads forever").
 */
(function () {
  var done = false;
  function hide() {
    if (done) return;
    done = true;
    var el = document.getElementById('page-preloader');
    if (el) el.style.display = 'none';
  }
  function afterDomPaint() {
    requestAnimationFrame(function () {
      requestAnimationFrame(hide);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDomPaint);
  } else {
    afterDomPaint();
  }
  setTimeout(hide, 2400);
})();
