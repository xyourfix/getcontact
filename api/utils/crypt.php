<?php
function encrypt($data, $finalKey) {
    $key = hex2bin($finalKey);
    $encrypted = openssl_encrypt($data, 'AES-256-ECB', $key, OPENSSL_RAW_DATA);
    return base64_encode($encrypted);
}

function decrypt($data, $finalKey) {
    $key = hex2bin($finalKey);
    $decrypted = openssl_decrypt(base64_decode($data), 'AES-256-ECB', $key, OPENSSL_RAW_DATA);
    return $decrypted;
}

function createSignature($timestamp, $message, $key) {
    $keyBinary = hex2bin($key);
    $data = $timestamp . '-' . $message;
    $hash = hash_hmac('sha256', $data, $keyBinary, true);
    return base64_encode($hash);
}

function hexToUtf8($hex) {
    return hex2bin($hex);
}
?>