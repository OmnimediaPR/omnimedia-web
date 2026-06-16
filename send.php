<?php
/* Zpracování kontaktního formuláře -> e-mail na info@omnimedia.cz
   Nasazení: PHP hosting (např. Ignum). Lokálně přes python server PHP neběží. */

header('Content-Type: application/json; charset=utf-8');

function out($ok, $error = '') {
  echo json_encode(array('ok' => $ok, 'error' => $error), JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Neplatný požadavek.');

// honeypot – když je vyplněný, tváříme se jako úspěch (bot)
if (!empty($_POST['web'])) out(true);

$jmeno   = trim($_POST['jmeno']   ?? '');
$email   = trim($_POST['email']   ?? '');
$telefon = trim($_POST['telefon'] ?? '');
$zprava  = trim($_POST['zprava']  ?? '');

if ($jmeno === '' || $zprava === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  out(false, 'Vyplňte prosím jméno, platný e-mail a zprávu.');
}
// ochrana proti vkládání hlaviček
foreach (array($jmeno, $email, $telefon) as $v) {
  if (preg_match('/[\r\n]/', $v)) out(false, 'Neplatný vstup.');
}

$prijemce = 'info@omnimedia.cz';
$predmet  = 'Nová zpráva z webu – ' . $jmeno;
$telo  = "Jméno: $jmeno\n";
$telo .= "E-mail: $email\n";
$telo .= "Telefon: " . ($telefon !== '' ? $telefon : '-') . "\n\n";
$telo .= "Zpráva:\n$zprava\n";

$headers  = "From: web@omnimedia.cz\r\n";       // odesílatel z vlastní domény (kvůli SPF/DMARC)
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = @mail($prijemce, '=?UTF-8?B?' . base64_encode($predmet) . '?=', $telo, $headers);

if ($ok) out(true);
out(false, 'Odeslání e-mailu selhalo na straně serveru.');
