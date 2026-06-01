// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";
import { deleteCloudinaryImage, uploadAvatar, uploadProductImage } from "../middleware/upload.js";

const router = express.Router();

router.post("/image", verifyFirebaseToken, requireRole("seller", "admin"), uploadProductImage.single("image"), (req, res) => {
  res.status(201).json({ url: req.file.path, publicId: req.file.filename });
});

router.post("/images", verifyFirebaseToken, requireRole("seller", "admin"), uploadProductImage.array("images", 5), (req, res) => {
  const images = (req.files || []).map((file) => ({ url: file.path, publicId: file.filename }));
  res.status(201).json({ images });
});

router.post("/avatar", verifyFirebaseToken, uploadAvatar.single("avatar"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true }).select("avatar");
    res.status(201).json({ url: user.avatar });
  } catch (error) {
    next(error);
  }
});

router.delete("/image", verifyFirebaseToken, requireRole("seller", "admin"), async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId is required" });

    const product = await Product.findOne({
      seller: req.user._id,
      imagePublicIds: publicId,
      status: { $ne: "deleted" }
    }).select("_id imagePublicIds images");

    if (!product) return res.status(403).json({ message: "Image does not belong to your product" });

    await deleteCloudinaryImage(publicId);
    product.imagePublicIds = product.imagePublicIds.filter((id) => id !== publicId);
    await product.save();
    res.json({ message: "Image deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
