/**
 * 威恳非晶 - 官网脚本
 * 含中英文切换
 */

(function() {
  'use strict';

  // ======== Language Switcher ========
  var LANG_KEY = 'wcan_lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'en';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    // Update toggle button
    var zhBtn = document.querySelector('.lang-zh');
    var enBtn = document.querySelector('.lang-en');
    if (zhBtn && enBtn) {
      zhBtn.classList.toggle('active', lang === 'zh');
      enBtn.classList.toggle('active', lang === 'en');
    }

    // Update all i18n elements
    document.querySelectorAll('[data-i18n-en]').forEach(function(el) {
      var val = el.getAttribute('data-i18n-' + lang);
      if (val !== null) {
        // Elements with children: replace innerHTML so markup is preserved
        if (el.children.length > 0 && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder-en]').forEach(function(el) {
      var val = el.getAttribute('data-i18n-placeholder-' + lang);
      if (val !== null) el.placeholder = val;
    });

    // Update title
    var titleEl = document.querySelector('title[data-i18n-en]');
    if (titleEl) {
      titleEl.textContent = titleEl.getAttribute('data-i18n-' + lang);
    }
  }

  function initI18n() {
    // Add click handlers for lang toggle
    document.querySelector('.lang-zh')?.addEventListener('click', function() { setLang('zh'); });
    document.querySelector('.lang-en')?.addEventListener('click', function() { setLang('en'); });

    setLang(currentLang);
  }

  // ======== DOM Ready ========
  document.addEventListener('DOMContentLoaded', function() {

    initI18n();

    // === Mobile Menu Toggle ===
    var menuToggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function() { nav.classList.toggle('open'); });
    }

    // === Nav Active State ===
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // === Product Tabs ===
    document.querySelectorAll('.product-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.product-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.product-detail').forEach(function(d) { d.classList.remove('active'); });
        this.classList.add('active');
        var target = document.getElementById(this.dataset.target);
        if (target) target.classList.add('active');
      });
    });

    // === Scroll Reveal ===
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card, .stat-box, .product-showcase, .culture-block, .timeline-item')
      .forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
      });

    // === Counter Animation ===
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'));
      if (!target || target <= 0) { el.textContent = target || '0'; return; }
      var duration = 2000, frame = 0, totalFrames = Math.ceil(duration / 16);
      if (el.getAttribute('data-animated') === 'true') return;
      el.setAttribute('data-animated', 'true');
      function tick() {
        frame++;
        var eased = 1 - Math.pow(1 - frame / totalFrames, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (frame < totalFrames) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    }

    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(function(c) { counterObserver.observe(c); });
    setTimeout(function() {
      document.querySelectorAll('.counter').forEach(function(c) {
        if (c.getAttribute('data-animated') !== 'true') animateCounter(c);
      });
    }, 1000);

    // === Banner Carousel ===
    var carousel = document.querySelector('.banner-carousel');
    if (carousel) {
      var track = carousel.querySelector('.carousel-track');
      var slides = carousel.querySelectorAll('.carousel-slide');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      var dotsContainer = carousel.querySelector('.carousel-dots');
      var currentSlide = 0;
      var totalSlides = slides.length;
      var autoplayTimer;

      // Create dots
      for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', (function(idx) { return function() { goToSlide(idx); }; })(i));
        dotsContainer.appendChild(dot);
      }

      function goToSlide(index) {
        currentSlide = index;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        slides.forEach(function(s, i) { s.classList.toggle('active', i === currentSlide); });
        var dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlide); });
      }

      function nextSlide() { goToSlide((currentSlide + 1) % totalSlides); }
      function prevSlide() { goToSlide((currentSlide - 1 + totalSlides) % totalSlides); }

      prevBtn.addEventListener('click', function() { prevSlide(); resetAutoplay(); });
      nextBtn.addEventListener('click', function() { nextSlide(); resetAutoplay(); });

      function startAutoplay() { autoplayTimer = setInterval(nextSlide, 4000); }
      function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
      startAutoplay();

      carousel.addEventListener('mouseenter', function() { clearInterval(autoplayTimer); });
      carousel.addEventListener('mouseleave', startAutoplay);
    }

  });

})();
