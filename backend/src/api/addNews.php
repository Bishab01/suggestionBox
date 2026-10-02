<?php
    require_once __DIR__ . "/../config/cors.php";
    require_once __DIR__ . "/../config/session.php";
    require_once __DIR__ . "/../config/helpers.php";
    require_once __DIR__ . "/../config/db.php";
    require_once __DIR__ . "/../config/requireRole.php";

    requireRole(["admin"]);
    $uid = $_SESSION["uid"];

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        jsonResponse(["success" => false, "message" => "Method not allowed."], 405);
    }

    $data     = getJsonBody();
    $title    = trim($data["title"] ?? "");
    $category = trim($data["category"] ?? "");
    $author   = trim($data["author"] ?? "");
    $excerpt  = trim($data["excerpt"] ?? "");
    $content  = trim($data["content"] ?? "");
    $status   = trim($data["status"] ?? "draft");

    if ($title === "" || $content === "") {
        jsonResponse(["success" => false, "message" => "Must provide title and content to publish"], 422);
    }

    // category and author are optional in the form; only validate them when filled in
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

    // column sizes in the news table (title/category/author 100, excerpt 500)
    if (mb_strlen($title) > 100 || mb_strlen($category) > 100 || mb_strlen($author) > 100) {
        jsonResponse(["success" => false, "message" => "Title, category and author must be 100 characters or fewer."], 422);
    }
    if (mb_strlen($safe_excerpt) > 500) {
        jsonResponse(["success" => false, "message" => "Excerpt is too long (max 500 characters)."], 422);
    }

    // empty optional fields are stored as NULL (getNews.php then falls back to the defaults)
    $category = $category === "" ? null : $category;
    $author   = $author === "" ? null : $author;

    try {
        $stmt = $conn->prepare("SELECT title FROM news WHERE title = ?");
        $stmt->bind_param("s", $title);
        $stmt->execute();
        $existing = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if ($existing) {
            jsonResponse(["success" => false, "message" => "Another news with the same title already exists."], 422);
        }

        // published_at is only filled for published news
        $insert = $conn->prepare(
            "INSERT INTO news (uid, title, category, author, excerpt, content, status, published_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, IF(? = 'published', NOW(), NULL), NOW(), NOW())"
        );
        $insert->bind_param("isssssss", $uid, $title, $category, $author, $safe_excerpt, $safe_content, $status, $status);
        $insert->execute();
        $insert->close();

        jsonResponse([
            "success" => true,
            "message" => "News/plan saved successfully.",
        ], 200);
    } catch (mysqli_sql_exception $e) {
        error_log("addNews.php: " . $e->getMessage());
        jsonResponse(["success" => false, "message" => "Failed to save news/plan."], 500);
    }
?>
