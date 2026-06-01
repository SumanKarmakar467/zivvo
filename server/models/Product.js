// Types: see models/types/Product.ts
import mongoose from "mongoose";
import slugify from "slugify";

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true, uppercase: true },
    attributes: { type: Map, of: String, default: {} },
    stock: { type: Number, required: true, min: 0 },
    priceDelta: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    discount: { type: Number, default: 0 },
    images: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one image is required"
      },
      required: true
    },
    imagePublicIds: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    weight: { type: Number, default: 500, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    reviewCount: { type: Number, default: 0, min: 0 },
    reviews: {
      type: [
        {
          userId: { type: String, required: true },
          userName: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String, maxlength: 500 },
          createdAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    specs: { type: Map, of: String, default: {} },
    tags: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    hasVariants: { type: Boolean, default: false },
    attributeOptions: { type: Map, of: [String], default: {} },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "paused", "deleted"], default: "active", index: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.index({ name: "text", description: "text", category: "text", brand: "text" });
productSchema.index({ _id: 1, "variants.sku": 1 }, { unique: true, sparse: true });

productSchema.methods.recalculateRating = function recalculateRating() {
  if (!this.reviews.length) {
    this.averageRating = 0;
    this.totalReviews = 0;
    this.reviewCount = 0;
    this.rating = 0;
    this.numReviews = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);
  const average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.averageRating = average;
  this.totalReviews = this.reviews.length;
  this.reviewCount = this.reviews.length;
  this.rating = average;
  this.numReviews = this.reviews.length;
};

productSchema.pre("validate", function preValidate(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }

  if (this.mrp && this.mrp > 0 && this.price >= 0 && this.mrp >= this.price) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discount = 0;
  }

  this.isActive = this.status === "active";

  next();
});

productSchema.virtual("totalStock").get(function getTotalStock() {
  if (!this.hasVariants) return Number(this.stock || 0);
  return (this.variants || []).reduce((sum, variant) => sum + (variant.isActive ? Number(variant.stock || 0) : 0), 0);
});

const Product = mongoose.model("Product", productSchema);

export default Product;
