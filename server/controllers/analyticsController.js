import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const pctChange = (current, previous) => {
  if (!previous) return current ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const toSeries = (labels, map, key) => labels.map((label) => map.get(label)?.[key] || 0);

const buildDailyLabels = (days) => {
  const today = new Date();
  const labels = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today.getTime() - i * MS_PER_DAY);
    labels.push(date.toISOString().slice(0, 10));
  }
  return labels;
};

const buildMonthlyLabels = (months) => {
  const now = new Date();
  const labels = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return labels;
};

export const getOverview = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(String(req.user._id));
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * MS_PER_DAY);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * MS_PER_DAY);

  const matchBase = { orderStatus: { $ne: "cancelled" } };

  const aggregateWindow = (dateMatch) =>
    Order.aggregate([
      { $match: { ...matchBase, createdAt: dateMatch } },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      {
        $group: {
          _id: "$_id",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$revenue" },
          orders: { $sum: 1 }
        }
      }
    ]);

  const [currentRows, previousRows, pendingOrderRows] = await Promise.all([
    aggregateWindow({ $gte: thirtyDaysAgo }),
    aggregateWindow({ $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }),
    Order.aggregate([
      { $match: { orderStatus: { $in: ["placed", "confirmed", "processing", "shipped", "out_for_delivery"] } } },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      { $group: { _id: "$_id" } },
      { $count: "count" }
    ])
  ]);

  const current = currentRows[0] || { revenue: 0, orders: 0 };
  const previous = previousRows[0] || { revenue: 0, orders: 0 };
  const currentAov = current.orders ? current.revenue / current.orders : 0;
  const previousAov = previous.orders ? previous.revenue / previous.orders : 0;

  res.json({
    revenue: { current: current.revenue, previous: previous.revenue, deltaPct: pctChange(current.revenue, previous.revenue) },
    orders: { current: current.orders, previous: previous.orders, deltaPct: pctChange(current.orders, previous.orders) },
    avgOrderValue: {
      current: Math.round(currentAov),
      previous: Math.round(previousAov),
      deltaPct: pctChange(currentAov, previousAov)
    },
    pendingOrders: pendingOrderRows[0]?.count || 0
  });
});

export const getRevenueChart = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(String(req.user._id));
  const period = ["7d", "30d", "90d", "12m"].includes(req.query.period) ? req.query.period : "30d";
  const now = new Date();

  const isMonthly = period === "12m";
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const fromDate = isMonthly ? new Date(now.getFullYear(), now.getMonth() - 11, 1) : new Date(now.getTime() - (days - 1) * MS_PER_DAY);

  const format = isMonthly ? "%Y-%m" : "%Y-%m-%d";
  const labels = isMonthly ? buildMonthlyLabels(12) : buildDailyLabels(days);

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: fromDate }, orderStatus: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    { $match: { "items.seller": sellerId } },
    {
      $group: {
        _id: {
          period: { $dateToString: { format, date: "$createdAt" } },
          orderId: "$_id"
        },
        orderRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    {
      $group: {
        _id: "$_id.period",
        revenue: { $sum: "$orderRevenue" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const map = new Map(rows.map((row) => [row._id, { revenue: row.revenue, orders: row.orders }]));
  res.json({
    labels,
    revenue: toSeries(labels, map, "revenue"),
    orders: toSeries(labels, map, "orders")
  });
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(String(req.user._id));
  const by = req.query.by === "units" ? "units" : "revenue";
  const limit = Math.min(Math.max(Number(req.query.limit || 5), 1), 10);

  const rows = await Order.aggregate([
    { $match: { orderStatus: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    { $match: { "items.seller": sellerId } },
    {
      $group: {
        _id: "$items.product",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        units: { $sum: "$items.quantity" }
      }
    },
    { $sort: { [by]: -1 } },
    { $limit: limit },
    { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productId: "$product._id",
        name: "$product.name",
        image: { $arrayElemAt: ["$product.images", 0] },
        revenue: 1,
        units: 1
      }
    }
  ]);

  res.json(rows);
});

export const getOrderFunnel = asyncHandler(async (req, res) => {
  const sellerId = new mongoose.Types.ObjectId(String(req.user._id));
  const rows = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.seller": sellerId } },
    { $group: { _id: { status: "$orderStatus", orderId: "$_id" } } },
    { $group: { _id: "$_id.status", count: { $sum: 1 } } }
  ]);
  res.json(rows.map((row) => ({ status: row._id, count: row.count })));
});

export const getLowStock = asyncHandler(async (req, res) => {
  const threshold = Math.max(Number(req.query.threshold || 5), 0);
  const products = await Product.find({
    seller: req.user._id,
    stock: { $lte: threshold },
    isActive: true
  })
    .select("name stock images price")
    .sort({ stock: 1 })
    .lean();

  res.json(products);
});

