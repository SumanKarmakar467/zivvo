// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  validateCoupon
} from "../controllers/couponController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.use(verifyFirebaseToken);
router.post("/", createCoupon);
router.get("/", listCoupons);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.post("/validate", validateCoupon);

export default router;
