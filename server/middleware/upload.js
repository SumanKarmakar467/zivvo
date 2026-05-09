import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = (buffer, folder = "shoppop") => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
    if (err) reject(err);
    else resolve({ url: result.secure_url, public_id: result.public_id });
  });
  stream.end(buffer);
});

