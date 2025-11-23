<?php
$requested_file = __DIR__ . '/public' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve real static files (images, css, js)
if (file_exists($requested_file) && is_file($requested_file)) {
    return false; // Let server serve it
}

// For everything else (API + SPA), load Laravel
require __DIR__ . '/public/index.php';
