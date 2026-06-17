/* Cookie lišta – dvojjazyčná (CS/EN dle <html lang>).
   ZATÍM NENAPOJENO na žádné měření. Volbu si pamatuje v localStorage a vysílá
   událost `omniConsent` (detail = {necessary,analytics,marketing}). Na novém
   hostingu stačí na tuto událost navěsit GA4 / Consent Mode v2. */
(function () {
  'use strict';
  var KEY = 'omni_consent';
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  var T = EN ? {
    txt: 'This website uses cookies to analyse traffic and improve your experience. By clicking <strong>"Accept all"</strong> you agree to their use.',
    reject: 'Reject', settings: 'Settings', accept: 'Accept all', save: 'Save choice',
    cats: [
      ['necessary', 'Necessary', 'Required for the website to work properly. Cannot be turned off.'],
      ['analytics', 'Analytics', 'Help us understand how the site is used (e.g. Google Analytics).'],
      ['marketing', 'Marketing', 'Used for ad targeting and campaign measurement.']
    ]
  } : {
    txt: 'Tento web používá soubory cookie k analýze návštěvnosti a vylepšení vašeho zážitku. Kliknutím na <strong>„Přijmout vše"</strong> souhlasíte s jejich používáním.',
    reject: 'Odmítnout', settings: 'Nastavení', accept: 'Přijmout vše', save: 'Uložit volbu',
    cats: [
      ['necessary', 'Nezbytné', 'Nutné pro správné fungování webu. Nelze vypnout.'],
      ['analytics', 'Analytické', 'Pomáhají nám pochopit, jak web používáte (např. Google Analytics).'],
      ['marketing', 'Marketingové', 'Slouží k cílení reklamy a měření kampaní.']
    ]
  };

  function saved() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function store(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function emit(c) {
    try { window.dispatchEvent(new CustomEvent('omniConsent', { detail: c })); } catch (e) {}
    // budoucí napojení: zde se na novém hostingu zavolá GA4 / gtag('consent', 'update', …)
  }

  function build() {
    if (document.querySelector('.omni-cc')) return;
    var bar = document.createElement('section');
    bar.className = 'omni-cc';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', EN ? 'Cookie settings' : 'Nastavení cookies');

    var rows = T.cats.map(function (c) {
      var nec = c[0] === 'necessary';
      return '<div class="omni-cc__row">' +
        '<span class="omni-cc__sw"><input type="checkbox" id="cc-' + c[0] + '"' +
        (nec ? ' checked disabled' : '') + '><label for="cc-' + c[0] + '"></label></span>' +
        '<div class="omni-cc__settxt"><h4>' + c[1] + '</h4><p>' + c[2] + '</p></div></div>';
    }).join('');

    bar.innerHTML =
      '<div class="omni-cc__in">' +
        '<p class="omni-cc__txt">' + T.txt + '</p>' +
        '<div class="omni-cc__btns">' +
          '<button class="omni-cc__btn omni-cc__btn--ghost" data-cc="reject">' + T.reject + '</button>' +
          '<button class="omni-cc__btn omni-cc__btn--ghost" data-cc="settings">' + T.settings + '</button>' +
          '<button class="omni-cc__btn omni-cc__btn--solid" data-cc="accept">' + T.accept + '</button>' +
        '</div>' +
        '<div class="omni-cc__set">' + rows +
          '<div class="omni-cc__save"><button class="omni-cc__btn omni-cc__btn--solid" data-cc="save">' + T.save + '</button></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('show'); });

    function close(c) { store(c); emit(c); bar.classList.remove('show'); setTimeout(function () { bar.remove(); }, 450); }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]'); if (!b) return;
      var a = b.getAttribute('data-cc');
      if (a === 'settings') { bar.classList.toggle('open'); return; }
      if (a === 'accept') return close({ necessary: true, analytics: true, marketing: true });
      if (a === 'reject') return close({ necessary: true, analytics: false, marketing: false });
      if (a === 'save') return close({
        necessary: true,
        analytics: !!bar.querySelector('#cc-analytics').checked,
        marketing: !!bar.querySelector('#cc-marketing').checked
      });
    });
  }

  function init() {
    var c = saved();
    if (c) { emit(c); return; } // už rozhodnuto – lištu nezobrazovat, jen předat volbu
    build();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
