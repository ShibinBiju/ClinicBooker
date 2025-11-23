import fs from "node:fs";
import { type Server } from "node:http";
import path from "node:path";
import type { Express } from "express";
import express from "express";
import { nanoid } from "nanoid";
import { createServer as createViteServer, createLogger } from "vite";
import viteConfig from "../vite.config";

const app = express();
const viteLogger = createLogger();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple proxy middleware for Laravel API
app.use("/api", async (req, res) => {
  try {
    const laravelUrl = `http://0.0.0.0:8000${req.originalUrl}`;
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body);
    
    const response = await fetch(laravelUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(
          Object.entries(req.headers).filter(
            ([key]) => !["host", "connection", "content-length"].includes(key.toLowerCase())
          )
        ),
      },
      body,
    });

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    const text = await response.text();
    return res.status(response.status).set("Content-Type", contentType || "text/plain").send(text);
  } catch (error) {
    console.error("Laravel proxy error:", error);
    res.status(503).json({ error: "Backend service unavailable. Make sure Laravel is running on port 8000." });
  }
});

// Vite middleware for frontend
async function setupVite(app: Express) {
  const serverOptions = {
    middlewareMode: true,
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

const server = app.listen(5000, "0.0.0.0", async () => {
  console.log("[express] frontend + Laravel proxy on port 5000");
  console.log("[express] proxying API to Laravel on port 8000");
  await setupVite(app);
});
