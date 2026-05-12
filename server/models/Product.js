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
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    specs: { type: Map, of: String, default: {} },
    tags: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    hasVariants: { type: Boolean, default: false },
    attributeOptions: { type: Map, of: [String], default: {} },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.index(
  { name: "text", description: "text", brand: "text", tags: "text" },
  { weights: { name: 10, brand: 5, description: 2, tags: 1 } }
);
productSchema.index({ _id: 1, "variants.sku": 1 }, { unique: true, sparse: true });

productSchema.pre("validate", function preValidate(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }

  if (this.mrp && this.mrp > 0 && this.price >= 0 && this.mrp >= this.price) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  } else {
    this.discount = 0;
  }

  next();
});

productSchema.virtual("totalStock").get(function getTotalStock() {
  if (!this.hasVariants) return Number(this.stock || 0);
  return (this.variants || []).reduce((sum, variant) => sum + (variant.isActive ? Number(variant.stock || 0) : 0), 0);
});

const Product = mongoose.model("Product", productSchema);

export default Product;
