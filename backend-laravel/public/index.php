<?php
// Serve React SPA - handle static files and route all navigation to index.html
$requested_resource = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$public_path = __DIR__;
$file_path = $public_path . $requested_resource;

// If it's a real file (CSS, JS, images, etc.), serve it
if (file_exists($file_path) && is_file($file_path)) {
    return false;
}

// If it's a real directory, serve it
if (is_dir($file_path)) {
    return false;
}

// For everything else, serve index.html (SPA routing)
header('Content-Type: text/html; charset=utf-8');
readfile($public_path . '/index.html');
