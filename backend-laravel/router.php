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

// API requests: bootstrap Laravel
if (strpos($uri, '/api/') === 0 || strpos($uri, '/up') === 0) {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    
    // Handle the request through Laravel's HTTP kernel
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = \Illuminate\Http\Request::capture()
    );
    $response->send();
    $kernel->terminate($request, $response);
    exit;
}

// Everything else: serve React SPA
require __DIR__ . '/public/index.php';
