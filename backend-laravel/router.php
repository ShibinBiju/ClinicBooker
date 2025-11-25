<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// For static files, let the server serve them
$requested_file = __DIR__ . '/public' . $uri;
if ($uri !== '/' && file_exists($requested_file) && is_file($requested_file)) {
    return false;
}

// For directories, let PHP serve directory listing (which returns files)
if (is_dir($requested_file) && $uri !== '/') {
    return false;
}

// For API requests, run Laravel
if (strpos($uri, '/api/') === 0 || strpos($uri, '/up') === 0) {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = \Illuminate\Http\Request::capture()
    );
    
    $response->send();
    $kernel->terminate($request, $response);
    exit;
}

// For everything else (SPA routes), serve index.html
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/public/index.html');
