import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderStatusUpdate } from "../utils/emailService.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("items.product", "name images slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  return res.json({ orders, total, pages: Math.ceil(total / limit) });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name images slug price mrp")
    .populate("items.seller", "name email")
    .lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (String(order.user._id) !== String(req.user._id)) {
    throw new AppError("Forbidden", 403);
  }

  return res.json(order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (String(order.user) !== String(req.user._id)) {
    throw new AppError("Forbidden", 403);
  }

  if (!["placed", "confirmed"].includes(order.orderStatus)) {
    throw new AppError("Only placed or confirmed orders can be cancelled", 400);
  }

  order.orderStatus = "cancelled";
  order.cancelReason = reason || "Cancelled by user";
  order.statusHistory.push({ status: "cancelled", note: order.cancelReason, timestamp: new Date() });

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sold: -item.quantity }
    });
  }

  if (order.paymentMethod === "razorpay" && order.paymentStatus === "paid" && order.razorpayPaymentId) {
    try {
      await razorpay.payments.refund(order.razorpayPaymentId, { amount: Math.round(order.total * 100) });
      order.paymentStatus = "refunded";
    } catch (error) {
      throw new AppError("Unable to initiate refund at this time", 500);
    }
  }

  await order.save();

  const user = await User.findById(req.user._id).lean();
  if (user?.email) await sendOrderStatusUpdate(user, order, "cancelled");

  return res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, awbNumber, courierName, estimatedDelivery } = req.body;
  const pipeline = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (req.user.role === "seller") {
    const ownsAnyItem = order.items.some((item) => String(item.seller) === String(req.user._id));
    if (!ownsAnyItem) throw new AppError("Forbidden", 403);
  }

  if (!pipeline.includes(status)) throw new AppError("Invalid order status", 400);
  const currentIdx = pipeline.indexOf(order.orderStatus);
  const newIdx = pipeline.indexOf(status);
  if (newIdx <= currentIdx) throw new AppError("Invalid status transition", 400);

  order.orderStatus = status;
  order.statusHistory.push({ status, note: note || "Status updated", timestamp: new Date(), updatedBy: req.user._id });

  if (status === "shipped") {
    order.awbNumber = awbNumber || order.awbNumber || "";
    order.courierName = courierName || order.courierName || "";
    order.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : order.estimatedDelivery;
    order.trackingNumber = order.awbNumber || order.trackingNumber || `ZIV${Date.now()}`;
  }

  if (status === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }

  await order.save();
  const user = await User.findById(order.user).lean();
  if (user?.email) await sendOrderStatusUpdate(user, order, status);
  return res.json(order);
});
