<?php
// Check if this is an API request
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$is_api = strpos($uri, '/api/') === 0 || strpos($uri, '/up') === 0;

// For API requests, bootstrap Laravel
if ($is_api) {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = \Illuminate\Http\Request::capture()
    );
    
    $response->send();
    $kernel->terminate($request, $response);
    exit;
}

// For static files, check if they exist
$requested_file = __DIR__ . $uri;
if (file_exists($requested_file) && is_file($requested_file)) {
    return false;
}

if (is_dir($requested_file)) {
    return false;
}

// For everything else, serve React SPA
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
