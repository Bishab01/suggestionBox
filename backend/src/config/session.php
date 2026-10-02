<?php
    $isProduction = !in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);

    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "domain" => "",                              // leave blank — don't set your infinityfreeapp.com domain here
        "secure" => $isProduction,                    // true in prod (HTTPS), false on localhost (HTTP)
        "httponly" => true,
        "samesite" => $isProduction ? "None" : "Lax"  // "None" required for cross-domain (Vercel -> InfinityFree)
    ]);

    session_start();
?>