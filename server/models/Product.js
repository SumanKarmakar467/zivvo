import mongoose from "mongoose";
import slugify from "slugify";

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
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index(
  { name: "text", description: "text", brand: "text", tags: "text" },
  { weights: { name: 10, brand: 5, description: 2, tags: 1 } }
);

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

const Product = mongoose.model("Product", productSchema);

export default Product;
