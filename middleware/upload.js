const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads";

    if (req.originalUrl.includes("uploadVideo")) {
      folder = "videos";
    } else if (req.originalUrl.includes("updateProfile")) {
      folder = "avatars";
    }

    return {
      folder,
      resource_type: "auto", // important for videos
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;