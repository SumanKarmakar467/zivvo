import express from "express";
import { getSellerStorefront } from "../controllers/verificationController.js";

const router = express.Router();

router.get("/:sellerId/storefront", getSellerStorefront);

export default router;

