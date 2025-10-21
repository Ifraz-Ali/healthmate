"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ use token & API_URL from context
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, API_URL, isAuthenticated } = useAuth();

  // 🧠 Handle upload + AI analysis
  const handleUpload = async () => {
    if (!isAuthenticated) {
      setMessage("⚠️ Please log in to upload your report.");
      return;
    }
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    setMessage("");

    try {
      // --- STEP 1: Upload File ---
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Auth required
        },
      });

      const fileId = uploadRes.data.file._id;
      console.log("✅ File uploaded:", fileId);

      // --- STEP 2: Trigger AI Analysis ---
      setMessage("🤖 Analyzing your report...");
      await axios.post(
        `${API_URL}/ai/analyze/${fileId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // --- STEP 3: Done ---
      setMessage("✅ File uploaded and analyzed successfully!");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload/Analyze failed:", err);
      if (err.response?.status === 401) {
        setMessage("⚠️ Session expired. Please log in again.");
      } else {
        setMessage(err.response?.data?.message || "❌ Upload failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Upload & Analyze Medical Report
      </h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 border p-2 rounded-md"
        accept="application/pdf,image/*"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </main>
  );
}
