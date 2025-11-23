#!/bin/bash
set -e

echo "🚀 Building React frontend..."
cd /home/runner/workspace
npm run build

echo "📦 Deploying frontend to Laravel..."
cp -r dist/public/* backend-laravel/public/

echo "🎯 Starting Laravel on port 5000..."
cd backend-laravel
php -S 0.0.0.0:5000 -t public
