(function () {
  var track = document.getElementById('webzine-track');
  if (!track) return;

  var pages = track.querySelectorAll('.page');
  var indicator = document.getElementById('page-indicator');
  var currentEl = indicator && indicator.querySelector('.page-indicator__current');
  var totalEl = indicator && indicator.querySelector('.page-indicator__total');
  var scrollHint = document.querySelector('.scroll-hint');
  var prevBtn = document.getElementById('page-nav-prev');
  var nextBtn = document.getElementById('page-nav-next');
  var total = pages.length;

  if (totalEl) {
    totalEl.textContent = String(total);
  }

  function getCurrentPage() {
    var scrollLeft = track.scrollLeft;
    var pageWidth = track.clientWidth;
    if (!pageWidth) return 0;
    return Math.round(scrollLeft / pageWidth);
  }

  function updateIndicator() {
    var index = getCurrentPage();
    if (currentEl) {
      currentEl.textContent = String(index + 1);
    }
    if (scrollHint && index > 0) {
      scrollHint.classList.add('is-hidden');
    }
    if (prevBtn) {
      prevBtn.disabled = index <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = index >= total - 1;
    }
    pages.forEach(function (page, i) {
      page.classList.toggle('is-active', i === index);
    });
  }

  function goToPage(delta) {
    var pageWidth = track.clientWidth;
    track.scrollBy({ left: pageWidth * delta, behavior: 'smooth' });
  }

  function goToIndex(index) {
    var pageWidth = track.clientWidth;
    track.scrollTo({ left: pageWidth * index, behavior: 'smooth' });
  }

  track.addEventListener('click', function (event) {
    var link = event.target.closest('.page-link[data-goto-page]');
    if (!link) return;
    event.preventDefault();
    goToIndex(parseInt(link.dataset.gotoPage, 10));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToPage(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToPage(1);
    });
  }

  track.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateIndicator);
  }, { passive: true });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      goToPage(1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      goToPage(-1);
    }
  });

  var tocTrigger = document.getElementById('toc-trigger');
  var tocOverlay = document.getElementById('toc-overlay');
  var tocClose = document.getElementById('toc-close');
  var tocGrid = document.getElementById('toc-grid');
  var TOC_CROP_HEIGHT = 960;

  function parsePercent(styleText, prop) {
    if (!styleText) return 0;
    var m = styleText.match(new RegExp(prop + '\\s*:\\s*([\\d.]+)%'));
    return m ? parseFloat(m[1]) : 0;
  }

  function buildToc() {
    if (!tocGrid) return;

    pages.forEach(function (page, i) {
      if (page.classList.contains('page-end')) return;

      var bgEl = page.querySelector('.title-frame__bg') ||
        page.querySelector('.cover-media > img') ||
        page.querySelector('.media-embed > img') ||
        page.querySelector('img.page-main');
      if (!bgEl) return;

      var titleEl = page.querySelector('.page-title');

      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'toc-item';

      var num = document.createElement('span');
      num.className = 'toc-item__num';
      num.textContent = String(i + 1);
      item.appendChild(num);

      var bgImg = document.createElement('img');
      bgImg.className = 'toc-item__bg';
      bgImg.alt = '';
      bgImg.src = bgEl.getAttribute('src');
      item.appendChild(bgImg);

      if (titleEl) {
        var titleImg = document.createElement('img');
        titleImg.className = 'toc-item__title';
        titleImg.alt = '';
        titleImg.src = titleEl.getAttribute('src');

        var styleText = titleEl.getAttribute('style');
        var leftPct = parsePercent(styleText, 'left');
        var widthPct = parsePercent(styleText, 'width');
        var topPct = parsePercent(styleText, 'top');
        titleImg.style.left = leftPct + '%';
        titleImg.style.width = widthPct + '%';

        var setTop = function () {
          var naturalH = bgImg.naturalHeight || 1;
          var pxTop = (topPct / 100) * naturalH;
          titleImg.style.top = (pxTop / TOC_CROP_HEIGHT * 100) + '%';
        };
        if (bgImg.complete && bgImg.naturalHeight) {
          setTop();
        } else {
          bgImg.addEventListener('load', setTop);
        }

        item.appendChild(titleImg);
      }

      item.addEventListener('click', function () {
        goToIndex(i);
        closeToc();
      });

      tocGrid.appendChild(item);
    });
  }

  function openToc() {
    if (tocOverlay) tocOverlay.classList.add('is-open');
  }

  function closeToc() {
    if (tocOverlay) tocOverlay.classList.remove('is-open');
  }

  if (tocTrigger) {
    tocTrigger.addEventListener('click', openToc);
  }

  if (tocClose) {
    tocClose.addEventListener('click', closeToc);
  }

  if (tocOverlay) {
    tocOverlay.addEventListener('click', function (event) {
      if (event.target === tocOverlay) closeToc();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeToc();
  });

  buildToc();

  window.addEventListener('resize', updateIndicator);
  updateIndicator();
})();
