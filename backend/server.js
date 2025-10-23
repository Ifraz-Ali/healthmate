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
  dotenv.config();
  console.warn("⚠️ No .env or .env.local file found; relying on process.env");
}

console.log("✅ ENV Loaded:", process.env.CLOUDINARY_API_KEY ? "Cloudinary Key Found" : "Missing Cloudinary Key");

const app = express();

// ============ CRITICAL: CORS MUST BE FIRST ============
// Simple CORS configuration that works
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://healthmate-two.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json());

// Fail fast if required env vars are missing in production/deploy
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ Mongo error", err);
    process.exit(1);
  });

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "HealthMate server running",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);

// Test protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route ✅",
    userId: req.user.id,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});