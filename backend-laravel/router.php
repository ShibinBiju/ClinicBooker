<?php
// Router for PHP built-in development server
$requested_file = __DIR__ . '/public' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve real files and directories directly
if (file_exists($requested_file)) {
    if (is_file($requested_file)) {
        return false; // Let the server serve the file
    }
}

// For everything else, load index.php (React SPA)
require __DIR__ . '/public/index.php';
