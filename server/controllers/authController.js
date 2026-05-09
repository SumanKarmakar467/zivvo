import crypto from "crypto";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailService.js";

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar
});

const ensureFirebaseAdmin = () => {
  if (admin.apps.length) return;

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      })
    });
  } else {
    admin.initializeApp();
  }
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || String(name).trim().length < 2) {
    res.status(400);
    throw new Error("Name must be at least 2 characters");
  }

  if (!email || !isValidEmail(String(email).toLowerCase())) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (!password || !isStrongPassword(String(password))) {
    res.status(400);
    throw new Error("Password must be at least 8 characters with 1 uppercase and 1 number");
  }

  const lowerEmail = String(email).toLowerCase();
  const exists = await User.findOne({ email: lowerEmail }).lean();
  if (exists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name: String(name).trim(),
    email: lowerEmail,
    passwordHash,
    provider: "local",
    isVerified: true
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());
  await sendWelcomeEmail(user);

  res.status(201).json({ user: sanitizeUser(user), accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash +refreshTokens");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is deactivated");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());
  res.json({ user: sanitizeUser(user), accessToken });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("idToken is required");
  }

  ensureFirebaseAdmin();
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { email, name, picture, uid } = decoded;

  if (!email) {
    res.status(400);
    throw new Error("Google account email not found");
  }

  let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { googleId: uid }] }).select("+refreshTokens");

  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      avatar: picture || "",
      googleId: uid,
      provider: "google",
      isVerified: true
    });
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is deactivated");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());
  res.json({ user: sanitizeUser(user), accessToken });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("Refresh token missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select("+refreshTokens");

  if (!user || !(user.refreshTokens || []).includes(token)) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const newRefreshToken = signRefreshToken(user._id);
  user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  user.refreshTokens = user.refreshTokens.slice(-5);
  await user.save();

  const accessToken = signAccessToken(user);
  res.cookie("refreshToken", newRefreshToken, getCookieOptions());
  res.json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id).select("+refreshTokens");
      if (user) {
        user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== token);
        await user.save();
      }
    } catch (error) {
      // token invalid/expired: ignore cleanup
    }
  }

  res.clearCookie("refreshToken", getCookieOptions());
  res.json({ message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (email) {
    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+resetPasswordToken +resetPasswordExpiry");
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      await sendPasswordResetEmail(user, resetToken);
    }
  }

  res.json({ message: "Reset email sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400);
    throw new Error("token and newPassword are required");
  }

  if (!isStrongPassword(String(newPassword))) {
    res.status(400);
    throw new Error("Password must be at least 8 characters with 1 uppercase and 1 number");
  }

  const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() }
  }).select("+resetPasswordToken +resetPasswordExpiry +passwordHash");

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.passwordHash = await User.hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});
