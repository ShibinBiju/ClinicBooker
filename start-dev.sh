#!/bin/bash
set -e

echo "🚀 Starting Laravel + React dev environment..."

# Start Laravel using PHP built-in server in background
cd /home/runner/workspace/backend-laravel
php -S 0.0.0.0:8000 -t public > /tmp/laravel.log 2>&1 &
LARAVEL_PID=$!
echo "✓ Laravel started on port 8000 (PID: $LARAVEL_PID)"

# Give Laravel time to start
sleep 4

# Start frontend + proxy server in foreground
cd /home/runner/workspace
echo "✓ Starting frontend on port 5000 with Laravel proxy..."
NODE_ENV=development npx tsx server/index-dev-laravel.ts

# Cleanup on exit
cleanup() {
  echo "🛑 Shutting down services..."
  kill $LARAVEL_PID 2>/dev/null || true
  exit 0
}

trap cleanup EXIT INT TERM
