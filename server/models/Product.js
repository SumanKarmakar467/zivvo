import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    brand: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ url: String, public_id: String }],
    price: { type: Number, required: true },
    discountPrice: Number,
    stock: { type: Number, default: 0 },
    variants: [{ type: String, value: String, stock: Number, priceModifier: Number }],
    specifications: [{ key: String, value: String }],
    ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    shoppopScore: { type: Number, min: 0, max: 100, default: 0 },
    isShopPopAssured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    sold: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("discountPercent").get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

export default mongoose.model("Product", productSchema);

