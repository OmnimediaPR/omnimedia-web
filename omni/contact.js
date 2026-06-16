/* Kontaktní formulář do sekce #kontakty — dvojjazyčné (CS/EN) */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var T = EN ? {
    h: 'Write to us', sub: 'Get in touch and we will get back to you as soon as possible.',
    name: 'Name and surname', email: 'E-mail', phone: 'Phone (optional)', msg: 'Message',
    send: 'Send message', sending: 'Sending…',
    invalid: 'Please fill in your name, a valid e-mail and a message.',
    ok: 'Thank you, your message has been sent.',
    err: 'The message could not be sent.',
    fail: 'Sending failed. Please try again, or write to info@omnimedia.cz.'
  } : {
    h: 'Napište nám', sub: 'Ozvěte se nám a my se vám co nejdříve ozveme zpět.',
    name: 'Jméno a příjmení', email: 'E-mail', phone: 'Telefon (nepovinné)', msg: 'Zpráva',
    send: 'Odeslat zprávu', sending: 'Odesílám…',
    invalid: 'Vyplňte prosím jméno, platný e-mail a zprávu.',
    ok: 'Děkujeme, zpráva byla odeslána.',
    err: 'Zprávu se nepodařilo odeslat.',
    fail: 'Odeslání selhalo. Zkuste to prosím znovu, nebo napište na info@omnimedia.cz.'
  };
  var send = (EN ? '../' : '') + 'send.php';

  function init() {
    var sec = document.getElementById('kontakty');
    if (!sec || sec.querySelector('.omni-form-wrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'omni-form-wrap';
    wrap.innerHTML =
      '<h3>' + T.h + '</h3><p class="omni-sub">' + T.sub + '</p>' +
      '<form class="omni-form" novalidate>' +
        '<div><label>' + T.name + '</label><input type="text" name="jmeno" required></div>' +
        '<div><label>' + T.email + '</label><input type="email" name="email" required></div>' +
        '<div class="full"><label>' + T.phone + '</label><input type="text" name="telefon"></div>' +
        '<div class="full"><label>' + T.msg + '</label><textarea name="zprava" required></textarea></div>' +
        '<div class="hp"><label>Web</label><input type="text" name="web" tabindex="-1" autocomplete="off"></div>' +
        '<div class="submit-row"><button type="submit">' + T.send + '</button>' +
        '<span class="omni-msg" role="status"></span></div>' +
      '</form>';
    var map = sec.querySelector('iframe');
    var anchor = map ? (map.closest('.et_pb_row') || map.closest('.et_pb_module') || map) : null;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor);
    else sec.appendChild(wrap);

    var form = wrap.querySelector('form'), msg = wrap.querySelector('.omni-msg'), btn = wrap.querySelector('button');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); msg.textContent = ''; msg.className = 'omni-msg';
      if (!form.jmeno.value.trim() || !form.zprava.value.trim() ||
          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.value)) {
        msg.textContent = T.invalid; msg.className = 'omni-msg err'; return;
      }
      btn.disabled = true; var o = btn.textContent; btn.textContent = T.sending;
      fetch(send, { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.ok) { form.reset(); msg.textContent = T.ok; msg.className = 'omni-msg ok'; }
          else { msg.textContent = (d && d.error) || T.err; msg.className = 'omni-msg err'; }
        })
        .catch(function () { msg.textContent = T.fail; msg.className = 'omni-msg err'; })
        .finally(function () { btn.disabled = false; btn.textContent = o; });
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
