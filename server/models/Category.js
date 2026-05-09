import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function preValidate(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
