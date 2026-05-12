import express from "express";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProductRecommendations,
  getProductFacets,
  getProducts,
  getRecentlyViewedProducts,
  getProductsByCategory,
  searchProducts
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/facets", getProductFacets);
router.get("/recommendations", getProductRecommendations);
router.get("/recently-viewed", getRecentlyViewedProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug);

export default router;
