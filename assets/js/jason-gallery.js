/**
 * Builds creative gallery: filmstrip highlights + bento mosaic + filters + lightbox (images with prev/next).
 */
(function () {
  var LEGACY = [
    { src: '../assets/img/team/IMG-20241212-WA0005.jpg', alt: 'Wings Junior School' },
    { src: '../assets/img/team/IMG-20241212-WA0006.jpg', alt: 'Wings Junior School' },
    { src: '../assets/img/team/IMG-20241212-WA0007.jpg', alt: 'Wings Junior School' },
    { src: '../assets/img/team/IMG-20241212-WA0008.jpg', alt: 'Wings Junior School' },
    { src: '../assets/img/team/WhatsApp%20Image%202024-12-12%20at%2015.00.19_4e606234.jpg', alt: 'Wings Junior School' },
    { src: '../assets/IMG-20250827-WA0005.jpg', alt: 'Wings Junior School' },
    { src: '../assets/IMG-20250827-WA0007.jpg', alt: 'Wings Junior School' },
    { src: '../assets/IMG-20250827-WA0011.jpg', alt: 'Wings Junior School' },
    { src: '../assets/IMG-20250827-WA0012.jpg', alt: 'Wings Junior School' },
    { src: '../assets/IMG-20250827-WA0013.jpg', alt: 'Wings Junior School' }
  ];

  function bentoClass(index, isVideo) {
    if (isVideo) return 'gallery-cell--wide';
    if (index === 0) return 'gallery-cell--hero';
    var m = index % 11;
    if (m === 5 || m === 10) return 'gallery-cell--wide';
    if (m === 8) return 'gallery-cell--tall';
    return '';
  }

  function buildFilmstrip(strip, imageItems) {
    if (!strip || !imageItems.length) return;
    var max = Math.min(16, imageItems.length);
    for (var j = 0; j < max; j++) {
      var it = imageItems[j];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-filmstrip-item reveal-on-scroll snap-center shrink-0';
      btn.style.transitionDelay = Math.min(j, 7) * 0.035 + 's';
      btn.setAttribute('data-strip-src', it.src);
      btn.setAttribute('data-strip-alt', it.alt || '');
      btn.setAttribute('aria-label', 'Open preview: ' + (it.alt || 'photo'));
      var img = document.createElement('img');
      img.src = it.src;
      img.alt = '';
      img.loading = j < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      strip.appendChild(btn);
    }
  }

  function buildGrid() {
    var grid = document.getElementById('gallery-grid');
    if (!grid || !window.JASON_MEDIA) return;

    var base = window.JASON_GALLERY_BASE || '../assets/JASON/';
    var items = [];

    LEGACY.forEach(function (x) {
      items.push({ type: 'image', src: x.src, alt: x.alt });
    });
    JASON_MEDIA.images.forEach(function (name) {
      items.push({ type: 'image', src: base + name, alt: 'Wings Junior School — campus moment' });
    });
    JASON_MEDIA.videos.forEach(function (v) {
      items.push({
        type: 'video',
        src: base + v.file,
        poster: base + v.poster,
        alt: v.title
      });
    });

    var imageOnly = items.filter(function (x) {
      return x.type === 'image';
    });
    var strip = document.getElementById('gallery-filmstrip');
    buildFilmstrip(strip, imageOnly);

    grid.innerHTML = '';

    var imageIndex = 0;
    items.forEach(function (item, i) {
      var isVideo = item.type === 'video';
      var idxForBento = isVideo ? i : imageIndex;
      if (!isVideo) imageIndex++;

      var card = document.createElement('div');
      card.className =
        'gallery-card gallery-mosaic-cell reveal-on-scroll cursor-pointer ' + bentoClass(idxForBento, isVideo);
      card.style.transitionDelay = Math.min(i % 10, 9) * 0.035 + 's';
      card.setAttribute('data-category', isVideo ? 'video' : 'image');

      var aspect = document.createElement('div');
      aspect.className = 'gallery-card-media relative';

      if (item.type === 'image') {
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = item.src;
        img.alt = item.alt;
        img.addEventListener('error', function () {
          this.classList.add('img-error');
        });
        aspect.appendChild(img);
        card.setAttribute('data-lightbox', '');
      } else {
        var poster = document.createElement('img');
        poster.loading = 'lazy';
        poster.decoding = 'async';
        poster.src = item.poster;
        poster.alt = item.alt;
        poster.addEventListener('error', function () {
          this.classList.add('img-error');
        });
        var play = document.createElement('div');
        play.className = 'gallery-video-play';
        play.setAttribute('aria-hidden', 'true');
        play.innerHTML = '<i class="fas fa-play"></i>';
        aspect.appendChild(poster);
        aspect.appendChild(play);
        card.setAttribute('data-lightbox-video', item.src);
        card.setAttribute('data-video-title', item.alt);
      }

      var overlay = document.createElement('div');
      overlay.className = 'gallery-card-overlay';
      var inner = document.createElement('div');
      inner.className = 'gallery-card-overlay-inner';
      inner.innerHTML =
        '<span class="gallery-card-cta"><i class="fas fa-' +
        (isVideo ? 'play' : 'expand') +
        '"></i> ' +
        (isVideo ? 'Play' : 'Open') +
        '</span>';
      overlay.appendChild(inner);
      aspect.appendChild(overlay);

      card.appendChild(aspect);
      grid.appendChild(card);
    });
  }

  function wireFilters() {
    var host = document.getElementById('gallery-filters');
    if (!host) return;
    host.addEventListener('click', function (e) {
      var pill = e.target.closest('[data-filter]');
      if (!pill) return;
      var f = pill.getAttribute('data-filter');
      host.querySelectorAll('[data-filter]').forEach(function (p) {
        p.classList.toggle('gallery-filter-pill--active', p === pill);
      });
      document.querySelectorAll('.gallery-mosaic-cell').forEach(function (cell) {
        var cat = cell.getAttribute('data-category');
        var show = f === 'all' || cat === f;
        cell.classList.toggle('gallery-cell--hidden', !show);
      });
    });
  }

  function wireFilmstripOpen() {
    var strip = document.getElementById('gallery-filmstrip');
    if (!strip) return;
    strip.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery-filmstrip-item');
      if (!btn) return;
      var src = btn.getAttribute('data-strip-src');
      var alt = btn.getAttribute('data-strip-alt') || '';
      if (src) {
        window.dispatchEvent(
          new CustomEvent('gallery-open-lightbox', { detail: { src: src, alt: alt, type: 'image' } })
        );
      }
    });
  }

  function wireLightbox() {
    var lightbox = document.getElementById('gallery-lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxVideo = document.getElementById('lightbox-video');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var captionEl = document.getElementById('lightbox-caption');
    var counterEl = document.getElementById('lightbox-counter');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.addEventListener('load', function () {
      this.classList.remove('img-error');
    });

    var imageList = [];
    var currentImageIndex = 0;
    var mode = 'image';

    function refreshImageList() {
      imageList = [];
      document.querySelectorAll('.gallery-mosaic-cell[data-lightbox]').forEach(function (cell) {
        if (cell.classList.contains('gallery-cell--hidden')) return;
        var im = cell.querySelector('.gallery-card-media img');
        if (im && im.src) imageList.push({ src: im.src, alt: im.alt || '' });
      });
    }

    function updateNavVisibility() {
      var show = mode === 'image' && imageList.length > 1;
      if (lightboxPrev) {
        lightboxPrev.classList.toggle('hidden', !show);
        lightboxPrev.disabled = !show;
      }
      if (lightboxNext) {
        lightboxNext.classList.toggle('hidden', !show);
        lightboxNext.disabled = !show;
      }
      if (counterEl) {
        counterEl.classList.toggle('hidden', mode !== 'image' || imageList.length < 2);
        if (mode === 'image' && imageList.length)
          counterEl.textContent = currentImageIndex + 1 + ' / ' + imageList.length;
      }
    }

    function showImageAt(index) {
      if (!imageList.length) return;
      currentImageIndex = (index + imageList.length) % imageList.length;
      var cur = imageList[currentImageIndex];
      lightboxImg.classList.remove('hidden', 'img-error');
      lightboxImg.src = cur.src;
      lightboxImg.alt = cur.alt || '';
      if (captionEl) {
        captionEl.textContent = cur.alt || '';
        captionEl.classList.toggle('hidden', !cur.alt);
      }
      updateNavVisibility();
    }

    function showImage(src, alt) {
      mode = 'image';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.classList.add('hidden');
      }
      lightboxImg.classList.remove('hidden', 'img-error');
      refreshImageList();
      currentImageIndex = 0;
      for (var i = 0; i < imageList.length; i++) {
        if (imageList[i].src === src) {
          currentImageIndex = i;
          break;
        }
      }
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      if (captionEl) {
        captionEl.textContent = alt || '';
        captionEl.classList.toggle('hidden', !alt);
      }
      updateNavVisibility();
    }

    function showVideo(src, title) {
      mode = 'video';
      lightboxImg.removeAttribute('src');
      lightboxImg.classList.add('hidden');
      if (lightboxVideo) {
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.setAttribute('src', src);
        lightboxVideo.setAttribute('playsinline', '');
        lightboxVideo.setAttribute('controls', '');
        lightboxVideo.setAttribute('preload', 'metadata');
        lightboxVideo.play().catch(function () {});
      }
      if (captionEl) {
        captionEl.textContent = title || 'Video';
        captionEl.classList.remove('hidden');
      }
      updateNavVisibility();
    }

    function openLightbox() {
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex', 'gallery-lightbox--open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        lightboxVideo.classList.add('hidden');
      }
      lightboxImg.removeAttribute('src');
      lightboxImg.classList.remove('hidden', 'img-error');
      lightbox.classList.remove('flex', 'gallery-lightbox--open');
      lightbox.classList.add('hidden');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    window.addEventListener('gallery-open-lightbox', function (ev) {
      var d = ev.detail;
      if (!d || d.type !== 'image') return;
      showImage(d.src, d.alt || '');
      openLightbox();
    });

    var gridHost = document.getElementById('gallery-grid');
    if (gridHost) {
      gridHost.addEventListener('click', function (e) {
        var card = e.target.closest('.gallery-mosaic-cell');
        if (!card || card.classList.contains('gallery-cell--hidden')) return;
        var v = card.getAttribute('data-lightbox-video');
        if (v) {
          showVideo(v, card.getAttribute('data-video-title') || '');
          openLightbox();
          return;
        }
        if (!card.hasAttribute('data-lightbox')) return;
        var img = card.querySelector('.gallery-card-media img');
        if (!img || !img.src) return;
        showImage(img.src, img.alt);
        openLightbox();
      });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('[data-lightbox-dismiss]')) closeLightbox();
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showImageAt(currentImageIndex - 1);
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showImageAt(currentImageIndex + 1);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (mode === 'image' && imageList.length > 1) {
        if (e.key === 'ArrowLeft') showImageAt(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImageAt(currentImageIndex + 1);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildGrid();
    wireFilters();
    wireFilmstripOpen();
    wireLightbox();
  });
})();
