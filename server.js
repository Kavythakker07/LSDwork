// app.js / server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const path = require("path");

const app = express();

// 🔥 Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// 🔥 Static files
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use(express.static(path.join(__dirname, "public")));

app.get("/player.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/player.html"));
});

// 🔥 Debug logs (IMPORTANT)
console.log("📂 Serving static files from:", uploadsPath);
console.log("🌐 MONGO_URI exists:", !!process.env.MONGO_URI);

// 🔥 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 🔥 Session (temporary, fine for now)
app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // set true later with HTTPS
    },
  })
);

// 🔥 Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🔥 Cron Jobs
require("./utils/mcqCleaner");
require("./utils/liveSessionCleaner");
require("./utils/announcementCleaner");

// 🔥 Health check route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// 🔥 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
