// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireRole("user", "buyer", "admin"));

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
