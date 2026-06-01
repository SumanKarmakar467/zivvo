// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  addProduct,
  deleteProduct,
  getSellerOrders,
  getSellerProducts,
  getSellerStats,
  shipSellerOrder,
  toggleProductStatus,
  updateProduct
} from "../controllers/sellerController.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";
import { uploadProductImage } from "../middleware/upload.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireRole("seller", "admin"));

router.get("/dashboard", getSellerStats);
router.get("/stats", getSellerStats);
router.get("/products", getSellerProducts);
router.post("/products", uploadProductImage.array("images", 5), addProduct);
router.put("/products/:id", uploadProductImage.array("images", 5), updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id/toggle", toggleProductStatus);
router.get("/orders", getSellerOrders);
router.patch("/orders/:id/ship", shipSellerOrder);

export default router;
