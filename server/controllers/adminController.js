import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { sendOrderStatusUpdate } from "../utils/emailService.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthSeed = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleString("en-US", { month: "short" }),
      revenue: 0
    };
  });

  const [orders, totalUsers, totalProducts, totalSellers, categories] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).populate("user", "name email avatar").lean(),
    User.countDocuments({}),
    Product.countDocuments({}),
    User.countDocuments({ role: "seller" }),
    Category.find({}).lean()
  ]);

  const ordersByStatus = {
    placed: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  const monthlyMap = new Map(monthSeed.map((m) => [m.key, { ...m }]));
  let totalRevenue = 0;

  for (const order of orders) {
    if (ordersByStatus[order.orderStatus] !== undefined) {
      ordersByStatus[order.orderStatus] += 1;
    }

    if (order.orderStatus === "delivered") {
      totalRevenue += Number(order.total || 0);
      const d = new Date(order.createdAt);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      const target = monthlyMap.get(k);
      if (target) target.revenue += Number(order.total || 0);
    }
  }

  const revenueByMonth = monthSeed.map((m) => monthlyMap.get(m.key));
  const totalOrders = orders.length;

  const productRows = await Product.find({ category: { $ne: null } }).select("category").lean();
  const categoryCountMap = new Map();
  for (const row of productRows) {
    const key = String(row.category);
    categoryCountMap.set(key, (categoryCountMap.get(key) || 0) + 1);
  }

  const categoryRevenueMap = new Map();
  const productToCategory = new Map(
    (await Product.find({}).select("_id category").lean()).map((p) => [String(p._id), p.category ? String(p.category) : null])
  );

  for (const order of orders) {
    if (order.orderStatus !== "delivered") continue;
    for (const item of order.items || []) {
      const catId = item.product ? productToCategory.get(String(item.product)) : null;
      if (!catId) continue;
      const value = Number(item.price || 0) * Number(item.quantity || 0);
      categoryRevenueMap.set(catId, (categoryRevenueMap.get(catId) || 0) + value);
    }
  }

  const topCategories = categories
    .map((category) => ({
      name: category.name,
      productCount: categoryCountMap.get(String(category._id)) || 0,
      revenue: categoryRevenueMap.get(String(category._id)) || 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const recentOrders = orders.slice(0, 10);

  res.json({
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    totalSellers,
    revenueByMonth,
    ordersByStatus,
    topCategories,
    recentOrders
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 20), 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).select("name email avatar role isActive createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter)
  ]);

  res.json({ users, page, pages: Math.ceil(total / limit), total });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.role) updates.role = req.body.role;
  if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    .select("name email avatar role isActive createdAt")
    .lean();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 20), 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: regex }, { brand: regex }, { description: regex }];
  }

  if (req.query.category) {
    filter.category = toObjectId(req.query.category);
  }

  if (req.query.seller) {
    filter.seller = toObjectId(req.query.seller);
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("seller", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

export const toggleProductActive = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = !product.isActive;
  await product.save();

  res.json({ message: "Product status updated", isActive: product.isActive });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 20), 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter)
  ]);

  let filteredOrders = orders;
  if (req.query.search) {
    const needle = String(req.query.search).toLowerCase();
    filteredOrders = orders.filter((order) =>
      String(order._id).toLowerCase().includes(needle) ||
      String(order.user?.name || "").toLowerCase().includes(needle) ||
      String(order.user?.email || "").toLowerCase().includes(needle)
    );
  }

  res.json({ orders: filteredOrders, page, pages: Math.ceil(total / limit), total });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400);
    throw new Error("status is required");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: "Updated by admin" });
  await order.save();
  const user = await User.findById(order.user).lean();
  if (user?.email) await sendOrderStatusUpdate(user, order, status);

  res.json({ message: "Order status updated", orderStatus: order.orderStatus });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    icon: req.body.icon || "",
    image: req.body.image || "",
    parent: req.body.parent || null,
    isActive: req.body.isActive === undefined ? true : req.body.isActive
  });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body.name !== undefined ? { name: req.body.name } : {}),
      ...(req.body.icon !== undefined ? { icon: req.body.icon } : {}),
      ...(req.body.image !== undefined ? { image: req.body.image } : {}),
      ...(req.body.parent !== undefined ? { parent: req.body.parent || null } : {}),
      ...(req.body.isActive !== undefined ? { isActive: req.body.isActive } : {})
    },
    { new: true }
  ).lean();

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id).lean();
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ message: "Category deleted" });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    code: String(req.body.code || "").toUpperCase(),
    type: req.body.type,
    value: Number(req.body.value || 0),
    minOrder: Number(req.body.minOrder || 0),
    maxDiscount: req.body.maxDiscount !== undefined && req.body.maxDiscount !== "" ? Number(req.body.maxDiscount) : null,
    usageLimit: req.body.usageLimit !== undefined && req.body.usageLimit !== "" ? Number(req.body.usageLimit) : null,
    expiresAt: req.body.expiresAt || null,
    isActive: req.body.isActive === undefined ? true : req.body.isActive
  });

  res.status(201).json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const update = {
    ...(req.body.code !== undefined ? { code: String(req.body.code).toUpperCase() } : {}),
    ...(req.body.type !== undefined ? { type: req.body.type } : {}),
    ...(req.body.value !== undefined ? { value: Number(req.body.value) } : {}),
    ...(req.body.minOrder !== undefined ? { minOrder: Number(req.body.minOrder) } : {}),
    ...(req.body.maxDiscount !== undefined ? { maxDiscount: req.body.maxDiscount === "" ? null : Number(req.body.maxDiscount) } : {}),
    ...(req.body.usageLimit !== undefined ? { usageLimit: req.body.usageLimit === "" ? null : Number(req.body.usageLimit) } : {}),
    ...(req.body.expiresAt !== undefined ? { expiresAt: req.body.expiresAt || null } : {}),
    ...(req.body.isActive !== undefined ? { isActive: req.body.isActive } : {})
  };

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id).lean();
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json({ message: "Coupon deleted" });
});
