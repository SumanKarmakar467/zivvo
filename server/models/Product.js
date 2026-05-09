import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
