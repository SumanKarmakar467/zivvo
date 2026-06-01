import express from "express";
import {
  getFeaturedProducts,
  getProductBySlug,
  getSimilarProducts,
  getProductRecommendations,
  getProductFacets,
  getProductReviews,
  addProductReview,
  getProducts,
  getRecentlyViewedProducts,
  getProductsByCategory,
  searchProducts
} from "../controllers/productController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/facets", getProductFacets);
router.get("/recommendations", getProductRecommendations);
router.get("/recently-viewed", getRecentlyViewedProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", verifyFirebaseToken, addProductReview);
router.get("/:slug", getProductBySlug);

export default router;
