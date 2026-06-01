// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  createCategory,
  createCoupon,
  deleteCategory,
  deleteCoupon,
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getCategories,
  getCoupons,
  getDashboardStats,
  toggleProductActive,
  updateCategory,
  updateCoupon,
  updateOrderStatus,
  updateUser
} from "../controllers/adminController.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireRole("admin"));

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);

router.get("/products", getAllProducts);
router.put("/products/:id/toggle", toggleProductActive);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;
