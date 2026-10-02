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

    // Same body as addNews.php plus the nid of the news being edited.
    $data     = getJsonBody();
    $nid      = (int)($data["nid"] ?? 0);
    $title    = trim($data["title"] ?? "");
    $category = trim($data["category"] ?? "");
    $author   = trim($data["author"] ?? "");
    $excerpt  = trim($data["excerpt"] ?? "");
    $content  = trim($data["content"] ?? "");
    $status   = trim($data["status"] ?? "draft");

    if ($nid <= 0) {
        jsonResponse(["success" => false, "message" => "News id is required."], 422);
    }

    if ($title === "" || $content === "") {
        jsonResponse(["success" => false, "message" => "Must provide title and content to publish"], 422);
    }

    if ($category !== "" && !preg_match("/^[a-zA-Z\s]+$/", $category)) {
        jsonResponse(["success" => false, "message" => "Category must contain only letters."], 422);
    }

    if ($author !== "" && !preg_match("/^[a-zA-Z\s\._]+$/", $author)) {
        jsonResponse(["success" => false, "message" => "Author name must contain only letters, spaces, _ or ."], 422);
    }

    if (!in_array($status, ["draft","published"], true)) {
        jsonResponse(["success" => false, "message" => "Invalid status."], 422);
    }

    $safe_excerpt = htmlspecialchars($excerpt);
    $safe_content = htmlspecialchars($content);

    if (mb_strlen($title) > 255 || mb_strlen($category) > 255 || mb_strlen($author) > 255) {
        jsonResponse(["success" => false, "message" => "Title, category and author must be 255 characters or fewer."], 422);
    }
    if (mb_strlen($safe_excerpt) > 500) {
        jsonResponse(["success" => false, "message" => "Excerpt is too long (max 500 characters)."], 422);
    }

    $category = $category === "" ? null : $category;
    $author   = $author === "" ? null : $author;

    try {
        // the news must exist
        $stmt = $conn->prepare("SELECT nid FROM news WHERE nid = ?");
        $stmt->bind_param("i", $nid);
        $stmt->execute();
        $found = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$found) {
            jsonResponse(["success" => false, "message" => "News not found."], 404);
        }

        // title must stay unique, ignoring the news being edited itself
        $stmt = $conn->prepare("SELECT nid FROM news WHERE title = ? AND nid <> ?");
        $stmt->bind_param("si", $title, $nid);
        $stmt->execute();
        $existing = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if ($existing) {
            jsonResponse(["success" => false, "message" => "Another news with the same title already exists."], 422);
        }

        // uid (original author account) and created_at are left untouched.
        // published_at: kept if already published, set now when newly published, cleared for drafts.
        $update = $conn->prepare(
            "UPDATE news
                SET title = ?, category = ?, author = ?, excerpt = ?, content = ?, status = ?,
                    published_at = IF(? = 'published', COALESCE(published_at, NOW()), NULL),
                    updated_at = NOW()
              WHERE nid = ?"
        );
        $update->bind_param("sssssssi", $title, $category, $author, $safe_excerpt, $safe_content, $status, $status, $nid);
        $update->execute();
        $update->close();

        jsonResponse([
            "success" => true,
            "message" => "News/plan updated successfully.",
        ], 200);
    } catch (mysqli_sql_exception $e) {
        error_log("editNews.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to update news/plan."], 500);
    }
?>
