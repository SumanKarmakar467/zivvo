import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { uploadToCloudinary } from "../middleware/upload.js";

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: toObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
    rating: Math.round(avg * 10) / 10,
    numReviews: count
  });
};

const findDeliveredOrder = async ({ buyerId, productId }) => {
  return Order.findOne({
    user: buyerId,
    orderStatus: "delivered",
    "items.product": productId
  }).lean();
};

const uploadReviewImages = async (files = []) => {
  const urls = [];
  for (const file of files.slice(0, 3)) {
    const uploaded = await uploadToCloudinary(file.buffer, "zivvo/reviews");
    urls.push(uploaded.url);
  }
  return urls;
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new AppError("Invalid product id", 400);

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
  const sort = req.query.sort === "most_helpful" ? "most_helpful" : "most_recent";
  const skip = (page - 1) * limit;

  const sortStage = sort === "most_helpful"
    ? { helpfulVotes: -1, createdAt: -1 }
    : { createdAt: -1 };

  const [reviews, total, breakdownRows] = await Promise.all([
    Review.find({ product: productId })
      .populate("buyer", "name avatar")
      .sort(sortStage)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ product: productId }),
    Review.aggregate([
      { $match: { product: toObjectId(productId) } },
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
    page,
    pages: Math.ceil(total / limit),
    ratingBreakdown
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const buyerId = req.user._id;
  const { product, rating, title, body, images } = req.body;

  if (!product || !rating || !body) {
    throw new AppError("Product, rating and body are required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(product)) throw new AppError("Invalid product id", 400);

  const deliveredOrder = await findDeliveredOrder({ buyerId, productId: product });
  if (!deliveredOrder) {
    throw new AppError("Only buyers with delivered orders can review this product", 403);
  }

  const uploadedImages = Array.isArray(req.files) && req.files.length
    ? await uploadReviewImages(req.files)
    : [];

  const review = await Review.create({
    product,
    buyer: buyerId,
    order: deliveredOrder._id,
    rating: Number(rating),
    title: (title || "").trim(),
    body: String(body).trim(),
    images: uploadedImages.length ? uploadedImages : (Array.isArray(images) ? images.slice(0, 3) : []),
    verifiedPurchase: true
  });

  await recalcProductRating(product);

  const populated = await Review.findById(review._id).populate("buyer", "name avatar").lean();
  return res.status(201).json(populated);
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  if (String(review.buyer) !== String(req.user._id)) {
    throw new AppError("You can only edit your own review", 403);
  }

  const { rating, title, body, images } = req.body;
  if (rating !== undefined) review.rating = Number(rating);
  if (title !== undefined) review.title = String(title).trim();
  if (body !== undefined) review.body = String(body).trim();
  const uploadedImages = Array.isArray(req.files) && req.files.length
    ? await uploadReviewImages(req.files)
    : [];
  if (uploadedImages.length) review.images = uploadedImages;
  else if (images !== undefined) review.images = Array.isArray(images) ? images.slice(0, 3) : [];
  await review.save();

  await recalcProductRating(review.product);
  const populated = await Review.findById(review._id).populate("buyer", "name avatar").lean();
  return res.json(populated);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  const isOwner = String(review.buyer) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw new AppError("Not allowed to delete this review", 403);

  const productId = review.product;
  await review.deleteOne();
  await recalcProductRating(productId);
  return res.json({ success: true });
});

export const addSellerResponse = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("product", "seller");
  if (!review) throw new AppError("Review not found", 404);

  const isOwnerSeller = String(review.product?.seller) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwnerSeller && !isAdmin) {
    throw new AppError("Only this product's seller can respond", 403);
  }

  const text = String(req.body.text || "").trim();
  if (!text) throw new AppError("Response text is required", 400);

  review.sellerResponse = { text, respondedAt: new Date() };
  await review.save();

  const populated = await Review.findById(review._id).populate("buyer", "name avatar").lean();
  return res.json(populated);
});

export const markReviewHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulVotes: 1 } },
    { new: true }
  )
    .populate("buyer", "name avatar")
    .lean();

  if (!review) throw new AppError("Review not found", 404);
  return res.json(review);
});

export const getReviewEligibility = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new AppError("Invalid product id", 400);
  if (!req.user?._id) throw new AppError("Unauthorized", 401);

  const [deliveredOrder, existingReview] = await Promise.all([
    findDeliveredOrder({ buyerId: req.user._id, productId }),
    Review.findOne({ buyer: req.user._id, product: productId }).lean()
  ]);

  return res.json({
    canReview: Boolean(deliveredOrder) && !existingReview,
    hasDeliveredOrder: Boolean(deliveredOrder),
    alreadyReviewed: Boolean(existingReview)
  });
});
