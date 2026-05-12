import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const populateCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name images price mrp stock slug seller category hasVariants variants");
  if (!cart) {
    return null;
  }
  return cart;
};

const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon || !subtotal) return 0;

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
      variantSku: item.variantSku || "",
      variantAttributes: item.variantAttributes || {},
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
    const now = new Date();
    if (!coupon || (coupon.validFrom && new Date(coupon.validFrom) > now) || (coupon.validUntil && new Date(coupon.validUntil) < now)) {
      couponCode = "";
    } else {
      couponDiscount = calculateCouponDiscount(coupon, subtotal);
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
  const { productId, quantity = 1, variantSku = "", variantAttributes = {} } = req.body;

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

  let variant = null;
  if (variantSku) {
    variant = (product.variants || []).find((row) => row.sku === String(variantSku).toUpperCase() && row.isActive);
    if (!variant) throw new AppError("Variant not found", 404);
  }

  const existing = cart.items.find((item) =>
    String(item.product) === String(productId) &&
    String(item.variantSku || "") === String(variantSku || "").toUpperCase()
  );
  const maxStock = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
  const unitPrice = variant ? Number(product.price + Number(variant.priceDelta || 0)) : Number(product.price);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + Number(quantity || 1), maxStock || 1);
    existing.price = unitPrice;
    existing.variantSku = variant ? variant.sku : "";
    existing.variantAttributes = variant ? (variant.attributes || {}) : (variantAttributes || {});
  } else {
    cart.items.push({
      product: product._id,
      quantity: Math.min(Math.max(Number(quantity || 1), 1), maxStock || 1),
      price: unitPrice,
      variantSku: variant ? variant.sku : "",
      variantAttributes: variant ? (variant.attributes || {}) : (variantAttributes || {})
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

  const variant = item.variantSku
    ? (product.variants || []).find((row) => row.sku === item.variantSku && row.isActive)
    : null;
  const availableStock = variant ? Number(variant.stock || 0) : Number(product.stock || 0);

  if (item.variantSku && !variant) {
    throw new AppError("Selected variant is no longer available", 400);
  }

  if (qty > availableStock) {
    throw new AppError("Insufficient stock", 400);
  }

  item.quantity = Math.max(1, qty);
  item.price = variant ? Number(product.price + Number(variant.priceDelta || 0)) : product.price;
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

  const now = new Date();
  if ((coupon.validFrom && new Date(coupon.validFrom) > now) || (coupon.validUntil && new Date(coupon.validUntil) < now)) {
    throw new AppError("Coupon expired", 400);
  }

  if (typeof coupon.usageLimit === "number" && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", 400);
  }

  const populated = await populateCart(req.user._id);
  const payload = await formatCartResponse(populated);

  if (payload.subtotal < coupon.minOrderValue) {
    throw new AppError(`Minimum order value is Rs ${coupon.minOrderValue}`, 400);
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
