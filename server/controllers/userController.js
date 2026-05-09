import bcrypt from "bcryptjs";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { uploadToCloudinary } from "../middleware/upload.js";
import User from "../models/User.js";

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  addresses: user.addresses,
  wishlist: user.wishlist,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash -refreshTokens -refreshToken").lean();
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (phone && !/^\d{10}$/.test(String(phone))) {
    throw new AppError("Phone must be 10 digits", 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  if (typeof name === "string") user.name = name.trim();
  if (typeof phone === "string") user.phone = phone.trim();

  await user.save();
  res.json({ user: sanitize(user) });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) throw new AppError("Avatar image is required", 400);

  const uploaded = await uploadToCloudinary(req.file.buffer, "zivvo/avatars");

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  user.avatar = uploaded.url;
  await user.save();

  res.json({ avatar: uploaded.url });
});

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses").lean();
  if (!user) throw new AppError("User not found", 404);
  res.json({ addresses: user.addresses || [] });
});

export const addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    throw new AppError("All required address fields must be filled", 400);
  }
  if (!/^\d{10}$/.test(String(phone))) throw new AppError("Phone must be 10 digits", 400);
  if (!/^\d{6}$/.test(String(pincode))) throw new AppError("Pincode must be 6 digits", 400);

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  if (isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  user.addresses.push({
    fullName,
    phone,
    addressLine1,
    addressLine2: addressLine2 || "",
    city,
    state,
    pincode,
    country: country || "India",
    isDefault: Boolean(isDefault) || user.addresses.length === 0
  });

  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(req.params.id);
  if (!address) throw new AppError("Address not found", 404);

  const fields = ["fullName", "phone", "addressLine1", "addressLine2", "city", "state", "pincode", "country"];
  fields.forEach((field) => {
    if (typeof req.body[field] === "string") {
      address[field] = req.body[field].trim();
    }
  });

  if (address.phone && !/^\d{10}$/.test(String(address.phone))) throw new AppError("Phone must be 10 digits", 400);
  if (address.pincode && !/^\d{6}$/.test(String(address.pincode))) throw new AppError("Pincode must be 6 digits", 400);

  if (req.body.isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = String(a._id) === String(address._id);
    });
  }

  await user.save();
  res.json({ addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  if (user.addresses.length <= 1) {
    throw new AppError("Cannot delete the only address", 400);
  }

  const target = user.addresses.id(req.params.id);
  if (!target) throw new AppError("Address not found", 404);

  const wasDefault = target.isDefault;
  user.addresses = user.addresses.filter((a) => String(a._id) !== String(req.params.id));

  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json({ addresses: user.addresses });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist", "name images price mrp rating slug")
    .lean();
  if (!user) throw new AppError("User not found", 404);
  res.json({ wishlist: user.wishlist || [] });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  const exists = user.wishlist.some((id) => String(id) === String(productId));

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => String(id) !== String(productId));
    await user.save();
    return res.json({ wishlisted: false, wishlist: user.wishlist });
  }

  user.wishlist.push(productId);
  await user.save();
  return res.json({ wishlisted: true, wishlist: user.wishlist });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new AppError("currentPassword and newPassword are required", 400);

  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!user) throw new AppError("User not found", 404);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash || "");
  if (!valid) throw new AppError("Current password is incorrect", 400);

  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password updated successfully" });
});
