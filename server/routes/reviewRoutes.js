import express from "express";
import { createReview, deleteReview, getReviews, updateReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/:productId", protect, createReview);
router.get("/:productId", getReviews);
router.patch("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
export default router;
