<?php
// Connects to MySQL using the credentials in backend/.env
// (this file is backend/src/config, so .env is two folders up).
require_once __DIR__ . "/helpers.php";

$env = @parse_ini_file(__DIR__ . "/../../.env");

if ($env === false) {
    jsonResponse(["success" => false, "message" => "Server configuration error: .env file not found."], 500);
}

// Make mysqli throw exceptions so we can catch them and still answer with JSON.
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli(
        $env["DB_HOST"],
        $env["DB_USER"],
        $env["DB_PASSWORD"],
        $env["DB_NAME"],
        (int) $env["DB_PORT"]
    );
    $conn->set_charset("utf8mb4");
    $conn->query("SET time_zone = '+05:45'");
} catch (mysqli_sql_exception $e) {
    error_log("DB connection failed: " . $e->getMessage());
    jsonResponse(["success" => false, "message" => "Could not connect to the database. Please try again later."], 500);
}
?>
