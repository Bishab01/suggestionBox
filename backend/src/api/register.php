<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $data     = getJsonBody();
    $fname    = trim($data["fname"] ?? "");
    $lname    = trim($data["lname"] ?? "");
    $email    = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($fname === "" || $lname === "" || $email === "" || $password === "") {
        jsonResponse(["success" => false, "message" => "All fields are required."], 422);
    }

    // Same rules as register.jsx, re-checked here because the frontend can be bypassed
    if (!preg_match("/^[a-zA-Z]+$/", $fname)) {
        jsonResponse(["success" => false, "message" => "First name must contain only letters."], 422);
    }
    if (!preg_match("/^[a-zA-Z]+$/", $lname)) {
        jsonResponse(["success" => false, "message" => "Last name must contain only letters."], 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(["success" => false, "message" => "Enter a valid email address."], 422);
    }
    if (strlen($password) < 8) {
        jsonResponse(["success" => false, "message" => "Password must be at least 8 characters."], 422);
    }

    try {
        // checking if email already exists
        $check = $conn->prepare("SELECT uid FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $exists = $check->get_result()->fetch_assoc();
        $check->close();

        if ($exists) {
            jsonResponse(["success" => false, "message" => "This email is already registered."], 409);
        }

        // role is NOT taken from the request: everyone who registers is a citizen.
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insert = $conn->prepare(
            "INSERT INTO users (fname, lname, email, password, role, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'citizen', NOW(), NOW())"
        );
        $insert->bind_param("ssss", $fname, $lname, $email, $hashedPassword);
        $insert->execute();
        $insert->close();

        jsonResponse(["success" => true, "message" => "Registration successful. You can now log in."], 201);
    } catch (mysqli_sql_exception $e) {
        // 1062 = duplicate key (two people registering the same email at once)
        if ($e->getCode() === 1062) {
            jsonResponse(["success" => false, "message" => "This email is already registered."], 409);
        }
        error_log("register.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Registration failed. Please try again."], 500);
    }
?>
