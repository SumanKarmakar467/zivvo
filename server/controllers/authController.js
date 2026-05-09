import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const signAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  provider: user.provider,
  isVerified: user.isVerified
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
    return;
  }

  admin.initializeApp();
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    provider: "local",
    isVerified: true
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    accessToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash +refreshToken");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  res.status(200).json({
    success: true,
    user: sanitizeUser(user),
    accessToken
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("Refresh token missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const accessToken = signAccessToken(user._id);
  res.status(200).json({ success: true, accessToken });
});

export const googleFirebaseLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("idToken is required");
  }

  ensureFirebaseAdmin();
  const decoded = await admin.auth().verifyIdToken(idToken);

  if (!decoded.email) {
    res.status(400);
    throw new Error("Google account email not found");
  }

  let user = await User.findOne({ email: decoded.email.toLowerCase() }).select("+refreshToken");

  if (!user) {
    user = await User.create({
      name: decoded.name || decoded.email.split("@")[0],
      email: decoded.email.toLowerCase(),
      avatar: decoded.picture || "",
      provider: "google",
      googleId: decoded.uid,
      isVerified: true
    });
  }

  const accessToken = signAccessToken(user._id);
  const refresh = signRefreshToken(user._id);

  user.refreshToken = refresh;
  await user.save();

  res.cookie("refreshToken", refresh, getCookieOptions());

  res.status(200).json({
    success: true,
    user: sanitizeUser(user),
    accessToken
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (error) {
      // Ignore invalid/expired refresh token during logout.
    }
  }

  res.clearCookie("refreshToken", getCookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
