import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import fileRoutes from "./routes/fileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment file robustly: prefer .env, fall back to .env.local
let envPath;
if (fs.existsSync(".env")) envPath = ".env";
else if (fs.existsSync(".env.local")) envPath = ".env.local";

if (envPath) {
  dotenv.config({ path: envPath });
  console.log(`🔐 Loaded environment from ${envPath}`);
} else {
  // still attempt a normal config (no-op if nothing exists)
  dotenv.config();
  console.warn("⚠️ No .env or .env.local file found; relying on process.env");
}

const app = express();

// Allow CORS origin to be configured in environment (useful for deployment)
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Fail fast if required env vars are missing in production/deploy
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  // Exit with non-zero so deployment platforms detect the failure
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ Mongo error", err);
    // Exit so platform sees the crash and you can inspect logs
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);

// test protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route ✅",
    userId: req.user.id,
  });
});

app.get("/", (req, res) => res.send("HealthMate server running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
