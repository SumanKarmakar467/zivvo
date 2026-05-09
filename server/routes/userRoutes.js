import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addAddress, getAddresses } from "../controllers/userController.js";

const router = express.Router();

router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);

export default router;
