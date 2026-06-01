// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { upload } from "../middleware/upload.js";
import {
  addAddress,
  changePassword,
  deleteAddress,
  getAddresses,
  getProfile,
  getWishlist,
  toggleWishlist,
  updateAddress,
  updateProfile,
  uploadAvatar
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", verifyFirebaseToken, getProfile);
router.put("/profile", verifyFirebaseToken, updateProfile);
router.post("/avatar", verifyFirebaseToken, upload.single("avatar"), uploadAvatar);

router.get("/addresses", verifyFirebaseToken, getAddresses);
router.post("/addresses", verifyFirebaseToken, addAddress);
router.put("/addresses/:id", verifyFirebaseToken, updateAddress);
router.delete("/addresses/:id", verifyFirebaseToken, deleteAddress);

router.get("/wishlist", verifyFirebaseToken, getWishlist);
router.post("/wishlist/:productId", verifyFirebaseToken, toggleWishlist);

router.put("/password", verifyFirebaseToken, changePassword);

export default router;
