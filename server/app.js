import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import sellerPublicRoutes from "./routes/sellerPublicRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import sitemapRoute from "./routes/sitemapRoute.js";
import { AppError, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

const envOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...envOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
].filter(Boolean);

const isAllowedLocalDevOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isAllowedLocalDevOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use("/api/health", healthRoutes);
app.use("/sitemap.xml", sitemapRoute);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/webhooks/razorpay", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/sellers", sellerPublicRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/upload", uploadRoutes);

app.use("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

export default app;
