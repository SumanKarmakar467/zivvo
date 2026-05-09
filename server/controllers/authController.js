import crypto from "crypto";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const buildAuthResponse = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });

export const registerValidation = [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })];

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array()[0].msg, 400);
  const exists = await User.findOne({ email: req.body.email }).lean();
  if (exists) throw new AppError("Email already registered", 400);

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const user = await User.create({ ...req.body, otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000), role: req.body.role === "seller" ? "seller" : "user" });
  await sendEmail({ to: user.email, subject: "Verify your ShopPop account", html: `<h3>Your OTP is ${otp}</h3>` });

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user: buildAuthResponse(user), accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  setRefreshCookie(res, refreshToken);
  res.json({ user: buildAuthResponse(user), accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("Refresh token missing", 401);
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).lean();
  if (!user || user.refreshToken !== token) throw new AppError("Invalid refresh token", 401);
  const accessToken = generateAccessToken({ id: user._id });
  res.json({ accessToken });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) throw new AppError("Invalid OTP", 400);
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: "Account verified" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError("User not found", 404);
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendEmail({ to: user.email, subject: "ShopPop reset OTP", html: `<p>Your OTP is ${otp}</p>` });
  res.json({ message: "OTP sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) throw new AppError("Invalid OTP", 400);
  user.password = password;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: "Password updated" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").lean();
  res.json(user);
});

