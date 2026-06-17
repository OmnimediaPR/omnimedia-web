/* Omnimedia doplňky — dvojjazyčné (CS/EN dle <html lang>)
   - vlastní overlay menu (Divi hamburger v kopii nefunguje + odkazy rozbité mirrorem)
   - blok "Jste vinařství?" + propojení na vino.omnimedia.cz */
(function () {
  'use strict';
  var MICRO = 'https://vino.omnimedia.cz/';
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var T = EN ? {
    vinari: 'PR for winemakers', close: 'Close',
    nav: [['#omni-uvod', 'Home'], ['#nase-sluzby', 'Our services'], ['#o-nas', 'About us'],
          ['#reference', 'References'], ['#nas-tym', 'Our team'], ['#kontakty', 'Contacts']],
    bandEy: 'PR for winemakers', bandH: 'Are you a winery? We have a dedicated programme for you.',
    bandP: "We'll prepare a <strong>free analysis of your winery's media position</strong> — with no obligation.",
    bandBtn: 'Free analysis &rarr;'
  } : {
    vinari: 'PR pro vinaře', close: 'Zavřít',
    nav: [['#omni-uvod', 'Úvod'], ['#nase-sluzby', 'Naše služby'], ['#o-nas', 'O nás'],
          ['#reference', 'Reference'], ['#nas-tym', 'Náš tým'], ['#kontakty', 'Kontakty']],
    bandEy: 'PR pro vinaře', bandH: 'Jste vinařství? Máme pro vás samostatný program.',
    bandP: 'Připravíme vám <strong>analýzu mediální pozice vašeho vinařství zdarma</strong> — nezávazně.',
    bandBtn: 'Analýza zdarma &rarr;'
  };

  function customMenu() {
    if (document.querySelector('.omni-nav')) return;
    var header = document.querySelector('.et_pb_section--with-menu')
              || document.querySelector('.et_pb_section_0_tb_header')
              || document.querySelector('header.et-l--header');
    var ov = document.createElement('nav');
    ov.className = 'omni-nav';
    var html = '<div class="inner">';
    T.nav.forEach(function (l) { html += '<a href="' + l[0] + '">' + l[1] + '</a>'; });
    html += '<a class="hl" href="' + MICRO + '">' + T.vinari + '</a></div>';
    ov.innerHTML = html;
    document.body.appendChild(ov);

    var isOpen = false;
    function place() { ov.style.top = (header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 80) + 'px'; }
    function open() { place(); ov.classList.add('open'); isOpen = true; }
    function close() { ov.classList.remove('open'); isOpen = false; }
    function toggle() { isOpen ? close() : open(); }

    ov.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (isOpen) place(); });
    // klik mimo lištu ji zavře (spínač má stopPropagation, takže se sám nezavře)
    document.addEventListener('click', function (e) { if (isOpen && !ov.contains(e.target)) close(); });

    // spínače: Divi hamburger + textový modul "MENU"
    var trig = [];
    document.querySelectorAll('.mobile_menu_bar, .et_mobile_nav_menu, .mobile_nav').forEach(function (e) { trig.push(e); });
    document.querySelectorAll('.et_pb_text_inner').forEach(function (e) {
      if ((e.textContent || '').trim().toUpperCase() === 'MENU') trig.push(e);
    });
    trig.forEach(function (e) {
      e.style.cursor = 'pointer';
      e.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); toggle(); });
    });
  }

  function band() {
    var on = document.getElementById('o-nas');
    if (!on || document.querySelector('.omni-vinari-band')) return;
    var b = document.createElement('section');
    b.className = 'omni-vinari-band';
    b.innerHTML = '<div class="inner"><div class="t"><span class="eyebrow">' + T.bandEy + '</span>' +
      '<h3>' + T.bandH + '</h3><p>' + T.bandP + '</p></div>' +
      '<a class="btn" href="' + MICRO + '">' + T.bandBtn + '</a></div>';
    on.parentNode.insertBefore(b, on.nextSibling);
  }

  function init() { customMenu(); band(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
