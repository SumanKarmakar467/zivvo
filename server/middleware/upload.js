import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "zivvo/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
    public_id: `product_${Date.now()}_${Math.random().toString(36).slice(2)}`
  })
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zivvo/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }]
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Only JPG, PNG, and WebP images are allowed"), false);
};

export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }
});

export const upload = uploadProductImage;

export const uploadToCloudinary = (buffer, folder = "zivvo/products") => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
    if (err) reject(err);
    else resolve({ url: result.secure_url, public_id: result.public_id });
  });
  stream.end(buffer);
});

export const deleteCloudinaryImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
