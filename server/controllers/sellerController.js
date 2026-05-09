import slugify from "slugify";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { uploadToCloudinary } from "../middleware/upload.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

const parseSpecs = (specsInput) => {
  if (!specsInput) return {};
  if (typeof specsInput === "object" && !Array.isArray(specsInput)) return specsInput;

  try {
    const parsed = JSON.parse(specsInput);
    if (Array.isArray(parsed)) {
      return parsed.reduce((acc, item) => {
        if (item?.key && item?.value !== undefined) acc[item.key] = String(item.value);
        return acc;
      }, {});
    }
    if (parsed && typeof parsed === "object") return parsed;
  } catch (error) {
    return {};
  }

  return {};
};

const parseTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) return tagsInput.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tagsInput)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const uploadImages = async (files = []) => {
  const uploaded = [];
  for (const file of files) {
    const asset = await uploadToCloudinary(file.buffer, "zivvo/products");
    uploaded.push(asset.url);
  }
  return uploaded;
};

export const getSellerStats = asyncHandler(async (req, res) => {
  const sellerId = String(req.user._id);
  const sellerObjectId = toObjectId(sellerId);

  const [totalProducts, sellerProducts, sellerOrdersRaw] = await Promise.all([
    Product.countDocuments({ seller: sellerObjectId }),
    Product.find({ seller: sellerObjectId }).select("_id sold price rating").lean(),
    Order.find({ "items.seller": sellerObjectId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean()
  ]);

  const productIds = sellerProducts.map((product) => product._id);
  const totalReviews = productIds.length
    ? await Review.countDocuments({ product: { $in: productIds } })
    : 0;

  const deliveredOrders = sellerOrdersRaw.filter((order) => order.orderStatus === "delivered");

  let totalRevenue = 0;
  for (const order of deliveredOrders) {
    const sellerItems = order.items.filter((item) => String(item.seller) === sellerId);
    totalRevenue += sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  const totalOrders = sellerOrdersRaw.length;

  const recentOrders = sellerOrdersRaw.slice(0, 5).map((order) => {
    const sellerItems = order.items.filter((item) => String(item.seller) === sellerId);
    const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      _id: order._id,
      customer: order.user,
      items: sellerItems,
      total: sellerTotal,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt
    };
  });

  const now = new Date();
  const monthSeed = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleString("en-US", { month: "short" }),
      revenue: 0
    };
  });

  const revenueMap = new Map(monthSeed.map((entry) => [entry.key, entry]));

  for (const order of deliveredOrders) {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const target = revenueMap.get(key);
    if (!target) continue;

    const sellerItems = order.items.filter((item) => String(item.seller) === sellerId);
    target.revenue += sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  const revenueByMonth = monthSeed.map((entry) => revenueMap.get(entry.key));

  const topProducts = await Product.find({ seller: sellerObjectId })
    .sort({ sold: -1 })
    .limit(5)
    .select("name images sold price")
    .lean();

  const avgRating = sellerProducts.length
    ? sellerProducts.reduce((sum, p) => sum + Number(p.rating || 0), 0) / sellerProducts.length
    : 0;

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalReviews,
    recentOrders,
    revenueByMonth,
    topProducts,
    avgRating: Number(avgRating.toFixed(1))
  });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const sellerId = toObjectId(req.user._id);
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;

  const filter = { seller: sellerId };
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: searchRegex }, { description: searchRegex }, { brand: searchRegex }];
  }

  if (req.query.isActive === "true") filter.isActive = true;
  if (req.query.isActive === "false") filter.isActive = false;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(filter)
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, mrp, category, brand, stock, specs, tags, isFeatured, isActive } = req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error("name, description, price and category are required");
  }

  const files = req.files || [];
  if (!files.length) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  const images = await uploadImages(files);

  const product = await Product.create({
    name,
    slug: slugify(name, { lower: true, strict: true, trim: true }),
    description,
    price: Number(price),
    mrp: mrp ? Number(mrp) : undefined,
    images,
    category,
    brand: brand || "",
    seller: req.user._id,
    stock: stock ? Number(stock) : 0,
    specs: parseSpecs(specs),
    tags: parseTags(tags),
    isFeatured: isFeatured === "true" || isFeatured === true,
    isActive: isActive === undefined ? true : isActive === "true" || isActive === true
  });

  const created = await Product.findById(product._id).populate("category", "name slug").lean();
  res.status(201).json(created);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You do not have permission to update this product");
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "mrp",
    "category",
    "brand",
    "stock",
    "specs",
    "tags",
    "isFeatured",
    "isActive"
  ];

  for (const field of allowedFields) {
    if (req.body[field] === undefined) continue;

    if (field === "price" || field === "mrp" || field === "stock") {
      product[field] = Number(req.body[field]);
    } else if (field === "specs") {
      product.specs = parseSpecs(req.body.specs);
    } else if (field === "tags") {
      product.tags = parseTags(req.body.tags);
    } else if (field === "isFeatured" || field === "isActive") {
      product[field] = req.body[field] === "true" || req.body[field] === true;
    } else {
      product[field] = req.body[field];
    }
  }

  if (Array.isArray(req.files) && req.files.length > 0) {
    product.images = await uploadImages(req.files);
  }

  await product.save();

  const updated = await Product.findById(product._id).populate("category", "name slug").lean();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You do not have permission to delete this product");
  }

  product.isActive = false;
  await product.save();

  res.json({ message: "Product deactivated successfully" });
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = String(req.user._id);
  const sellerObjectId = toObjectId(sellerId);
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;

  const filter = { "items.seller": sellerObjectId };
  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }

  const [ordersRaw, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .lean(),
    Order.countDocuments(filter)
  ]);

  const orders = ordersRaw.map((order) => {
    const items = order.items.filter((item) => String(item.seller) === sellerId);
    const sellerTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      ...order,
      items,
      sellerTotal
    };
  });

  res.json({
    orders,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});
