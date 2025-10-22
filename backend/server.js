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

// Allow CORS origin to be configured in environment (useful for deployment)
const allowedOrigins = [
  "http://localhost:3000",            // local development
  "https://healthmate-two.vercel.app" // deployed frontend
];

// CORS configuration - MUST be before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight for 10 minutes
};

app.use(cors(corsOptions));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));