import Product from "../models/Product.js";
import Category from "../models/Category.js";
import asyncHandler from "../middlewares/asyncHandler.js";

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

  if (query.rating) {
    filter.rating = { $gte: Number(query.rating) };
  }

  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  if (query.search) {
    const rawSearch = String(query.search).trim();
    const singularized = rawSearch
      .split(/\s+/)
      .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word))
      .join(" ");

    const primaryRegex = new RegExp(rawSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const secondaryRegex = singularized !== rawSearch
      ? new RegExp(singularized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      : null;

    filter.$or = secondaryRegex
      ? [{ name: primaryRegex }, { description: primaryRegex }, { name: secondaryRegex }, { description: secondaryRegex }]
      : [{ name: primaryRegex }, { description: primaryRegex }];
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
      .populate("seller", "name avatar")
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
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("seller", "name avatar")
    .lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const relatedProducts = await Product.find({
    isActive: true,
    category: product.category?._id,
    _id: { $ne: product._id }
  })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return res.json({ product, relatedProducts });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate("category", "name slug")
    .populate("seller", "name avatar")
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
      .populate("seller", "name avatar")
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
