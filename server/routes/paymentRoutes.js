import express from "express";
import { createRazorpayOrder, refund, verifyPayment, webhook } from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.post("/webhook", webhook);
router.post("/refund", protect, authorize("admin"), refund);
export default router;
