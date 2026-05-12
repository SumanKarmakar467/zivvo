import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["flat", "percent"], required: true },
    value: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: null, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    scope: { type: String, enum: ["platform", "seller"], default: "seller" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    usageLimit: { type: Number, default: null, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    applicableCategories: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
