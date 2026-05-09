import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Zivvo API is running" });
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
