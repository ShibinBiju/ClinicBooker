<?php
// Determine if this is an API request or a static file request
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requested_file = __DIR__ . $uri;

// Serve actual files (CSS, JS, images, etc.) directly
if (file_exists($requested_file) && is_file($requested_file)) {
    return false; // Let server serve it
}

// Serve directories
if (is_dir($requested_file)) {
    return false;
}

// For API requests, run Laravel with proper bootstrapping
if (strpos($uri, '/api/') === 0 || strpos($uri, '/up') === 0) {
    // Load Composer autoloader
    require __DIR__ . '/../vendor/autoload.php';
    
    // Bootstrap Laravel
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    // Run the application
    exit($app->run());
}

// For all other requests, serve React SPA
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
