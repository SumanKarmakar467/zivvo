import express from "express";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getProductsByCategory
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug);

export default router;
