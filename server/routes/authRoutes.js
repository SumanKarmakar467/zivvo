// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  me
} from "../controllers/authController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyFirebaseToken, me);
router.post("/google", googleLogin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
