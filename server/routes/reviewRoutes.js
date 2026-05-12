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
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.get("/eligibility/:productId", protect, authorize("buyer", "admin"), getReviewEligibility);
router.post("/", protect, authorize("buyer", "admin"), upload.array("images", 3), createReview);
router.patch("/:id", protect, authorize("buyer", "admin"), upload.array("images", 3), updateReview);
router.delete("/:id", protect, deleteReview);
router.post("/:id/respond", protect, authorize("seller", "admin"), addSellerResponse);
router.post("/:id/helpful", protect, authorize("buyer", "admin"), markReviewHelpful);

export default router;
