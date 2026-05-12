import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { protect, isSeller } from "./middlewares/authMiddleware.js";
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
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

const envOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...envOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(helmet());
app.use("/api/webhooks/razorpay", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Zivvo API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/analytics", protect, isSeller, analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/sellers", sellerPublicRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/shipping", shippingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
