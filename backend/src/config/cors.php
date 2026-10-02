<?php
    $allowedOrigins = [
    "http://localhost:5173",              // local dev
    "http://127.0.0.1:5173",             // local dev (alternate host)
    "https://closetandcore.infinityfree.io",  //production
    "http://closetandcore.infinityfree.io"    // production
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
?>