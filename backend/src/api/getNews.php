<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";

    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    // Admins see drafts too (dashboard / edit form); everyone else only sees published news.
    $isAdmin = ($_SESSION["role"] ?? "") === "admin";
    $where   = $isAdmin ? "" : "WHERE n.status = 'published'";

    try {
        $stmt = $conn->prepare(
            "SELECT n.nid, n.title, n.category,
            n.author, n.excerpt, n.content,
            n.status, n.published_at,
            (SELECT COUNT(*) FROM comments c WHERE c.nid = n.nid) AS comments_count
            FROM news n
            $where
            ORDER BY n.created_at DESC"
        );
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        error_log("getNews.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to fetch news."], 500);
    }

    $news = [];
    while ($row = $result->fetch_assoc()) {
        $news[] = [
            "nid" => (int)$row["nid"],
            "title" => $row["title"],
            "category" => $row["category"] ?? "Uncategorized",
            "author" => $row["author"] ?? "Anonymous",
            "excerpt" => $row["excerpt"] ?? "",
            "content" => $row["content"],
            "status" => $row["status"],
            "published_at" => $row["published_at"],
            "comments_count" => (int)$row["comments_count"]
        ];
    }

    jsonResponse([
        "success" => true,
        "news" => $news
    ], 200);

    $conn->close();
?>
