import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const router = express.Router();

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getSortStage = (sort, hasQuery) => {
  if (hasQuery && (!sort || sort === "relevance")) return { score: { $meta: "textScore" }, sold: -1 };

  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "newest":
      return { createdAt: -1 };
    case "rating":
      return { averageRating: -1, rating: -1, reviewCount: -1 };
    case "popular":
      return { sold: -1, reviewCount: -1 };
    default:
      return hasQuery ? { score: { $meta: "textScore" }, sold: -1 } : { isFeatured: -1, sold: -1, createdAt: -1 };
  }
};

const buildSearchMatch = async (query) => {
  const q = String(query.q || "").trim();
  const match = { isActive: true };

  if (q) {
    match.$text = { $search: q };
  }

  const categories = parseList(query.category);
  if (categories.length) {
    const categoryDocs = await Category.find({
      isActive: true,
      $or: [{ slug: { $in: categories } }, { name: { $in: categories.map((name) => new RegExp(`^${escapeRegex(name)}$`, "i")) } }]
    })
      .select("_id")
      .lean();

    if (!categoryDocs.length) return { match, categoryMissing: true };
    match.category = { $in: categoryDocs.map((category) => category._id) };
  }

  const brands = parseList(query.brand);
  if (brands.length) {
    match.brand = { $in: brands.map((brand) => new RegExp(`^${escapeRegex(brand)}$`, "i")) };
  }

  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    match.price = {};
    if (!Number.isNaN(minPrice)) match.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) match.price.$lte = maxPrice;
  }

  const rating = Number(query.rating || query.minRating);
  if (!Number.isNaN(rating) && rating > 0) {
    match.$or = [
      ...(match.$or || []),
      { averageRating: { $gte: rating } },
      { rating: { $gte: rating } }
    ];
  }

  const discount = Number(query.discount);
  if (!Number.isNaN(discount) && discount > 0) {
    match.discount = { $gte: discount };
  }

  if (query.inStock === "true") {
    match.stock = { $gt: 0 };
  }

  return { match, categoryMissing: false };
};

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 48);
    const skip = (page - 1) * limit;
    const q = String(req.query.q || "").trim();
    const { match, categoryMissing } = await buildSearchMatch(req.query);

    if (categoryMissing) {
      return res.json({
        products: [],
        total: 0,
        page,
        totalPages: 0,
        filters: { brands: [], categories: [], priceRange: { min: 0, max: 0 } }
      });
    }

    const sortStage = getSortStage(req.query.sort, Boolean(q));

    const [result] = await Product.aggregate([
      { $match: match },
      {
        $facet: {
          products: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                name: 1,
                slug: 1,
                description: 1,
                price: 1,
                mrp: 1,
                discount: 1,
                images: 1,
                brand: 1,
                stock: 1,
                sold: 1,
                rating: 1,
                averageRating: 1,
                reviewCount: 1,
                numReviews: 1,
                isFeatured: 1,
                createdAt: 1,
                category: { _id: "$category._id", name: "$category.name", slug: "$category.slug" }
              }
            }
          ],
          total: [{ $count: "count" }],
          brands: [{ $match: { brand: { $nin: ["", null] } } }, { $group: { _id: "$brand", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }],
          priceRange: [{ $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }],
          categoryIds: [{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]
        }
      }
    ]);

    const categoryIds = (result?.categoryIds || []).map((item) => item._id).filter(Boolean);
    const categoryDocs = categoryIds.length
      ? await Category.find({ _id: { $in: categoryIds }, isActive: true }).select("name slug parent").lean()
      : [];
    const categoryCount = new Map((result?.categoryIds || []).map((item) => [String(item._id), item.count]));
    const categories = categoryDocs
      .map((category) => ({ ...category, count: categoryCount.get(String(category._id)) || 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const total = result?.total?.[0]?.count || 0;
    const range = result?.priceRange?.[0] || { min: 0, max: 0 };

    return res.json({
      products: result?.products || [],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      filters: {
        brands: (result?.brands || []).map((brand) => ({ name: brand._id, count: brand.count })),
        categories,
        priceRange: { min: range.min || 0, max: range.max || 0 }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/suggest", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ products: [], categories: [] });

    const regex = new RegExp(escapeRegex(q), "i");
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true, $or: [{ name: regex }, { brand: regex }, { tags: regex }] })
        .select("name slug price images brand")
        .sort({ sold: -1, createdAt: -1 })
        .limit(8)
        .lean(),
      Category.find({ isActive: true, name: regex }).select("name slug icon").limit(3).lean()
    ]);

    return res.json({ products, categories });
  } catch (error) {
    next(error);
  }
});

export default router;
