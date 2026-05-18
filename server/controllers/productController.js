import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";

const getSortOption = (sort) => {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "newest":
      return { createdAt: -1 };
    case "rating":
      return { rating: -1 };
    case "popular":
      return { sold: -1 };
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTerms = (value) => {
  const rawSearch = String(value || "").trim();
  if (!rawSearch) return [];

  const singularized = rawSearch
    .split(/\s+/)
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word))
    .join(" ");

  const terms = new Set([rawSearch]);
  if (singularized !== rawSearch) terms.add(singularized);

  const normalized = rawSearch.toLowerCase();
  const footwearTerms = ["shoe", "shoes", "sneaker", "sneakers", "footwear", "sandals", "boots"];
  if (footwearTerms.some((term) => normalized.includes(term))) {
    ["fashion", "shirt", "jeans", "apparel"].forEach((term) => terms.add(term));
  }

  return Array.from(terms);
};

const buildSearchConditions = (value) => {
  return getSearchTerms(value).flatMap((term) => {
    const regex = new RegExp(escapeRegex(term), "i");
    return [{ name: regex }, { description: regex }, { brand: regex }, { tags: regex }];
  });
};

const buildCommonFilters = async (query, forceCategoryId) => {
  const filter = { isActive: true };

  if (forceCategoryId) {
    filter.category = forceCategoryId;
  } else if (query.category) {
    const categoryDoc = await Category.findOne({ slug: query.category, isActive: true }).lean();
    if (!categoryDoc) {
      return { filter, categoryMissing: true };
    }
    filter.category = categoryDoc._id;
  }

  if (query.brand) {
    const brandValues = Array.isArray(query.brand)
      ? query.brand
      : String(query.brand)
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean);

    if (brandValues.length) {
      filter.brand = { $in: brandValues };
    }
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  const minRating = query.minRating || query.rating;
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.search) {
    filter.$or = buildSearchConditions(query.search);
  }

  return { filter, categoryMissing: false };
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 20), 1);
  const skip = (page - 1) * limit;

  const { filter, categoryMissing } = await buildCommonFilters(req.query);

  if (categoryMissing) {
    return res.json({ products: [], page, pages: 0, total: 0, brands: [] });
  }

  const [products, total, brands] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name avatar isVerified trustScore")
      .sort(getSortOption(req.query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
    Product.distinct("brand", { isActive: true, brand: { $nin: ["", null] } })
  ]);

  return res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
    brands: brands.filter(Boolean)
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const identifier = String(req.params.slug || req.params.id || "").trim();
  const productQuery = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier, isActive: true }
    : { slug: identifier, isActive: true };

  const product = await Product.findOne(productQuery)
    .populate("category", "name slug")
    .populate("seller", "name avatar isVerified trustScore rating totalSales")
    .lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ product: product._id })
      .populate("buyer", "name avatar")
      .sort({ helpfulVotes: -1, createdAt: -1 })
      .limit(5)
      .lean(),
    Product.find({
      isActive: true,
      category: product.category?._id,
      _id: { $ne: product._id }
    })
      .populate("category", "name slug")
      .populate("seller", "name avatar isVerified trustScore")
      .sort({ sold: -1, createdAt: -1 })
      .limit(10)
      .lean()
  ]);

  return res.json({ product: { ...product, reviews }, relatedProducts });
});

export const getSimilarProducts = asyncHandler(async (req, res) => {
  const identifier = String(req.params.id || "").trim();
  const productQuery = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier, isActive: true }
    : { slug: identifier, isActive: true };

  const product = await Product.findOne(productQuery).select("_id category price").lean();
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const price = Number(product.price || 0);
  const minPrice = Math.max(0, Math.floor(price * 0.7));
  const maxPrice = Math.ceil(price * 1.3);

  const products = await Product.find({
    isActive: true,
    category: product.category,
    _id: { $ne: product._id },
    price: { $gte: minPrice, $lte: maxPrice }
  })
    .populate("category", "name slug")
    .populate("seller", "name avatar isVerified trustScore")
    .sort({ sold: -1, averageRating: -1, createdAt: -1 })
    .limit(10)
    .lean();

  return res.json({ products });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate("category", "name slug")
    .populate("seller", "name avatar isVerified trustScore")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return res.json(products);
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.max(Number(req.query.limit || 20), 1);
  const skip = (page - 1) * limit;

  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { filter } = await buildCommonFilters(req.query, category._id);

  const [products, total, brands] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name avatar isVerified trustScore")
      .sort(getSortOption(req.query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
    Product.distinct("brand", { ...filter, brand: { $nin: ["", null] } })
  ]);

  return res.json({
    category,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
    brands: brands.filter(Boolean)
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  const brand = String(req.query.brand || "").trim();
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const minRating = req.query.minRating;
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);

  const filter = { isActive: true };
  if (q) filter.$or = buildSearchConditions(q);
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category, isActive: true }).lean();
    if (!categoryDoc) {
      return res.json({ products: [], total: 0, page, pages: 0 });
    }
    filter.category = categoryDoc._id;
  }
  if (brand) filter.brand = new RegExp(brand, "i");
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (minRating) filter.rating = { $gte: Number(minRating) };

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { sold: -1 }
  };

  const sort = sortMap[req.query.sort] || sortMap.newest;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("seller", "name")
      .populate("seller", "name isVerified trustScore")
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(filter)
  ]);

  return res.json({ products, total, page, pages: Math.ceil(total / limit) });
});

export const getProductFacets = asyncHandler(async (_req, res) => {
  const [categoryIds, brands] = await Promise.all([
    Product.distinct("category", { isActive: true }),
    Product.distinct("brand", { isActive: true })
  ]);

  const categoryDocs = await Category.find({ _id: { $in: categoryIds }, isActive: true })
    .select("name slug")
    .sort({ name: 1 })
    .lean();

  return res.json({
    categories: categoryDocs.map((cat) => ({ name: cat.name, slug: cat.slug })),
    brands: brands.filter((b) => typeof b === "string" && b.trim()).sort((a, b) => a.localeCompare(b))
  });
});

export const getProductRecommendations = asyncHandler(async (req, res) => {
  const productId = String(req.query.productId || "").trim();
  const category = String(req.query.category || "").trim();
  const sellerId = String(req.query.sellerId || "").trim();
  const limit = Math.min(Math.max(Number(req.query.limit || 8), 1), 20);

  const [sameCat, sameSeller, topRated] = await Promise.all([
    category
      ? Product.find({ category, _id: { $ne: productId }, isActive: true })
          .sort({ sold: -1 })
          .limit(limit)
          .select("name slug price images averageRating reviewCount seller category sold")
          .populate("category", "name slug")
          .populate("seller", "name avatar")
          .lean()
      : Promise.resolve([]),
    sellerId
      ? Product.find({ seller: sellerId, _id: { $ne: productId }, isActive: true })
          .sort({ sold: -1 })
          .limit(4)
          .select("name slug price images averageRating reviewCount seller category sold")
          .populate("category", "name slug")
          .populate("seller", "name avatar")
          .lean()
      : Promise.resolve([]),
    Product.find({ _id: { $ne: productId }, isActive: true, averageRating: { $gte: 4 } })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(4)
      .select("name slug price images averageRating reviewCount seller category sold")
      .populate("category", "name slug")
      .populate("seller", "name avatar")
      .lean()
  ]);

  const merged = [...sameCat, ...sameSeller, ...topRated];
  const seen = new Set();
  const deduped = [];

  for (const product of merged) {
    const id = String(product._id);
    if (seen.has(id)) continue;
    seen.add(id);
    deduped.push(product);
    if (deduped.length >= limit) break;
  }

  return res.json({ products: deduped });
});

export const getRecentlyViewedProducts = asyncHandler(async (req, res) => {
  const ids = String(req.query.ids || "").trim();
  if (!ids) return res.json([]);

  const idList = ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 10);

  if (!idList.length) return res.json([]);

  const products = await Product.find({ _id: { $in: idList }, isActive: true })
    .select("name slug price images averageRating reviewCount seller category")
    .populate("category", "name slug")
    .populate("seller", "name avatar")
    .lean();

  const byId = new Map(products.map((product) => [String(product._id), product]));
  const ordered = idList.map((id) => byId.get(id)).filter(Boolean);

  return res.json(ordered);
});
