import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const isAdmin = (user) => user?.role === "admin";
const isSeller = (user) => user?.role === "seller";

const calculateDiscount = (coupon, cartTotal) => {
  if (coupon.type === "flat") return Math.min(coupon.value, cartTotal);
  return Math.min((cartTotal * coupon.value) / 100, coupon.maxDiscount ?? Number.POSITIVE_INFINITY);
};

export const createCoupon = asyncHandler(async (req, res) => {
  if (!isAdmin(req.user) && !isSeller(req.user)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const payload = {
    code: String(req.body.code || "").toUpperCase().trim(),
    type: req.body.type,
    value: Number(req.body.value),
    maxDiscount: req.body.maxDiscount === "" || req.body.maxDiscount === undefined ? null : Number(req.body.maxDiscount),
    minOrderValue: Number(req.body.minOrderValue || 0),
    scope: req.body.scope || (isAdmin(req.user) ? "platform" : "seller"),
    seller: (req.body.scope || "seller") === "seller" ? (req.body.seller || req.user._id) : null,
    usageLimit: req.body.usageLimit === "" || req.body.usageLimit === undefined ? null : Number(req.body.usageLimit),
    perUserLimit: Number(req.body.perUserLimit || 1),
    validFrom: req.body.validFrom ? new Date(req.body.validFrom) : new Date(),
    validUntil: req.body.validUntil ? new Date(req.body.validUntil) : null,
    isActive: req.body.isActive === undefined ? true : Boolean(req.body.isActive),
    applicableCategories: Array.isArray(req.body.applicableCategories) ? req.body.applicableCategories : []
  };

  const coupon = await Coupon.create(payload);
  res.status(201).json(coupon);
});

export const listCoupons = asyncHandler(async (req, res) => {
  if (!isAdmin(req.user) && !isSeller(req.user)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const filter = isAdmin(req.user) ? {} : { $or: [{ seller: req.user._id }, { scope: "platform" }] };
  const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();
  res.json(coupons);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (!isAdmin(req.user) && String(coupon.seller) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const fields = ["code", "type", "value", "maxDiscount", "minOrderValue", "scope", "usageLimit", "perUserLimit", "validFrom", "validUntil", "isActive", "applicableCategories"];
  fields.forEach((field) => {
    if (req.body[field] === undefined) return;
    if (field === "code") coupon.code = String(req.body.code).toUpperCase().trim();
    else if (["value", "maxDiscount", "minOrderValue", "usageLimit", "perUserLimit"].includes(field)) {
      coupon[field] = req.body[field] === "" || req.body[field] === null ? null : Number(req.body[field]);
    } else if (["validFrom", "validUntil"].includes(field)) {
      coupon[field] = req.body[field] ? new Date(req.body[field]) : null;
    } else {
      coupon[field] = req.body[field];
    }
  });

  if (req.body.seller !== undefined) coupon.seller = req.body.seller || null;
  await coupon.save();
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  if (!isAdmin(req.user) && String(coupon.seller) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Forbidden");
  }
  await coupon.deleteOne();
  res.json({ success: true });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal, sellerId, categories = [] } = req.body;
  const normalizedCode = String(code || "").toUpperCase().trim();
  const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) {
    res.status(400);
    throw new Error("Coupon not yet active");
  }
  if (coupon.validUntil && coupon.validUntil < now) {
    res.status(400);
    throw new Error("Coupon has expired");
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }

  const total = Number(cartTotal || 0);
  if (total < coupon.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order value is Rs ${coupon.minOrderValue}`);
  }
  if (coupon.scope === "seller" && String(coupon.seller) !== String(sellerId)) {
    res.status(400);
    throw new Error("Coupon not valid for this seller");
  }
  if (coupon.applicableCategories?.length) {
    const applicable = categories.some((cat) => coupon.applicableCategories.includes(cat));
    if (!applicable) {
      res.status(400);
      throw new Error("Coupon not valid for selected categories");
    }
  }

  const userUsage = await Order.countDocuments({ user: req.user._id, couponCode: normalizedCode });
  if (userUsage >= Number(coupon.perUserLimit || 1)) {
    res.status(400);
    throw new Error("You have already used this coupon");
  }

  let discount = calculateDiscount(coupon, total);
  discount = Math.round(discount);

  res.json({
    valid: true,
    discount,
    finalTotal: Math.max(0, total - discount),
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value }
  });
});

