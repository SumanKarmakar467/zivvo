import slugify from "slugify";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const base = Product.find({ isDeleted: false, isApproved: true });
  const features = new ApiFeatures(base, req.query).search(["name", "brand", "tags"]).filter().sort().paginate(page, limit);
  const [products, totalCount] = await Promise.all([features.query.lean(), Product.countDocuments({ isDeleted: false, isApproved: true })]);
  res.json({ products, totalCount, pages: Math.ceil(totalCount / limit) });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("seller", "name avatar").populate("category", "name slug").lean();
  if (!product) throw new AppError("Product not found", 404);
  const reviews = await Review.find({ product: req.params.id }).limit(5).populate("user", "name avatar").lean();
  res.json({ ...product, reviews });
});

export const createProduct = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const images = [];
  for (const file of files) images.push(await uploadToCloudinary(file.buffer, "shoppop/products"));
  const product = await Product.create({ ...req.body, seller: req.user._id, slug: slugify(req.body.name, { lower: true }), images });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  if (req.user.role !== "admin" && String(product.seller) !== String(req.user._id)) throw new AppError("Forbidden", 403);
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  if (req.user.role !== "admin" && String(product.seller) !== String(req.user._id)) throw new AppError("Forbidden", 403);
  product.isDeleted = true;
  await product.save();
  res.json({ message: "Product deleted" });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isApproved: true, isFeatured: true, isDeleted: false }).limit(8).lean();
  res.json(products);
});

export const getDeals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isApproved: true, isDeleted: false, discountPrice: { $gt: 0 } }).lean();
  const deals = products.filter((p) => p.discountPrice && p.price && ((p.price - p.discountPrice) / p.price) * 100 > 20)
    .sort((a, b) => ((b.price - b.discountPrice) / b.price) - ((a.price - a.discountPrice) / a.price)).slice(0, 10);
  res.json(deals);
});

export const getByCategorySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) throw new AppError("Category not found", 404);
  const products = await Product.find({ category: category._id, isDeleted: false, isApproved: true }).lean();
  res.json(products);
});

