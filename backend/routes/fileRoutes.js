import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import File from "../models/File.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧰 Multer memory storage setup                                             */
/* -------------------------------------------------------------------------- */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* -------------------------------------------------------------------------- */
/* ☁️ Helper: Upload file buffer to Cloudinary safely                         */
/* -------------------------------------------------------------------------- */
function uploadToCloudinary(fileBuffer, mimetype, originalname) {
  return new Promise((resolve, reject) => {
    const isPdf = mimetype === "application/pdf";

    const options = {
      resource_type: isPdf ? "raw" : "auto",
      folder: "healthmate_uploads",
      public_id: originalname ? originalname.split(".")[0] : undefined,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(fileBuffer);
  });
}

/* -------------------------------------------------------------------------- */
/* 📤 Upload endpoint (Protected)                                             */
/* -------------------------------------------------------------------------- */
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("⚠️ No file received in request.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log(`📁 Uploading file: ${req.file.originalname}`);

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    const newFile = new File({
      user: req.user.id,
      filename: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileType: req.file.mimetype,
    });

    await newFile.save();

    console.log("✅ File uploaded successfully:", uploadResult.secure_url);

    res.json({
      message: "File uploaded successfully ✅",
      file: newFile,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Server error during upload", error: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 📂 Get all files for logged-in user                                        */
/* -------------------------------------------------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(files || []);
  } catch (err) {
    console.error("❌ Error fetching files:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
