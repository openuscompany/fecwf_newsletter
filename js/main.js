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

  window.addEventListener('resize', updateIndicator);
  updateIndicator();
})();
