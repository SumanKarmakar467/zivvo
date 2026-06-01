// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  addSellerResponse,
  createReview,
  deleteReview,
  getProductReviews,
  getReviewEligibility,
  markReviewHelpful,
  updateReview
} from "../controllers/reviewController.js";
import { verifyFirebaseToken, requireRole } from "../middleware/verifyFirebaseToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.get("/eligibility/:productId", verifyFirebaseToken, requireRole("buyer", "admin"), getReviewEligibility);
router.post("/", verifyFirebaseToken, requireRole("buyer", "admin"), upload.array("images", 3), createReview);
router.patch("/:id", verifyFirebaseToken, requireRole("buyer", "admin"), upload.array("images", 3), updateReview);
router.delete("/:id", verifyFirebaseToken, deleteReview);
router.post("/:id/respond", verifyFirebaseToken, requireRole("seller", "admin"), addSellerResponse);
router.post("/:id/helpful", verifyFirebaseToken, requireRole("buyer", "admin"), markReviewHelpful);

export default router;
