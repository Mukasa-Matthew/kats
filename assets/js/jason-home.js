/**
 * Homepage — inject JASON photos and run secondary slideshows (hero + spotlight).
 * Requires jason-media.js and elements: #hero-slideshow, #features-slideshow, #jason-marquee-track, #jason-spotlight-carousel
 */
(function () {
  var BASE = 'assets/JASON/';

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.JASON_MEDIA) return;

    var hero = document.getElementById('hero-slideshow');
    if (hero) {
      JASON_MEDIA.heroPicks().forEach(function (name) {
        var d = document.createElement('div');
        d.className = 'slide';
        var img = document.createElement('img');
        img.src = BASE + name;
        img.alt = 'Wings Junior School campus';
        img.className = 'w-full h-full object-cover';
        img.loading = 'lazy';
        d.appendChild(img);
        hero.appendChild(d);
      });
    }

    var feat = document.getElementById('features-slideshow');
    if (feat) {
      JASON_MEDIA.images.filter(function (_, i) {
        return i % 9 === 0;
      }).forEach(function (name) {
        var d = document.createElement('div');
        d.className = 'slide';
        var img = document.createElement('img');
        img.src = BASE + name;
        img.alt = 'Wings Junior School';
        img.className = 'w-full h-full object-cover opacity-20';
        img.loading = 'lazy';
        d.appendChild(img);
        feat.appendChild(d);
      });
    }

    var track = document.getElementById('jason-marquee-track');
    if (track) {
      var picks = JASON_MEDIA.marqueePicks().concat(JASON_MEDIA.marqueePicks());
      picks.forEach(function (name) {
        var wrap = document.createElement('div');
        wrap.className = 'jason-marquee-item';
        var img = document.createElement('img');
        img.src = BASE + name;
        img.alt = '';
        img.loading = 'lazy';
        wrap.appendChild(img);
        track.appendChild(wrap);
      });
    }

    var mini = document.getElementById('jason-spotlight-carousel');
    if (mini) {
      JASON_MEDIA.images
        .filter(function (_, i) {
          return i % 17 === 0;
        })
        .slice(0, 7)
        .forEach(function (name, i) {
          var d = document.createElement('div');
          d.className = 'slide' + (i === 0 ? ' active' : '');
          var img = document.createElement('img');
          img.src = BASE + name;
          img.alt = 'Wings Junior School';
          img.className = 'w-full h-full object-cover';
          img.loading = i === 0 ? 'eager' : 'lazy';
          d.appendChild(img);
          mini.appendChild(d);
        });
    }
  });

  function startSlideshowLoop(containerSelector, intervalMs) {
    var root = document.querySelector(containerSelector);
    if (!root) return;
    var slides = root.querySelectorAll('.slide');
    if (slides.length < 2) return;
    var idx = 0;
    var timer;
    function tick() {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(tick, intervalMs);
    }
    function stop() {
      clearInterval(timer);
    }
    start();
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  window.addEventListener('load', function () {
    startSlideshowLoop('#hero-slideshow', 6200);
    startSlideshowLoop('#jason-spotlight-carousel', 4800);
  });
})();
