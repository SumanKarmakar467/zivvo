import crypto from "crypto";
import Razorpay from "razorpay";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { sendOrderConfirmation } from "../utils/emailService.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const getCheckoutContext = async (userId, addressId) => {
  const [user, cart] = await Promise.all([
    User.findById(userId).select("name email addresses"),
    Cart.findOne({ user: userId }).populate("items.product")
  ]);

  if (!user) throw new AppError("User not found", 404);
  if (!cart || !cart.items.length) throw new AppError("Cart is empty", 400);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  const items = cart.items.map((item) => {
    const p = item.product;
    if (!p || !p.isActive) throw new AppError("One or more products are unavailable", 400);
    if (item.quantity > p.stock) throw new AppError(`Insufficient stock for ${p.name}`, 400);

    return {
      product: p._id,
      name: p.name,
      image: p.images?.[0] || "",
      price: item.price || p.price,
      quantity: item.quantity,
      seller: p.seller
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = 0;
  let couponCode = cart.coupon || "";
  let couponDiscount = 0;
  let shipping = subtotal > 499 ? 0 : 40;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
      couponCode = "";
    } else {
      if (subtotal < coupon.minOrder) throw new AppError(`Minimum order value is Rs ${coupon.minOrder}`, 400);
      if (coupon.type === "percent") {
        const raw = (subtotal * coupon.value) / 100;
        couponDiscount = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      } else if (coupon.type === "flat") {
        couponDiscount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === "freeship") {
        shipping = 0;
      }
    }
  }

  const total = Math.max(0, subtotal - couponDiscount + shipping);

  return {
    user,
    address,
    items,
    subtotal,
    discount,
    couponCode,
    couponDiscount,
    shipping,
    total
  };
};

const createOrderDocument = async ({
  userId,
  paymentMethod,
  paymentStatus,
  razorpayOrderId = "",
  razorpayPaymentId = "",
  razorpaySignature = "",
  address,
  items,
  subtotal,
  discount,
  couponCode,
  couponDiscount,
  shipping,
  total
}) => {
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || "India"
    },
    paymentMethod,
    paymentStatus,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderStatus: "placed",
    statusHistory: [{ status: "placed", note: "Order placed successfully" }],
    subtotal,
    discount,
    couponCode,
    couponDiscount,
    shipping,
    total,
    estimatedDelivery
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity }
    });
  }

  await Cart.findOneAndUpdate({ user: userId }, { items: [], coupon: "" });

  if (couponCode) {
    await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 }, $addToSet: { usedBy: userId } }
    );
  }

  return order;
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  if (!addressId || !paymentMethod) throw new AppError("addressId and paymentMethod are required", 400);
  if (!["razorpay", "cod"].includes(paymentMethod)) throw new AppError("Invalid payment method", 400);

  const context = await getCheckoutContext(req.user._id, addressId);

  if (paymentMethod === "razorpay") {
    const rzOrder = await razorpay.orders.create({
      amount: Math.round(context.total * 100),
      currency: "INR",
      receipt: `zivvo_${Date.now()}`
    });

    return res.json({
      razorpayOrderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  }

  const order = await createOrderDocument({
    userId: req.user._id,
    paymentMethod: "cod",
    paymentStatus: "pending",
    address: context.address,
    items: context.items,
    subtotal: context.subtotal,
    discount: context.discount,
    couponCode: context.couponCode,
    couponDiscount: context.couponDiscount,
    shipping: context.shipping,
    total: context.total
  });

  await sendOrderConfirmation(context.user, order);

  return res.json({ orderId: order._id });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, addressId } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !addressId) {
    throw new AppError("Missing payment verification data", 400);
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    throw new AppError("Payment verification failed", 400);
  }

  const context = await getCheckoutContext(req.user._id, addressId);

  const order = await createOrderDocument({
    userId: req.user._id,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    address: context.address,
    items: context.items,
    subtotal: context.subtotal,
    discount: context.discount,
    couponCode: context.couponCode,
    couponDiscount: context.couponDiscount,
    shipping: context.shipping,
    total: context.total
  });

  await sendOrderConfirmation(context.user, order);

  return res.json({ orderId: order._id, success: true });
});
