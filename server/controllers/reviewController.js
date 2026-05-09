import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { calculateShopPopScore } from "../utils/shoppopScore.js";

const recalc = async (productId) => {
  const reviews = await Review.find({ product: productId }).lean();
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const product = await Product.findById(productId);
  if (!product) return;
  product.ratings = { average: Number(avg.toFixed(2)), count: reviews.length };
  product.shoppopScore = calculateShopPopScore(product, reviews);
  await product.save();
};

export const createReview = asyncHandler(async (req, res) => {
  const purchased = await Order.findOne({ user: req.user._id, "items.product": req.params.productId, paymentStatus: "paid" }).lean();
  const review = await Review.create({ ...req.body, product: req.params.productId, user: req.user._id, isVerifiedPurchase: !!purchased });
  await recalc(req.params.productId);
  res.status(201).json(review);
});

export const getReviews = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId }).populate("user", "name avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments({ product: req.params.productId })
  ]);
  res.json({ reviews, total, pages: Math.ceil(total / limit) });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);
  if (String(review.user) !== String(req.user._id)) throw new AppError("Forbidden", 403);
  Object.assign(review, req.body);
  await review.save();
  await recalc(review.product);
  res.json(review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);
  if (String(review.user) !== String(req.user._id)) throw new AppError("Forbidden", 403);
  const productId = review.product;
  await review.deleteOne();
  await recalc(productId);
  res.json({ message: "Review deleted" });
});

