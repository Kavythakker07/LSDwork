const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use /mnt/data on Render, otherwise fallback to local uploads folder
const baseUploadDir = process.env.RENDER === "true"
  ? "/mnt/data"
  : path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (req.originalUrl.includes("updateProfile")) {
      folderPath = path.join(baseUploadDir, "avatars");
    } else if (req.originalUrl.includes("uploadVideo")) {
      folderPath = path.join(baseUploadDir, "videos");
    } else {
      folderPath = baseUploadDir;
    }

    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const safeName = encodeURIComponent(file.originalname);
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
