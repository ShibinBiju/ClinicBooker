<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requested_file = __DIR__ . '/public' . $uri;

// Serve static files directly
if (file_exists($requested_file) && is_file($requested_file)) {
    return false;
}

// Serve directories
if (is_dir($requested_file)) {
    return false;
}

// For everything else (API + SPA), go through Laravel's public/index.php
// This ensures proper request handling including POST body reading
require __DIR__ . '/public/index.php';
