import express from "express";
import {
  getLowStock,
  getOrderFunnel,
  getOverview,
  getRevenueChart,
  getTopProducts
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/overview", getOverview);
router.get("/revenue-chart", getRevenueChart);
router.get("/top-products", getTopProducts);
router.get("/order-funnel", getOrderFunnel);
router.get("/low-stock", getLowStock);

export default router;
