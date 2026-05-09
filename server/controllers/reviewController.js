import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const recalculateProductReviewStats = async (productId) => {
  const reviews = await Review.find({ product: productId }, { rating: 1 }).lean();
  const avgRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  const product = await Product.findById(productId);
  if (!product) {
    return;
  }

  product.rating = Number(avgRating.toFixed(2));
  product.numReviews = reviews.length;
  await product.save();
};

export const getReviews = asyncHandler(async (req, res) => {
  const productId = req.query.product;
  if (!productId) {
    throw new AppError("Product id is required", 400);
  }

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 10), 1);
  const sort = req.query.sort || "recent";
  const skip = (page - 1) * limit;

  const sortOptions = {
    recent: { createdAt: -1 },
    rating_high: { rating: -1 },
    helpful: { helpfulCount: -1, createdAt: -1 }
  };

  const sortStage = sortOptions[sort] || sortOptions.recent;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product id", 400);
  }
  const objectProductId = new mongoose.Types.ObjectId(productId);

  const [reviews, total, breakdownRows] = await Promise.all([
    Review.aggregate([
      { $match: { product: objectProductId } },
      { $addFields: { helpfulCount: { $size: { $ifNull: ["$helpful", []] } } } },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { name: 1, avatar: 1 } }]
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
    ]),
    Review.countDocuments({ product: productId }),
    Review.aggregate([
      { $match: { product: objectProductId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } }
    ])
  ]);

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  breakdownRows.forEach((row) => {
    ratingBreakdown[row._id] = row.count;
  });

  return res.json({
    reviews,
    total,
    pages: Math.ceil(total / limit),
    ratingBreakdown
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, title, body, images } = req.body;

  if (!product || !rating || !title || !body) {
    throw new AppError("Product, rating, title and body are required", 400);
  }

  const existingReview = await Review.findOne({ product, user: req.user._id }).lean();
  if (existingReview) {
    throw new AppError("You have already reviewed this product", 409);
  }

  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    orderStatus: "delivered",
    "items.product": product
  }).lean();

  const review = await Review.create({
    product,
    user: req.user._id,
    rating,
    title,
    body,
    images: Array.isArray(images) ? images : [],
    verified: Boolean(deliveredOrder)
  });

  await recalculateProductReviewStats(product);

  const populatedReview = await Review.findById(review._id).populate("user", "name avatar").lean();
  return res.status(201).json(populatedReview);
});
