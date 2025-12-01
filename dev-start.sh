#!/bin/bash
set -e

echo "📥 Installing frontend dependencies..."
cd /home/runner/workspace/client
npm install

echo "🔨 Building React frontend..."
npm run build

echo "📦 Deploying frontend to Laravel..."
rm -rf ../backend-laravel/public/*
cp -r dist/* ../backend-laravel/public/

echo "🎯 Starting Laravel on port 5000..."
cd ../backend-laravel
php -S 0.0.0.0:5000 -t public
