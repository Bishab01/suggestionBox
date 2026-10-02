<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";
    require_once __DIR__ . "/../config/requireRole.php";

    requireRole(["citizen"]);
    $uid = $_SESSION["uid"];

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $data     = getJsonBody();
    $nid    = (int)($data["nid"] ?? 0);
    $body    = trim($data["commentText"] ?? "");

    if ($body === "") {
        jsonResponse(["success" => false, "message" => "Comment body is required."], 422);
    }

    if (mb_strlen($body) > 2000) {
        jsonResponse(["success" => false, "message" => "Comment must be 2000 characters or fewer."], 422);
    }

    $safe_body = htmlspecialchars($body);

    try {
        // comments are only allowed on news that exists and is published
        $check = $conn->prepare("SELECT nid FROM news WHERE nid = ? AND status = 'published'");
        $check->bind_param("i", $nid);
        $check->execute();
        $news = $check->get_result()->fetch_assoc();
        $check->close();

        if (!$news) {
            jsonResponse(["success" => false, "message" => "News not found."], 404);
        }

        $insert = $conn->prepare(
            "INSERT INTO comments ( nid, uid, body, created_at)
                VALUES (?, ?, ?, NOW())"
        );
        $insert->bind_param("iis", $nid, $uid, $safe_body);
        $insert->execute();
        $insert->close();

        jsonResponse([
            "success" => true,
            "message" => "Comment added successfully.",
        ], 200);
    } catch (mysqli_sql_exception $e) {
        error_log("addComment.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to save comment."], 500);
    }
?>
