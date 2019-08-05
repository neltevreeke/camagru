<?php

function generateToken($id) {
    // token structure: header.payload.signature
    // Creating token header as a JSON string
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(['user_id' => $id]);

    // Encoding header and payload to base 64 url strings with str replace because
    // there is no built in PHP Base64Url method yet.
    // So we have to replace + with -, / with _ and = with ''.
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    // Creating signature
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'hmTarr3ls', true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    $token = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    return $token;

    // return $token;
}

function decryptToken($token) {
    $tokenExplode = explode('.', $token);
    $signature = hash_hmac('sha256', $tokenExplode[0] . "." . $tokenExplode[1], 'hmTarr3ls', true);
    $signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    $header = base64_decode($tokenExplode[0]);
    $payload = base64_decode($tokenExplode[1]);
    $secret = $tokenExplode[2];

    if ($secret == $signature) {
        return $payload;
    }

    return ;
}

?>