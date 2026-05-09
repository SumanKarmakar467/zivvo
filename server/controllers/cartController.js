import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product").lean();
  res.json(cart || { user: req.user._id, items: [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity = 1, variant } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existing = cart.items.find((i) => String(i.product) === product && i.variant === variant);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ product, quantity, variant });
  await cart.save();
  res.json(cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError("Cart not found", 404);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new AppError("Item not found", 404);
  item.quantity = req.body.quantity;
  await cart.save();
  res.json(cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError("Cart not found", 404);
  cart.items = cart.items.filter((i) => String(i._id) !== req.params.itemId);
  await cart.save();
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], appliedCoupon: null });
  res.json({ message: "Cart cleared" });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const code = (req.body.code || "").toUpperCase();
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) throw new AppError("Cart not found", 404);
  const coupon = await Coupon.findOne({ code, isActive: true });
  const now = new Date();
  if (!coupon || coupon.validFrom > now || coupon.validTill < now || coupon.usedCount >= coupon.usageLimit) throw new AppError("Invalid coupon", 400);
  const subtotal = cart.items.reduce((sum, i) => sum + (i.product?.discountPrice || i.product?.price || 0) * i.quantity, 0);
  if (subtotal < coupon.minOrderValue) throw new AppError("Minimum order value not met", 400);
  let discount = coupon.discountType === "flat" ? coupon.discountValue : (subtotal * coupon.discountValue) / 100;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  cart.appliedCoupon = { code: coupon.code, discount };
  await cart.save();
  res.json({ code: coupon.code, discount });
});
