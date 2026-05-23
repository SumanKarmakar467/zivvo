import slugify from "slugify";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { sendOrderStatusUpdate } from "../utils/emailService.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) return tagsInput.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tagsInput).split(",").map((tag) => tag.trim()).filter(Boolean);
};

const normalizeProductPayload = (body) => {
  const specsInput = parseJson(body.specifications ?? body.specs, {});
  const specs = Array.isArray(specsInput)
    ? specsInput.reduce((acc, item) => {
        if (item?.key && item?.value !== undefined) acc[item.key] = String(item.value);
        return acc;
      }, {})
    : specsInput;

  return {
    name: body.name,
    slug: body.name ? slugify(body.name, { lower: true, strict: true, trim: true }) : undefined,
    description: body.description,
    price: body.price === undefined ? undefined : Number(body.price),
    mrp: body.mrp === undefined ? undefined : Number(body.mrp),
    category: body.category,
    brand: body.brand || "",
    stock: body.stock === undefined ? undefined : Number(body.stock),
    specs,
    tags: parseTags(body.tags),
    variants: parseJson(body.variants, []),
    status: body.status || (body.isActive === "false" ? "paused" : "active"),
    isFeatured: body.isFeatured === true || body.isFeatured === "true"
  };
};

const uploadedUrls = (files = []) => files.map((file) => file.path).filter(Boolean);
const uploadedPublicIds = (files = []) => files.map((file) => file.filename).filter(Boolean);

const resolveCategory = async (category) => {
  if (!category) return category;
  if (mongoose.Types.ObjectId.isValid(String(category))) return category;
  const name = String(category).trim();
  const slug = slugify(name, { lower: true, strict: true, trim: true });
  const doc = await Category.findOneAndUpdate(
    { slug },
    { $setOnInsert: { name, slug, isActive: true } },
    { new: true, upsert: true }
  );
  return doc._id;
};

const fillThirtyDays = (rows) => {
  const map = new Map(rows.map((row) => [row._id, { date: row._id, revenue: row.revenue, orders: row.orders }]));
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.now() - (29 - index) * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    return map.get(key) || { date: key, revenue: 0, orders: 0 };
  });
};

export const getSellerStats = asyncHandler(async (req, res) => {
  const sellerId = toObjectId(req.user._id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const sellerPaidMatch = [
    { $unwind: "$items" },
    { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "product" } },
    { $unwind: "$product" },
    { $match: { "product.seller": sellerId, paymentStatus: "paid" } }
  ];

  const [revenueAgg, ordersTodayAgg, totalProducts, ratingAgg, revenueRows, recentOrders, lowStockProducts] = await Promise.all([
    Order.aggregate([...sellerPaidMatch, { $group: { _id: null, total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }]),
    Order.aggregate([...sellerPaidMatch, { $match: { createdAt: { $gte: today } } }, { $group: { _id: "$_id" } }, { $count: "orders" }]),
    Product.countDocuments({ seller: sellerId, status: "active" }),
    Product.aggregate([{ $match: { seller: sellerId, status: { $ne: "deleted" } } }, { $group: { _id: null, avg: { $avg: "$averageRating" } } }]),
    Order.aggregate([
      ...sellerPaidMatch,
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $addToSet: "$_id" }
        }
      },
      { $project: { revenue: 1, orders: { $size: "$orders" } } },
      { $sort: { _id: 1 } }
    ]),
    Order.find({ "items.seller": sellerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .populate("items.product", "name images")
      .lean(),
    Product.find({ seller: sellerId, stock: { $lte: 5 }, status: "active" })
      .sort({ stock: 1 })
      .limit(10)
      .select("name images stock price")
      .lean()
  ]);

  res.json({
    totalRevenue: revenueAgg[0]?.total || 0,
    ordersToday: ordersTodayAgg[0]?.orders || 0,
    totalProducts,
    averageRating: Number((ratingAgg[0]?.avg || 0).toFixed(1)),
    revenueByDay: fillThirtyDays(revenueRows),
    recentOrders,
    lowStockProducts
  });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const sellerId = toObjectId(req.user._id);
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;
  const filter = { seller: sellerId };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: searchRegex }, { description: searchRegex }, { brand: searchRegex }];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category", "name slug").lean(),
    Product.countDocuments(filter)
  ]);

  res.json({ products, total, page, totalPages: Math.ceil(total / limit), pages: Math.ceil(total / limit) });
});

export const addProduct = asyncHandler(async (req, res) => {
  const payload = normalizeProductPayload(req.body);
  if (!payload.name || !payload.price || !payload.mrp || payload.stock === undefined || !payload.category) {
    res.status(400);
    throw new Error("name, price, mrp, stock and category are required");
  }

  const bodyImages = parseJson(req.body.images, []);
  const images = [...(Array.isArray(bodyImages) ? bodyImages : []), ...uploadedUrls(req.files || [])];
  if (!images.length) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  const product = await Product.create({
    ...payload,
    category: await resolveCategory(payload.category),
    images,
    imagePublicIds: uploadedPublicIds(req.files || []),
    seller: req.user._id
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  const payload = normalizeProductPayload(req.body);
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "category") return;
    if (value !== undefined) product[key] = value;
  });
  if (payload.category !== undefined) product.category = await resolveCategory(payload.category);

  const newImages = uploadedUrls(req.files || []);
  if (newImages.length) {
    product.images = [...product.images, ...newImages].slice(0, 5);
    product.imagePublicIds = [...(product.imagePublicIds || []), ...uploadedPublicIds(req.files || [])].slice(0, 5);
  }

  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  product.status = "deleted";
  product.isActive = false;
  await product.save();
  res.json({ message: "Product removed" });
});

export const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }
  product.status = product.status === "active" ? "paused" : "active";
  product.isActive = product.status === "active";
  await product.save();
  res.json({ status: product.status });
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = toObjectId(req.user._id);
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const skip = (page - 1) * limit;
  const filter = { "items.seller": sellerId };
  if (req.query.status) filter.orderStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name email").populate("items.product", "name images").lean(),
    Order.countDocuments(filter)
  ]);

  res.json({ orders, total, page, totalPages: Math.ceil(total / limit), pages: Math.ceil(total / limit) });
});

export const shipSellerOrder = asyncHandler(async (req, res) => {
  const { trackingId, courier, estimatedDelivery } = req.body;
  if (!trackingId || !courier) {
    res.status(400);
    throw new Error("trackingId and courier are required");
  }

  const order = await Order.findOne({ _id: req.params.id, "items.seller": req.user._id }).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = "shipped";
  order.trackingNumber = trackingId;
  order.awbNumber = trackingId;
  order.courierName = courier;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
  order.statusHistory.push({
    status: "shipped",
    note: `Shipped via ${courier} with tracking ID ${trackingId}`,
    updatedBy: req.user._id
  });

  await order.save();
  await sendOrderStatusUpdate(order.user, order, "shipped");
  res.json(order);
});
