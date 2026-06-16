/* Propojení na vino.omnimedia.cz — dvojjazyčné (CS/EN dle <html lang>) */
(function () {
  'use strict';
  var MICRO = 'https://vino.omnimedia.cz/';
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var T = EN ? {
    menu: 'PR for winemakers',
    eyebrow: 'PR for winemakers',
    h: 'Are you a winery? We have a dedicated programme for you.',
    p: "We'll prepare a <strong>free analysis of your winery's media position</strong> — with no obligation.",
    btn: 'Free analysis &rarr;'
  } : {
    menu: 'PR pro vinaře',
    eyebrow: 'PR pro vinaře',
    h: 'Jste vinařství? Máme pro vás samostatný program.',
    p: 'Připravíme vám <strong>analýzu mediální pozice vašeho vinařství zdarma</strong> — nezávazně.',
    btn: 'Analýza zdarma &rarr;'
  };

  function menu() {
    document.querySelectorAll('#menu-hlavni-menu, #menu-hlavni-menu-1, ul.et-menu, .et_mobile_menu').forEach(function (ul) {
      if (ul.querySelector('.omni-vinari-item')) return;
      var li = document.createElement('li');
      li.className = 'menu-item menu-item-type-custom menu-item-object-custom omni-vinari-item';
      li.innerHTML = '<a href="' + MICRO + '">' + T.menu + '</a>';
      ul.appendChild(li);
    });
  }
  function band() {
    var on = document.getElementById('o-nas');
    if (!on || document.querySelector('.omni-vinari-band')) return;
    var b = document.createElement('section');
    b.className = 'omni-vinari-band';
    b.innerHTML = '<div class="inner"><div class="t"><span class="eyebrow">' + T.eyebrow + '</span>' +
      '<h3>' + T.h + '</h3><p>' + T.p + '</p></div>' +
      '<a class="btn" href="' + MICRO + '">' + T.btn + '</a></div>';
    on.parentNode.insertBefore(b, on.nextSibling);
  }
  function init() { menu(); band(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
