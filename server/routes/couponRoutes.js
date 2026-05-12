import express from "express";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  validateCoupon
} from "../controllers/couponController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createCoupon);
router.get("/", listCoupons);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.post("/validate", validateCoupon);

export default router;
