import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const users = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;
  const data = await User.find().select("-password").skip(skip).limit(limit).lean();
  res.json(data);
});

export const changeRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).lean();
  res.json(user);
});

export const products = asyncHandler(async (req, res) => {
  res.json(await Product.find({}).lean());
});

export const approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).lean();
  res.json(product);
});

export const deleteProductAdmin = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted permanently" });
});

export const orders = asyncHandler(async (req, res) => {
  const query = req.query.status ? { orderStatus: req.query.status } : {};
  res.json(await Order.find(query).sort({ createdAt: -1 }).lean());
});

export const stats = asyncHandler(async (req, res) => {
  const [allOrders, totalUsers, totalProducts] = await Promise.all([Order.find().lean(), User.countDocuments(), Product.countDocuments({ isDeleted: false })]);
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  res.json({ totalRevenue, totalOrders: allOrders.length, totalUsers, totalProducts, dailyRevenue: [] });
});

export const coupons = asyncHandler(async (req, res) => {
  res.json(await Coupon.find().sort({ createdAt: -1 }).lean());
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
  res.status(201).json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Coupon deleted" });
});
