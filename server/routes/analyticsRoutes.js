// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  getLowStock,
  getOrderFunnel,
  getOverview,
  getRevenueChart,
  getTopProducts
} from "../controllers/analyticsController.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireRole("seller", "admin"));

router.get("/overview", getOverview);
router.get("/revenue-chart", getRevenueChart);
router.get("/top-products", getTopProducts);
router.get("/order-funnel", getOrderFunnel);
router.get("/low-stock", getLowStock);

export default router;
