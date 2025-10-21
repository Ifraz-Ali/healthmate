import dotenv from "dotenv";

dotenv.config();
import { v2 as cloudinary } from "cloudinary";

console.log("🧾 Cloudinary ENV CHECK:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // ✅ ensures https URLs
});

export default cloudinary;
