import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    avatar: { type: String, default: null },
    phone: { type: String, default: "" },
    addresses: { type: [addressSchema], default: [] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    googleId: { type: String, default: null },
    refreshTokens: { type: [String], select: false, default: [] },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    refreshToken: { type: String, select: false, default: null },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, select: false, default: null },
    resetPasswordExpiry: { type: Date, select: false, default: null }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function matchPassword(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const User = mongoose.model("User", userSchema);

export default User;
