#!/usr/bin/env node
/**
 * Laravel Development Server
 * Builds React frontend and starts Laravel on port 5000
 */

import { execSync } from "child_process";
import * as path from "path";

const workspaceRoot = path.dirname(path.dirname(import.meta.url).replace("file://", ""));

console.log("🚀 Building React frontend...");
try {
  execSync("npx vite build --emptyOutDir", { 
    stdio: "inherit", 
    cwd: workspaceRoot,
    env: { ...process.env, NODE_ENV: "production" }
  });
} catch (error) {
  console.error("❌ Build failed");
  process.exit(1);
}

console.log("\n📦 Deploying frontend to Laravel...");
try {
  const distPath = path.join(workspaceRoot, "dist", "public");
  const laravelPublicPath = path.join(workspaceRoot, "backend-laravel", "public");
  
  execSync(`cp -r ${distPath}/* ${laravelPublicPath}/`, { 
    stdio: "inherit",
    shell: "/bin/bash"
  });
  console.log("✓ Frontend deployed");
} catch (error) {
  console.error("❌ Deployment failed");
  process.exit(1);
}

console.log("\n🎯 Starting Laravel on port 5000...");
console.log("📍 Visit http://localhost:5000\n");

try {
  const laravelPath = path.join(workspaceRoot, "backend-laravel");
  execSync("php -S 0.0.0.0:5000 -t public router.php", { 
    stdio: "inherit", 
    cwd: laravelPath,
    shell: "/bin/bash"
  });
} catch (error) {
  console.error("❌ Laravel server failed");
  process.exit(1);
}
