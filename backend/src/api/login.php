<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $data     = getJsonBody();
    $email    = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($email === "" || $password === "") {
        jsonResponse(["success" => false, "message" => "All fields are required."], 422);
    }

    try {
        $stmt = $conn->prepare("SELECT uid, fname, lname, email, role, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        error_log("login.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Something went wrong. Please try again."], 500);
    }

    // Same message for "no such user" and "wrong password" so emails can't be probed.
    if (!$user || !password_verify($password, $user["password"])) {
        jsonResponse(["success" => false, "message" => "Invalid email or password."], 401);
    }

    session_regenerate_id(true);   // prevents session fixation

    $_SESSION["uid"]   = (int) $user["uid"];
    $_SESSION["role"]  = $user["role"];
    $_SESSION["email"] = $user["email"];

    jsonResponse([
        "success" => true,
        "message" => "Login successful.",
        "user" => [
            "uid"   => (int) $user["uid"],
            "email" => $user["email"],
            "role"  => $user["role"],
        ],
    ], 200);
?>
