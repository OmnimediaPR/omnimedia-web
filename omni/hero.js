/* Hero slider – autoplay, šipky, klávesy, pauza při hoveru. Scoped na .omni-hero. */
(function () {
  'use strict';
  function init() {
    var hero = document.querySelector('.omni-hero');
    if (!hero) return;
    var slides = [].slice.call(hero.querySelectorAll('.slide'));
    if (!slides.length) return;
    var idx = 0, timer = null, DELAY = 6000;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function play() { stop(); timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    var bn = hero.querySelector('.arrows .next'), bp = hero.querySelector('.arrows .prev');
    if (bn) bn.addEventListener('click', function () { next(); play(); });
    if (bp) bp.addEventListener('click', function () { prev(); play(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); play(); }
      else if (e.key === 'ArrowLeft') { prev(); play(); }
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    // reset do skrytého stavu, vykreslit, a až pak spustit nájezd 1. slidu
    slides.forEach(function (s) { s.classList.remove('active'); });
    void hero.offsetWidth;
    requestAnimationFrame(function () { show(0); play(); });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
