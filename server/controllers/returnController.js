import Razorpay from "razorpay";
import ReturnRequest from "../models/ReturnRequest.js";
import Order from "../models/Order.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { createNotification } from "../utils/notify.js";
import { recalcTrustScoreAsync } from "../utils/trustScore.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const isWithinReturnWindow = (order, windowDays = 7) => {
  const deliveredEvent = [...(order.statusHistory || [])].reverse().find((event) => event.status === "delivered");
  if (!deliveredEvent) return false;
  const diffMs = Date.now() - new Date(deliveredEvent.timestamp).getTime();
  return diffMs <= windowDays * 24 * 60 * 60 * 1000;
};

const sumRefund = (order, items) => items.reduce((sum, item) => {
  const matched = (order.items || []).find((orderItem) =>
    String(orderItem.product) === String(item.product) &&
    String(orderItem.variantSku || "") === String(item.variantSku || "")
  );
  return sum + (matched ? Number(matched.price || 0) * Number(item.qty || 0) : 0);
}, 0);

export const createReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, items = [] } = req.body;
  const order = await Order.findById(orderId).lean();
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (String(order.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Forbidden");
  }
  if (order.orderStatus !== "delivered") {
    res.status(400);
    throw new Error("Order is not delivered yet");
  }
  if (!isWithinReturnWindow(order, 7)) {
    res.status(400);
    throw new Error("Return window has closed");
  }

  const existing = await ReturnRequest.findOne({
    order: order._id,
    buyer: req.user._id,
    status: { $in: ["requested", "approved", "refund_initiated"] }
  }).lean();
  if (existing) {
    res.status(400);
    throw new Error("A return request already exists for this order");
  }

  const seller = order.items?.[0]?.seller;
  const refundAmount = sumRefund(order, items);
  const returnReq = await ReturnRequest.create({
    order: order._id,
    buyer: req.user._id,
    seller,
    items,
    refundAmount,
    statusHistory: [{ status: "requested", note: "Return request raised", updatedBy: req.user._id }]
  });

  await createNotification({
    recipient: seller,
    type: "return_requested",
    title: "Return request received",
    body: `Buyer raised a return on order #${String(order._id).slice(-6).toUpperCase()}`,
    link: `/seller/returns/${returnReq._id}`,
    meta: { returnId: returnReq._id }
  });
  recalcTrustScoreAsync(seller);

  res.status(201).json(returnReq);
});

export const getBuyerReturns = asyncHandler(async (req, res) => {
  const list = await ReturnRequest.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate("order", "_id orderStatus total")
    .lean();
  res.json(list);
});

export const getSellerReturns = asyncHandler(async (req, res) => {
  const filter = { seller: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const list = await ReturnRequest.find(filter)
    .sort({ createdAt: -1 })
    .populate("buyer", "name email")
    .populate("order", "_id")
    .lean();
  res.json(list);
});

export const getReturnById = asyncHandler(async (req, res) => {
  const item = await ReturnRequest.findById(req.params.id)
    .populate("buyer", "name email")
    .populate("seller", "name email")
    .populate("order", "_id orderStatus total")
    .populate("items.product", "name images slug")
    .lean();
  if (!item) {
    res.status(404);
    throw new Error("Return request not found");
  }
  const canView = String(item.buyer?._id || item.buyer) === String(req.user._id) ||
    String(item.seller?._id || item.seller) === String(req.user._id) ||
    req.user.role === "admin";
  if (!canView) {
    res.status(403);
    throw new Error("Forbidden");
  }
  res.json(item);
});

export const approveReturn = asyncHandler(async (req, res) => {
  const { sellerNote = "" } = req.body;
  const returnRequest = await ReturnRequest.findById(req.params.id);
  if (!returnRequest) {
    res.status(404);
    throw new Error("Return request not found");
  }
  if (String(returnRequest.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }
  if (!["requested", "approved"].includes(returnRequest.status)) {
    res.status(400);
    throw new Error("Return request is not in approvable state");
  }

  const order = await Order.findById(returnRequest.order);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (!order.razorpayPaymentId) {
    res.status(400);
    throw new Error("Cannot initiate refund for non-Razorpay paid order");
  }

  const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
    amount: Math.round(Number(returnRequest.refundAmount || 0) * 100),
    notes: { returnId: String(returnRequest._id), orderId: String(order._id) }
  });

  returnRequest.status = "refund_initiated";
  returnRequest.razorpayRefundId = refund.id;
  returnRequest.sellerNote = sellerNote;
  returnRequest.resolvedAt = new Date();
  returnRequest.statusHistory.push({
    status: "refund_initiated",
    note: sellerNote || "Approved and refund initiated",
    updatedBy: req.user._id
  });
  await returnRequest.save();

  order.orderStatus = "return_requested";
  await order.save();

  await createNotification({
    recipient: returnRequest.buyer,
    type: "order_status",
    title: "Return approved - refund initiated",
    body: `Your refund of Rs ${Number(returnRequest.refundAmount).toLocaleString("en-IN")} has been initiated. It will reflect in 5–7 business days.`,
    link: `/orders/${order._id}`
  });
  recalcTrustScoreAsync(returnRequest.seller);

  res.json(returnRequest);
});

export const rejectReturn = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }
  const returnRequest = await ReturnRequest.findById(req.params.id);
  if (!returnRequest) {
    res.status(404);
    throw new Error("Return request not found");
  }
  if (String(returnRequest.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }
  returnRequest.status = "rejected";
  returnRequest.sellerNote = reason;
  returnRequest.resolvedAt = new Date();
  returnRequest.statusHistory.push({ status: "rejected", note: reason, updatedBy: req.user._id });
  await returnRequest.save();
  await createNotification({
    recipient: returnRequest.buyer,
    type: "order_status",
    title: "Return request rejected",
    body: reason,
    link: `/returns/${returnRequest._id}`
  });
  recalcTrustScoreAsync(returnRequest.seller);
  res.json(returnRequest);
});

export const closeReturn = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }
  const returnRequest = await ReturnRequest.findById(req.params.id);
  if (!returnRequest) {
    res.status(404);
    throw new Error("Return request not found");
  }
  returnRequest.status = "closed";
  returnRequest.resolvedAt = new Date();
  returnRequest.statusHistory.push({ status: "closed", note: req.body.note || "Closed by admin", updatedBy: req.user._id });
  await returnRequest.save();
  recalcTrustScoreAsync(returnRequest.seller);
  res.json(returnRequest);
});
