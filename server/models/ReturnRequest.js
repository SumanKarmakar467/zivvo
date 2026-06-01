// Types: see models/types/ReturnRequest.ts
import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantSku: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1 },
    reason: {
      type: String,
      enum: ["defective", "wrong_item", "not_as_described", "changed_mind", "damaged_in_transit", "other"],
      required: true
    },
    description: { type: String, default: "" },
    images: { type: [String], default: [] }
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [returnItemSchema], default: [] },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "refund_initiated", "refunded", "closed"],
      default: "requested"
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    refundAmount: { type: Number, default: 0, min: 0 },
    razorpayRefundId: { type: String, default: "" },
    sellerNote: { type: String, default: "" },
    resolvedAt: { type: Date },
    returnWindow: { type: Number, default: 7 }
  },
  { timestamps: true }
);

returnRequestSchema.index({ order: 1, buyer: 1 });
returnRequestSchema.index({ seller: 1, status: 1 });

const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);

export default ReturnRequest;
