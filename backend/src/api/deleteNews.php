<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";
    require_once __DIR__ . "/../config/requireRole.php";

    requireRole(["admin"]);

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $data     = getJsonBody();
    $nid = (int)($data["nid"] ?? 0);

    $stmt = $conn->prepare("DELETE FROM news WHERE nid = ?");
    $stmt->bind_param("i", $nid);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            jsonResponse(["success" => true, "message" => "News deleted successfully."], 200);
        } else {
            jsonResponse(["success" => false, "message" => "News not found."], 404);
        }
    } else {
        jsonResponse(["success" => false, "message" => "Failed to delete news item."], 500);
    }

    $stmt->close();
    $conn->close();
?>