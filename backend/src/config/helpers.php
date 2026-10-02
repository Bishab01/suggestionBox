<?php
    // Small helpers shared by every endpoint.
    function jsonResponse($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    // Reads the JSON body that axios sends (php://input).
    function getJsonBody() {
        $body = json_decode(file_get_contents("php://input"), true);
        return is_array($body) ? $body : [];
    }

?>
