// server.js — LocalLens Backend
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import placesRouter from "./routes/places.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Request logger (dev convenience) ---
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Routes ---
app.use("/api/places", placesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "LocalLens API", timestamp: new Date().toISOString() });
});

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`\n🌿 LocalLens API running at http://localhost:${PORT}`);
  console.log(`   Gemini key: ${process.env.GEMINI_API_KEY ? "✓ configured" : "✗ missing (using mock data)"}\n`);
});
