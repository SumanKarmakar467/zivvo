import express from "express";
import { forgotPassword, login, logout, me, refresh, register, registerValidation, resetPassword, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerValidation, register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);
export default router;
