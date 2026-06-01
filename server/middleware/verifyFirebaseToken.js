import admin from "../config/firebaseAdmin.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const fallbackUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role ?? "buyer"
    };
    const dbUser = await User.findOne({
      $or: [
        { firebaseUid: decodedToken.uid },
        { email: decodedToken.email }
      ]
    }).select("-passwordHash -refreshToken -refreshTokens");

    req.user = dbUser || fallbackUser;
    next();
  } catch (error) {
    try {
      const decoded = jwt.verify(idToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-passwordHash -refreshToken -refreshTokens");
      if (!user) return res.status(401).json({ error: "Not authenticated" });
      req.user = user;
      return next();
    } catch {
      console.error("Firebase token verification failed:", error.message);
      return res.status(403).json({ error: "Unauthorized: invalid or expired token" });
    }
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: insufficient role" });
  }
  next();
};
