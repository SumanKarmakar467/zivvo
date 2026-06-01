// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { body, validationResult } from "express-validator";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import {
  approveReturn,
  closeReturn,
  createReturnRequest,
  getBuyerReturns,
  getReturnById,
  getSellerReturns,
  rejectReturn
} from "../controllers/returnController.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ message: "Validation failed", errors: errors.array() });
};

router.use(verifyFirebaseToken);
router.post(
  "/",
  [
    body("orderId").isString().notEmpty(),
    body("items").isArray({ min: 1 }),
    body("items.*.product").isString().notEmpty(),
    body("items.*.qty").isInt({ min: 1 }),
    body("items.*.reason").isIn(["defective", "wrong_item", "not_as_described", "changed_mind", "damaged_in_transit", "other"])
  ],
  handleValidation,
  createReturnRequest
);
router.get("/buyer", getBuyerReturns);
router.get("/seller", getSellerReturns);
router.get("/:id", getReturnById);
router.patch("/:id/approve", approveReturn);
router.patch("/:id/reject", [body("reason").isString().notEmpty()], handleValidation, rejectReturn);
router.patch("/:id/close", closeReturn);

export default router;
