(function () {
  var track = document.getElementById('webzine-track');
  if (!track) return;

  var pages = track.querySelectorAll('.page');
  var indicator = document.getElementById('page-indicator');
  var currentEl = indicator && indicator.querySelector('.page-indicator__current');
  var totalEl = indicator && indicator.querySelector('.page-indicator__total');
  var scrollHint = document.querySelector('.scroll-hint');
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
  }

  track.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateIndicator);
  }, { passive: true });

  document.addEventListener('keydown', function (event) {
    var pageWidth = track.clientWidth;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      track.scrollBy({ left: pageWidth, behavior: 'smooth' });
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      track.scrollBy({ left: -pageWidth, behavior: 'smooth' });
    }
  });

  window.addEventListener('resize', updateIndicator);
  updateIndicator();
})();
