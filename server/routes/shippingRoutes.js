import express from "express";
import { body, validationResult } from "express-validator";
import { estimateShippingCost } from "../controllers/shippingController.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ message: "Validation failed", errors: errors.array() });
};

router.post(
  "/estimate",
  [
    body("sellerPincode").matches(/^\d{6}$/),
    body("buyerPincode").matches(/^\d{6}$/),
    body("items").isArray({ min: 1 }),
    body("items.*.productId").isString().notEmpty(),
    body("items.*.qty").isInt({ min: 1 })
  ],
  handleValidation,
  estimateShippingCost
);

export default router;

