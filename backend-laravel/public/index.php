<?php
// Simple SPA router - serve index.html for all non-static requests
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
