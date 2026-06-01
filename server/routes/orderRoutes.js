// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { body, validationResult } from "express-validator";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";
import { cancelOrder, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", verifyFirebaseToken, createRazorpayOrder);
router.post("/verify", verifyFirebaseToken, verifyPayment);
router.get("/", verifyFirebaseToken, getMyOrders);
router.get("/my", verifyFirebaseToken, getMyOrders);
router.get("/:id/track", verifyFirebaseToken, getOrderById);
router.get("/:id", verifyFirebaseToken, getOrderById);
router.put("/:id/cancel", verifyFirebaseToken, cancelOrder);

const statusValidator = [
  body("status")
    .isIn(["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"])
    .withMessage("Invalid status"),
  body("note").optional().isString().isLength({ max: 300 }).withMessage("Note must be up to 300 chars"),
  body("awbNumber").optional().isString().isLength({ max: 100 }).withMessage("AWB must be up to 100 chars"),
  body("courierName").optional().isString().isLength({ max: 120 }).withMessage("Courier name must be up to 120 chars"),
  body("estimatedDelivery").optional().isISO8601().withMessage("estimatedDelivery must be a valid date")
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ message: "Validation failed", errors: errors.array() });
};

router.patch("/:id/status", verifyFirebaseToken, requireRole("admin", "seller"), statusValidator, handleValidation, updateOrderStatus);
router.put("/:id/status", verifyFirebaseToken, requireRole("admin", "seller"), statusValidator, handleValidation, updateOrderStatus);

export default router;
