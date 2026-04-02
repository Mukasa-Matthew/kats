/**
 * Homepage — inject JASON photos and run secondary slideshows (hero + spotlight).
 * Hero runs at DOM ready; marquee + spotlight defer until #jason-spotlight is near the viewport
 * so the first paint is not competing with dozens of large JPEGs.
 */
(function () {
  var BASE = '/assets/JASON/';

  function injectMarqueeAndSpotlight() {
    if (!window.JASON_MEDIA) return;
    var track = document.getElementById('jason-marquee-track');
    if (track && !track.dataset.jasonReady) {
      track.dataset.jasonReady = '1';
      var picks = JASON_MEDIA.marqueePicks().concat(JASON_MEDIA.marqueePicks());
      picks.forEach(function (name) {
        var wrap = document.createElement('div');
        wrap.className = 'jason-marquee-item';
        var img = document.createElement('img');
        img.src = BASE + name;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        wrap.appendChild(img);
        track.appendChild(wrap);
      });
    }

    var mini = document.getElementById('jason-spotlight-carousel');
    if (mini && !mini.dataset.jasonReady) {
      mini.dataset.jasonReady = '1';
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
          img.decoding = 'async';
          d.appendChild(img);
          mini.appendChild(d);
        });
      startSlideshowLoop('#jason-spotlight-carousel', 4800);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.JASON_MEDIA) return;

    var hero = document.getElementById('hero-slideshow');
    if (hero) {
      var picks = JASON_MEDIA.heroPicks().slice(0, 5);
      picks.forEach(function (name, idx) {
        var d = document.createElement('div');
        d.className = 'slide';
        var img = document.createElement('img');
        img.src = BASE + name;
        img.alt = 'Wings Junior School campus';
        img.className = 'w-full h-full object-cover';
        img.loading = 'lazy';
        img.decoding = 'async';
        d.appendChild(img);
        hero.appendChild(d);
      });
    }

    var spot = document.getElementById('jason-spotlight');
    if (spot) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              obs.disconnect();
              injectMarqueeAndSpotlight();
            });
          },
          { rootMargin: '180px 0px', threshold: 0 }
        );
        io.observe(spot);
      } else {
        injectMarqueeAndSpotlight();
      }
    } else {
      injectMarqueeAndSpotlight();
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
  });
})();
