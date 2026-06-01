import express from "express";
import { razorpayWebhook } from "../webhooks/razorpay.js";

const router = express.Router();

router.post("/razorpay", razorpayWebhook);

export default router;
