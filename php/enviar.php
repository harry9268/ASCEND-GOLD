<?php
/* ==========================================================================
   ASCEND GOLD · php/enviar.php
   Procesa el formulario de contacto (envío por fetch desde formulario.js).
   - Validación en servidor, honeypot y tiempo mínimo de rellenado.
   - Responde en JSON: { ok: bool, message: string }.
   - Hosting: Hostinger (mail() disponible). Para mejor entregabilidad,
     crear el buzón del remitente en hPanel o usar SMTP (ver README).
   ========================================================================== */

declare(strict_types=1);

/* --------------------------------------------------------------------------
   1. CONFIGURACIÓN · [PENDIENTE]
   -------------------------------------------------------------------------- */
const AG_DESTINO   = 'PENDIENTE@ascend-gold.com';   // [PENDIENTE] email que recibe los mensajes
const AG_REMITENTE = 'no-reply@ascend-gold.com';    // [PENDIENTE] buzón del propio dominio (creado en Hostinger)
const AG_ASUNTO    = 'Nuevo contacto web · Ascend Gold';
const AG_MIN_SEG   = 3;                            // segundos mínimos para rellenar el formulario

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* --------------------------------------------------------------------------
   2. Utilidades
   -------------------------------------------------------------------------- */
function responder(bool $ok, string $msg, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}
function campo(string $k, int $max): string {
    $v = isset($_POST[$k]) ? (string) $_POST[$k] : '';
    $v = trim(strip_tags($v));
    $v = preg_replace('/[\r\n]+/', "\n", $v) ?? '';
    return mb_substr($v, 0, $max, 'UTF-8');
}
function linea(string $v): string { // evita inyección de cabeceras
    return trim(str_replace(["\r", "\n", '%0a', '%0d'], ' ', $v));
}

/* --------------------------------------------------------------------------
   3. Mensajes por idioma
   -------------------------------------------------------------------------- */
$lang = (isset($_POST['lang']) && $_POST['lang'] === 'en') ? 'en' : 'es';
$T = [
    'es' => [
        'method'  => 'Método no permitido.',
        'invalid' => 'Revisa los campos obligatorios y vuelve a intentarlo.',
        'privacy' => 'Debes aceptar la política de privacidad.',
        'ok'      => 'Gracias. Hemos recibido tu mensaje y te responderemos en breve.',
        'fail'    => 'No se ha podido enviar el mensaje. Inténtalo más tarde o escríbenos por WhatsApp.',
    ],
    'en' => [
        'method'  => 'Method not allowed.',
        'invalid' => 'Please review the required fields and try again.',
        'privacy' => 'You must accept the privacy policy.',
        'ok'      => 'Thank you. We have received your message and will reply shortly.',
        'fail'    => 'Your message could not be sent. Please try again later or contact us via WhatsApp.',
    ],
][$lang];

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(false, $T['method'], 405);
}

/* --------------------------------------------------------------------------
   4. Antispam: honeypot + tiempo mínimo
   Si es un bot respondemos "ok" para no darle pistas, pero no enviamos nada.
   -------------------------------------------------------------------------- */
if (!empty($_POST['website'])) {
    responder(true, $T['ok']);
}
$t0 = isset($_POST['form_time']) ? (int) ($_POST['form_time'] / 1000) : 0;
if ($t0 > 0 && (time() - $t0) < AG_MIN_SEG) {
    responder(true, $T['ok']);
}

/* --------------------------------------------------------------------------
   5. Validación
   -------------------------------------------------------------------------- */
$nombre   = linea(campo('nombre', 100));
$email    = linea(campo('email', 150));
$telefono = linea(campo('telefono', 20));
$interes  = linea(campo('interes', 40));
$mensaje  = campo('mensaje', 3000);
$privac   = !empty($_POST['privacidad']);

$intereses = ['mindset', 'consultoria', 'negocios-digitales', 'inversiones', 'educacion-financiera', 'otro'];

if (!$privac) {
    responder(false, $T['privacy'], 422);
}
if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($interes, $intereses, true)) {
    responder(false, $T['invalid'], 422);
}
if ($telefono !== '' && !preg_match('/^[+()\d\s.\-]{6,20}$/', $telefono)) {
    responder(false, $T['invalid'], 422);
}

/* --------------------------------------------------------------------------
   6. Envío
   -------------------------------------------------------------------------- */
$cuerpo  = "Nuevo mensaje desde la web de Ascend Gold\n";
$cuerpo .= str_repeat('-', 44) . "\n";
$cuerpo .= "Nombre:    {$nombre}\n";
$cuerpo .= "Email:     {$email}\n";
$cuerpo .= "Teléfono:  " . ($telefono !== '' ? $telefono : '—') . "\n";
$cuerpo .= "Interés:   {$interes}\n";
$cuerpo .= "Idioma:    {$lang}\n";
$cuerpo .= "Privacidad aceptada: sí (" . date('Y-m-d H:i:s') . ")\n";
$cuerpo .= str_repeat('-', 44) . "\n\n";
$cuerpo .= $mensaje . "\n";

$cabeceras = [
    'From: Ascend Gold Web <' . AG_REMITENTE . '>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
];
$asunto = '=?UTF-8?B?' . base64_encode(AG_ASUNTO) . '?=';

$enviado = @mail(AG_DESTINO, $asunto, $cuerpo, implode("\r\n", $cabeceras), '-f' . AG_REMITENTE);

if ($enviado) {
    responder(true, $T['ok']);
}
responder(false, $T['fail'], 500);
