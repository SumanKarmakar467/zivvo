// Types: see models/types/Review.ts
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120 },
    body: { type: String, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    verifiedPurchase: { type: Boolean, default: true },
    sellerResponse: {
      text: { type: String, default: "" },
      respondedAt: { type: Date }
    },
    helpfulVotes: { type: Number, default: 0 },
    reported: { type: Boolean, default: false }
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
