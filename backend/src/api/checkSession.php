<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";

    if (!isset($_SESSION["uid"])) {
        jsonResponse(["loggedIn" => false]);
    }

    jsonResponse([
        "loggedIn" => true,
        "user" => [
            "uid"   => $_SESSION["uid"],
            "email" => $_SESSION["email"],
            "role"  => $_SESSION["role"],
        ],
    ]);
?>
