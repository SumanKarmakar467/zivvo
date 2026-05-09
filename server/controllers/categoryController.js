import Category from "../models/Category.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  res.json(categories);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const subcategories = await Category.find({ parent: category._id, isActive: true })
    .sort({ name: 1 })
    .lean();

  res.json({ ...category, subcategories });
});
