import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const populateCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name images price mrp stock slug seller");
  if (!cart) {
    return null;
  }
  return cart;
};

const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon || !subtotal) return 0;

  if (coupon.type === "freeship") {
    return 0;
  }

  if (coupon.type === "flat") {
    return Math.min(coupon.value, subtotal);
  }

  const raw = (subtotal * coupon.value) / 100;
  if (coupon.maxDiscount) {
    return Math.min(raw, coupon.maxDiscount);
  }
  return raw;
};

const formatCartResponse = async (cartDoc) => {
  const cart = cartDoc?.toObject ? cartDoc.toObject() : cartDoc;
  const items = (cart?.items || []).map((item) => {
    const product = item.product;
    const isMissing = !product;
    const isOutOfStock = !isMissing && product.stock < 1;

    return {
      _id: item._id,
      product,
      quantity: item.quantity,
      price: item.price,
      isDeleted: isMissing,
      isOutOfStock
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let couponDiscount = 0;
  let couponCode = cart?.coupon || "";
  let shipping = subtotal > 499 ? 0 : subtotal > 0 ? 40 : 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true }).lean();
    if (!coupon || (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())) {
      couponCode = "";
    } else {
      couponDiscount = calculateCouponDiscount(coupon, subtotal);
      if (coupon.type === "freeship") {
        shipping = 0;
      }
    }
  }

  const total = Math.max(0, subtotal - couponDiscount + shipping);

  return { items, subtotal, couponDiscount, shipping, total, couponCode };
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(req.user._id);
  const payload = await formatCartResponse(cart);
  return res.json(payload);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  const product = await Product.findById(productId).lean();
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find((item) => String(item.product) === String(productId));
  if (existing) {
    existing.quantity = Math.min(existing.quantity + Number(quantity || 1), product.stock || 1);
    existing.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: Math.min(Math.max(Number(quantity || 1), 1), product.stock || 1),
      price: product.price
    });
  }

  await cart.save();
  const populated = await populateCart(req.user._id);
  const payload = await formatCartResponse(populated);
  return res.json(payload);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const qty = Number(quantity);

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (qty === 0) {
    cart.items = cart.items.filter((i) => String(i._id) !== String(req.params.itemId));
    await cart.save();
    const populated = await populateCart(req.user._id);
    const payload = await formatCartResponse(populated);
    return res.json(payload);
  }

  const product = await Product.findById(item.product).lean();
  if (!product) {
    throw new AppError("Product no longer available", 404);
  }

  if (qty > product.stock) {
    throw new AppError("Insufficient stock", 400);
  }

  item.quantity = Math.max(1, qty);
  item.price = product.price;
  await cart.save();

  const populated = await populateCart(req.user._id);
  const payload = await formatCartResponse(populated);
  return res.json(payload);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter((item) => String(item._id) !== String(req.params.itemId));
  await cart.save();

  const populated = await populateCart(req.user._id);
  const payload = await formatCartResponse(populated);
  return res.json(payload);
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();
  if (!code) {
    throw new AppError("Coupon code is required", 400);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const coupon = await Coupon.findOne({ code }).lean();
  if (!coupon || !coupon.isActive) {
    throw new AppError("Invalid or inactive coupon", 400);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new AppError("Coupon expired", 400);
  }

  if (typeof coupon.usageLimit === "number" && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", 400);
  }

  if ((coupon.usedBy || []).some((id) => String(id) === String(req.user._id))) {
    throw new AppError("Coupon already used by this user", 400);
  }

  const populated = await populateCart(req.user._id);
  const payload = await formatCartResponse(populated);

  if (payload.subtotal < coupon.minOrder) {
    throw new AppError(`Minimum order value is Rs ${coupon.minOrder}`, 400);
  }

  cart.coupon = code;
  await cart.save();

  const nextPayload = await formatCartResponse(await populateCart(req.user._id));
  return res.json({
    ...nextPayload,
    discount: nextPayload.couponDiscount,
    message: "Coupon applied successfully"
  });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.coupon = "";
  await cart.save();

  const payload = await formatCartResponse(await populateCart(req.user._id));
  return res.json(payload);
});
