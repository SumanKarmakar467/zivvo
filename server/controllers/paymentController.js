import crypto from "crypto";
import Razorpay from "razorpay";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import { sendOrderConfirmation } from "../utils/emailService.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { createNotification } from "../utils/notify.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const getCheckoutContext = async (userId, addressId) => {
  const [user, cart, savedAddress] = await Promise.all([
    User.findById(userId).select("name email addresses"),
    Cart.findOne({ user: userId }).populate("items.product"),
    Address.findOne({ _id: addressId, user: userId }).lean()
  ]);

  if (!user) throw new AppError("User not found", 404);
  if (!cart || !cart.items.length) throw new AppError("Cart is empty", 400);

  const legacyAddress = user.addresses?.id ? user.addresses.id(addressId) : null;
  const address = savedAddress || legacyAddress;
  if (!address) throw new AppError("Address not found", 404);

  const items = cart.items.map((item) => {
    const p = item.product;
    if (!p || !p.isActive) throw new AppError("One or more products are unavailable", 400);

    let selectedVariant = null;
    if (item.variantSku) {
      selectedVariant = (p.variants || []).find((row) => row.sku === item.variantSku && row.isActive);
      if (!selectedVariant) throw new AppError(`Selected variant unavailable for ${p.name}`, 400);
      if (item.quantity > Number(selectedVariant.stock || 0)) throw new AppError(`Insufficient variant stock for ${p.name}`, 400);
    } else if (item.quantity > p.stock) {
      throw new AppError(`Insufficient stock for ${p.name}`, 400);
    }

    const unitPrice = selectedVariant ? Number(p.price + Number(selectedVariant.priceDelta || 0)) : (item.price || p.price);

    return {
      product: p._id,
      name: p.name,
      image: selectedVariant?.images?.[0] || p.images?.[0] || "",
      price: unitPrice,
      quantity: item.quantity,
      seller: p.seller,
      variantSku: selectedVariant?.sku || "",
      variantAttributes: selectedVariant?.attributes || item.variantAttributes || {}
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = 0;
  let couponCode = cart.coupon || "";
  let couponDiscount = 0;
  let shipping = subtotal > 499 ? 0 : 40;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    const now = new Date();
    if (!coupon || (coupon.validFrom && coupon.validFrom > now) || (coupon.validUntil && coupon.validUntil < now)) {
      couponCode = "";
    } else {
      if (subtotal < coupon.minOrderValue) throw new AppError(`Minimum order value is Rs ${coupon.minOrderValue}`, 400);
      const sellerIds = [...new Set(items.map((item) => String(item.seller)))];
      if (coupon.scope === "seller" && !sellerIds.includes(String(coupon.seller))) {
        throw new AppError("Coupon not valid for this seller", 400);
      }
      const usedCountByUser = await Order.countDocuments({ user: userId, couponCode });
      if (usedCountByUser >= Number(coupon.perUserLimit || 1)) {
        throw new AppError("You have already used this coupon", 400);
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError("Coupon usage limit reached", 400);
      }
      if (coupon.type === "percent") {
        const raw = (subtotal * coupon.value) / 100;
        couponDiscount = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      } else {
        couponDiscount = Math.min(coupon.value, subtotal);
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
  total,
  finalize = true
}) => {
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1 || address.line1,
      addressLine2: address.addressLine2 || address.line2,
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
    discountAmount: couponDiscount,
    couponDiscount,
    shipping,
    total,
    totalAmount: total,
    estimatedDelivery
  });

  if (finalize) {
    await finalizeOrder({ order, items, userId, couponCode, total });
  }

  return order;
};

const finalizeOrder = async ({ order, items, userId, couponCode, total }) => {
  for (const item of items) {
    if (item.variantSku) {
      await Product.findOneAndUpdate(
        { _id: item.product, "variants.sku": item.variantSku },
        { $inc: { "variants.$.stock": -item.quantity, sold: item.quantity } }
      );
    } else {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }
  }

  await Cart.findOneAndUpdate({ user: userId }, { items: [], coupon: "" });

  if (couponCode) {
    await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 } }
    );
  }

  const sellerIds = [...new Set(items.map((item) => String(item.seller)))];
  await Promise.all(
    sellerIds.map((sellerId) =>
      createNotification({
        recipient: sellerId,
        type: "new_order",
        title: "New order received",
        body: `Order #${String(order._id).slice(-6).toUpperCase()} - Rs ${Number(total).toLocaleString("en-IN")}`,
        link: `/seller/orders/${order._id}`,
        meta: { orderId: order._id }
      })
    )
  );
};

const safelySendOrderConfirmation = async (user, order) => {
  try {
    await sendOrderConfirmation(user, order);
  } catch (error) {
    console.error(`Order confirmation email failed for ${order._id}:`, error.message);
  }
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

    const order = await createOrderDocument({
      userId: req.user._id,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      razorpayOrderId: rzOrder.id,
      address: context.address,
      items: context.items,
      subtotal: context.subtotal,
      discount: context.discount,
      couponCode: context.couponCode,
      couponDiscount: context.couponDiscount,
      shipping: context.shipping,
      total: context.total,
      finalize: false
    });

    return res.json({
      razorpayOrderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
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

  await safelySendOrderConfirmation(context.user, order);

  return res.json({ orderId: order._id });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, addressId, orderId } = req.body;

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

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    razorpayOrderId
  });

  if (!order) throw new AppError("Order not found", 404);
  if (order.paymentStatus === "paid") {
    return res.json({ orderId: order._id, success: true });
  }

  const context = await getCheckoutContext(req.user._id, addressId);

  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.orderStatus = "confirmed";
  order.statusHistory.push({
    status: "confirmed",
    note: "Payment confirmed. Your order is being processed.",
    timestamp: new Date()
  });
  await order.save();

  await finalizeOrder({
    order,
    items: order.items,
    userId: req.user._id,
    couponCode: order.couponCode,
    total: order.total
  });

  await safelySendOrderConfirmation(context.user, order);

  return res.json({ orderId: order._id, success: true });
});
