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

    // nStatus is the CURRENT status of the news; this endpoint flips it.
    $data     = getJsonBody();
    $nid = (int)($data["nid"] ?? 0);
    $nStatus = trim($data["nStatus"] ?? "");

    if (!in_array($nStatus, ["draft","published"], true)) {
        jsonResponse(["success" => false, "message" => "Invalid status."], 422);
    }

    $newStatus = $nStatus === "published" ? "draft" : "published";

    try {
        $stmt = $conn->prepare(
            "UPDATE news
                SET status = ?,
                    published_at = IF(? = 'published', COALESCE(published_at, NOW()), NULL),
                    updated_at = NOW()
              WHERE nid = ?"
        );
        $stmt->bind_param("ssi", $newStatus, $newStatus, $nid);
        $stmt->execute();
        $affected = $stmt->affected_rows;
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        error_log("toggleStatus.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to toggle news status."], 500);
    }

    if ($affected === 0) {
        jsonResponse(["success" => false, "message" => "News not found."], 404);
    }

    jsonResponse([
        "success" => true,
        "message" => "News status toggled successfully.",
        "status"  => $newStatus
    ], 200);

    $conn->close();
?>
