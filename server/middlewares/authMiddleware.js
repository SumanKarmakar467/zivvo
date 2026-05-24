import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;

  if ((!authHeader || !authHeader.startsWith("Bearer ")) && !cookieToken) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : cookieToken;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-passwordHash -refreshToken");
  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Forbidden: insufficient permissions");
  }
  next();
};

export const isSeller = (req, res, next) => {
  if (!req.user || (req.user.role !== "seller" && req.user.role !== "admin")) {
    res.status(403);
    throw new Error("Seller access required");
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  next();
};
