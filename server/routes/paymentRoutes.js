// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", verifyFirebaseToken, createRazorpayOrder);
router.post("/verify", verifyFirebaseToken, verifyPayment);

export default router;
