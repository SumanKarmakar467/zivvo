import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `shoppop_${Date.now()}` });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, internalOrderId } = req.body;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  if (expected !== signature) throw new AppError("Payment verification failed", 400);
  await Order.findByIdAndUpdate(internalOrderId, { paymentStatus: "paid", razorpayOrderId: orderId, razorpayPaymentId: paymentId });
  res.json({ message: "Payment verified" });
});

export const webhook = asyncHandler(async (req, res) => {
  res.json({ received: true });
});

export const refund = asyncHandler(async (req, res) => {
  res.json({ message: "Refund initiated" });
});

