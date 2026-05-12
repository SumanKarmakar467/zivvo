import express from "express";
import { body, validationResult } from "express-validator";
import { protect } from "../middlewares/authMiddleware.js";
import {
  approveVerification,
  getMyVerificationStatus,
  getPendingVerifications,
  getVerificationBySellerId,
  rejectVerification,
  submitVerification
} from "../controllers/verificationController.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ message: "Validation failed", errors: errors.array() });
};

const submitValidators = [
  body("gstNumber")
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage("Invalid GST number"),
  body("panNumber").matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("Invalid PAN number"),
  body("aadhaarLast4").matches(/^\d{4}$/).withMessage("Aadhaar last 4 must be 4 digits"),
  body("gstCertUrl").isURL().withMessage("Valid GST certificate URL is required"),
  body("panCardUrl").isURL().withMessage("Valid PAN card URL is required"),
  body("bankProofUrl").isURL().withMessage("Valid bank proof URL is required")
];

router.post("/submit", protect, submitValidators, handleValidation, submitVerification);
router.get("/status", protect, getMyVerificationStatus);
router.get("/pending", protect, getPendingVerifications);
router.get("/:sellerId", protect, getVerificationBySellerId);
router.patch("/:sellerId/approve", protect, approveVerification);
router.patch(
  "/:sellerId/reject",
  protect,
  [body("rejectionNote").isString().isLength({ min: 5, max: 500 }).withMessage("Rejection reason is required")],
  handleValidation,
  rejectVerification
);

export default router;

