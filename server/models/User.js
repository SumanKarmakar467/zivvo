import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null },
    refreshToken: { type: String, select: false, default: null },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
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
