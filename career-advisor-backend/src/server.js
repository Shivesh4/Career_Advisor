
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import appRoutes from "./routes/applications.js";
import jobRoutes from "./routes/jobs.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Universal CORS-safe proxy route ---
app.get("/api/proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !url.startsWith("https")) {
      return res.status(400).json({ error: "Invalid or missing URL" });
    }

    console.log("Proxying request to:", url);
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      return res.json(json);
    } else {
      const text = await response.text();
      return res.type("text/plain").send(text);
    }
  } catch (err) {
    console.error("Proxy fetch failed:", err.message);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
});

// Health check
app.get("/", (_req, res) => res.json({ ok: true, service: "Career Advisor API" }));
app.get("/api/ping", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Static uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", appRoutes);
app.use("/api/jobs", jobRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found", path: req.originalUrl }));

// Server bootstrap (don’t bind a port during tests)
const port = process.env.PORT || 5000;
let server;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

// Graceful shutdown (optional)
process.on?.("SIGTERM", () => server?.close?.());
process.on?.("SIGINT", () => server?.close?.());

export { app, server };
export default app;
