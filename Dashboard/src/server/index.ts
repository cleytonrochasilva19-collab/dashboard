import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DashboardService } from "./dashboard/service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const service = new DashboardService();
const port = Number(process.env.PORT || 8787);
const clientDist = path.resolve(__dirname, "../client");

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, generatedAt: new Date().toISOString() });
});

app.get("/api/snapshot", (_req, res) => {
  res.json(service.getSnapshot());
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendSnapshot = () => {
    res.write(`data: ${JSON.stringify(service.getSnapshot())}\n\n`);
  };

  sendSnapshot();
  service.on("snapshot", sendSnapshot);

  req.on("close", () => {
    service.off("snapshot", sendSnapshot);
    res.end();
  });
});

app.use(express.static(clientDist));

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

void service.start().then(() => {
  app.listen(port, () => {
    console.log(`Dashboard server listening on http://localhost:${port}`);
  });
});
