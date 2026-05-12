import express from "express";
import { body, validationResult } from "express-validator";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress
} from "../controllers/addressController.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ message: "Validation failed", errors: errors.array() });
};

const addressValidators = [
  body("label").optional().isIn(["home", "work", "other"]),
  body("fullName").isString().isLength({ min: 2, max: 100 }),
  body("phone").matches(/^\d{10}$/).withMessage("Phone must be 10 digits"),
  body("line1").isString().notEmpty(),
  body("line2").optional().isString(),
  body("city").isString().notEmpty(),
  body("state").isString().notEmpty(),
  body("pincode").matches(/^\d{6}$/).withMessage("Pincode must be 6 digits"),
  body("country").optional().isString(),
  body("isDefault").optional().isBoolean()
];

router.use(protect);
router.get("/", getAddresses);
router.post("/", addressValidators, handleValidation, addAddress);
router.patch("/:id", addressValidators.map((rule) => rule.optional()), handleValidation, updateAddress);
router.delete("/:id", deleteAddress);
router.patch("/:id/default", setDefaultAddress);

export default router;

