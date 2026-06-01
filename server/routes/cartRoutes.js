// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon
} from "../controllers/cartController.js";

const router = express.Router();

router.use(verifyFirebaseToken);
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/:itemId", updateCartItem);
router.delete("/remove/:itemId", removeFromCart);
router.delete("/:itemId", removeFromCart);
router.post("/coupon", applyCoupon);
router.delete("/coupon", removeCoupon);

export default router;
