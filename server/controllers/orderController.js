import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || !cart.items.length) throw new AppError("Cart is empty", 400);

  const subtotal = cart.items.reduce((sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity, 0);
  const discount = cart.appliedCoupon?.discount || 0;
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const totalAmount = subtotal - discount + deliveryCharge;

  const items = cart.items.map((i) => ({
    product: i.product._id, name: i.product.name, image: i.product.images?.[0]?.url || "", price: i.product.discountPrice || i.product.price, quantity: i.quantity, variant: i.variant, seller: i.product.seller
  }));

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    subtotal,
    discount,
    deliveryCharge,
    totalAmount,
    couponApplied: cart.appliedCoupon || undefined,
    paymentMethod: req.body.paymentMethod,
    deliverySlot: req.body.deliverySlot,
    expectedDelivery: req.body.expectedDelivery
  });

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], appliedCoupon: null });
  await sendEmail({ to: req.user.email, subject: `Order ${order.orderNumber} confirmed`, html: `<h2>Order placed: ${order.orderNumber}</h2><p>Total: INR ${order.totalAmount}</p>` });
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) throw new AppError("Order not found", 404);
  if (String(order.user) !== String(req.user._id) && req.user.role !== "admin") throw new AppError("Forbidden", 403);
  res.json(order);
});

export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) throw new AppError("Order not found", 404);
  res.json({ orderStatus: order.orderStatus, trackingId: order.trackingId, expectedDelivery: order.expectedDelivery });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  if (!["placed", "confirmed"].includes(order.orderStatus)) throw new AppError("Cannot cancel now", 400);
  order.orderStatus = "cancelled";
  order.cancelReason = req.body.reason;
  await order.save();
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  order.orderStatus = req.body.status;
  if (req.body.status === "shipped") order.trackingId = order.trackingId || `TRK${Date.now()}`;
  await order.save();
  res.json(order);
});

export const returnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  order.orderStatus = "returned";
  await order.save();
  res.json({ message: "Return initiated" });
});
