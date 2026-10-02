<?php
    // Blocks the request unless the logged-in user's role is one of $allowedRoles.
    // Include this AFTER config/session.php (needs $_SESSION started).
    // Usage: requireRole(["retailer"]);

    function requireRole(array $allowedRoles) {
        if (!isset($_SESSION["uid"]) || !isset($_SESSION["role"])) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "You must be logged in to access this resource."
            ]);
            exit;
        }

        if (!in_array($_SESSION["role"], $allowedRoles, true)) {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "message" => "You do not have permission to access this resource."
            ]);
            exit;
        }
    }
?>
