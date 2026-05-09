import express from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { cancelOrder, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/status", protect, authorize("admin", "seller"), updateOrderStatus);

export default router;
