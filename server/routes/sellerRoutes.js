import express from "express";
import {
  addProduct,
  deleteProduct,
  getSellerOrders,
  getSellerProducts,
  getSellerStats,
  updateProduct
} from "../controllers/sellerController.js";
import { protect, isSeller } from "../middlewares/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect, isSeller);

router.get("/stats", getSellerStats);
router.get("/products", getSellerProducts);
router.post("/products", upload.array("images", 8), addProduct);
router.put("/products/:id", upload.array("images", 8), updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getSellerOrders);

export default router;
