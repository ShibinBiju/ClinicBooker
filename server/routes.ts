import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy all /api requests to Laravel backend on port 8000
  app.use("/api", async (req, res) => {
    const url = `http://localhost:8000/api${req.url}`;
    
    try {
      const method = req.method;
      const headers: HeadersInit = {
        ...req.headers,
        "Content-Type": "application/json",
      };
      
      // Remove host header to avoid conflicts
      delete (headers as any)["host"];
      
      let body: any = undefined;
      if (method !== "GET" && method !== "HEAD" && req.body) {
        body = JSON.stringify(req.body);
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (body) {
        fetchOptions.body = body;
      }

      const proxyResponse = await fetch(url, fetchOptions);
      const contentType = proxyResponse.headers.get("content-type");
      const data = await (contentType?.includes("application/json") ? proxyResponse.json() : proxyResponse.text());

      res.status(proxyResponse.status);
      res.setHeader("Content-Type", contentType || "application/json");
      res.send(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(503).json({ error: "Backend service unavailable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
