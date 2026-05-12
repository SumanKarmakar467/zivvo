import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const validateProductId = (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product id");
    error.statusCode = 400;
    throw error;
  }
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products", "name slug images price mrp averageRating reviewCount rating numReviews brand")
    .lean();

  res.json({ items: wishlist?.products || [] });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  validateProductId(productId);

  const exists = await Product.exists({ _id: productId, isActive: true });
  if (!exists) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: productId } },
    { upsert: true, new: true }
  );

  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products", "name slug images price mrp averageRating reviewCount rating numReviews brand")
    .lean();

  res.json({ items: wishlist?.products || [] });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  validateProductId(productId);

  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } },
    { new: true }
  );

  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products", "name slug images price mrp averageRating reviewCount rating numReviews brand")
    .lean();

  res.json({ items: wishlist?.products || [] });
});
