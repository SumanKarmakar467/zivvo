import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import User from "../models/User.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses").lean();
  if (!user) throw new AppError("User not found", 404);
  res.json({ addresses: user.addresses || [] });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    throw new AppError("All required address fields must be filled", 400);
  }

  const phoneValid = /^\d{10}$/.test(String(phone));
  const pincodeValid = /^\d{6}$/.test(String(pincode));

  if (!phoneValid) throw new AppError("Phone must be 10 digits", 400);
  if (!pincodeValid) throw new AppError("Pincode must be 6 digits", 400);

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  user.addresses.push({
    fullName,
    phone,
    addressLine1,
    addressLine2: addressLine2 || "",
    city,
    state,
    pincode,
    country: country || "India"
  });

  await user.save();
  const added = user.addresses[user.addresses.length - 1];
  res.status(201).json({ address: added, addresses: user.addresses });
});
