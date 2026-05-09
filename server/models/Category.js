import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    icon: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    image: { url: String, public_id: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
