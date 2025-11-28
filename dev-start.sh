#!/bin/bash
cd /home/runner/workspace
echo "Building frontend..."
npm run build

echo "Copying built files to Laravel..."
cp -r dist/public/* backend-laravel/public/

echo "Starting Laravel server..."
cd backend-laravel
php -S 0.0.0.0:5000 -t public
