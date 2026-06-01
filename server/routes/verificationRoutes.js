// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import { body, validationResult } from "express-validator";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
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

router.post("/submit", verifyFirebaseToken, submitValidators, handleValidation, submitVerification);
router.get("/status", verifyFirebaseToken, getMyVerificationStatus);
router.get("/pending", verifyFirebaseToken, getPendingVerifications);
router.get("/:sellerId", verifyFirebaseToken, getVerificationBySellerId);
router.patch("/:sellerId/approve", verifyFirebaseToken, approveVerification);
router.patch(
  "/:sellerId/reject",
  verifyFirebaseToken,
  [body("rejectionNote").isString().isLength({ min: 5, max: 500 }).withMessage("Rejection reason is required")],
  handleValidation,
  rejectVerification
);

export default router;
