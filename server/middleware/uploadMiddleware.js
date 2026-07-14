const multer = require("multer");

// STORE FILE TEMPORARILY IN MEMORY
const storage = multer.memoryStorage();

// ALLOWED IMAGE TYPES
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }

  cb(null, true);
};

// PROFILE PHOTO UPLOAD MIDDLEWARE
const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadProfilePhoto;