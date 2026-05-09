import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const dashboard = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, isDeleted: false }).lean();
  const orders = await Order.find({ "items.seller": req.user._id }).lean();
  const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  res.json({ revenue, orders: orders.length, products: products.length, avgRating: 4.3, recentOrders: orders.slice(0, 5), salesChart: [] });
});

export const sellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, isDeleted: false }).lean();
  res.json(products);
});

export const sellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user._id }).sort({ createdAt: -1 }).lean();
  res.json(orders);
});

export const addProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const uploads = [];
  for (const file of req.files || []) uploads.push(await uploadToCloudinary(file.buffer, "shoppop/products"));
  product.images.push(...uploads);
  await product.save();
  res.json(product);
});

