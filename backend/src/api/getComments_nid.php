<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";

    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $nid = (int)($_GET["nid"] ?? 0);

    try {
        $stmt = $conn->prepare(
            "SELECT c.cid, c.nid, c.body, c.created_at, u.fname, u.lname
            FROM comments c
            JOIN users u ON u.uid = c.uid
            WHERE c.nid = ?
            ORDER BY c.created_at DESC, c.cid DESC"
        );
        $stmt->bind_param("i", $nid);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        error_log("getComments_nid.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to fetch comments."], 500);
    }

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = [
            "cid" => (int)$row["cid"],
            "nid" => (int)$row["nid"],
            "body" => $row["body"],
            "created_at" => $row["created_at"],
            "user_name" => trim($row["fname"] . " " . $row["lname"])
        ];
    }

    jsonResponse([
        "success" => true,
        "comments" => $comments
    ], 200);

    $conn->close();
?>
