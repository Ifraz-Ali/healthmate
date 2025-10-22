import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import fileRoutes from "./routes/fileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

/* -------------------------------------------------------------------------- */
/* 🔐 Load environment variables                                              */
/* -------------------------------------------------------------------------- */

// Load .env or .env.local automatically
let envPath;
if (fs.existsSync(".env")) envPath = ".env";
else if (fs.existsSync(".env.local")) envPath = ".env.local";

if (envPath) {
  dotenv.config({ path: envPath });
  console.log(`🔐 Loaded environment from ${envPath}`);
} else {
  dotenv.config();
  console.warn("⚠️ No .env or .env.local found, using process.env directly");
}

console.log(
  "✅ ENV Loaded:",
  process.env.CLOUDINARY_API_KEY ? "Cloudinary Key Found" : "Missing Cloudinary Key"
);

const app = express();

/* -------------------------------------------------------------------------- */
/* 🌐 CORS configuration — safe for Railway + Vercel + local dev              */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  "http://localhost:3000",              // Local dev
  "https://healthmate-two.vercel.app",  // Production frontend
];

// ✅ Universal CORS middleware (handles preflight too)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* -------------------------------------------------------------------------- */
/* 🧩 Validate environment before startup                                     */
/* -------------------------------------------------------------------------- */

const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* 🔗 Connect MongoDB                                                         */
/* -------------------------------------------------------------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* -------------------------------------------------------------------------- */
/* 🚀 API Routes                                                              */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);

// Protected test route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route ✅",
    userId: req.user.id,
  });
});

// Root health check
app.get("/", (req, res) => res.send("✅ HealthMate backend is running!"));

// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Route not found ❌" }));

/* -------------------------------------------------------------------------- */
/* 🏁 Start server                                                            */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
