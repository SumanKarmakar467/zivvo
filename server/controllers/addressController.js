import Address from "../models/Address.js";

export const getAddresses = async (req, res, next) => {
  try {
    if (!["user", "buyer", "admin", "seller"].includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean();
    res.json({ addresses, defaultAddress: addresses.find((addr) => addr.isDefault) || null });
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const count = await Address.countDocuments({ user: req.user._id });
    if (count >= 5) return res.status(400).json({ message: "Maximum 5 addresses allowed" });

    const shouldBeDefault = count === 0 || Boolean(req.body.isDefault);
    if (shouldBeDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      label: req.body.label || "home",
      fullName: req.body.fullName,
      phone: req.body.phone,
      line1: req.body.line1,
      line2: req.body.line2 || "",
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country || "India",
      isDefault: shouldBeDefault
    });

    res.status(201).json(address);
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    const fields = ["label", "fullName", "phone", "line1", "line2", "city", "state", "pincode", "country"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) address[field] = req.body[field];
    });

    if (req.body.isDefault === true) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
      address.isDefault = true;
    }

    await address.save();
    res.json(address);
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    const wasDefault = address.isDefault;
    await address.deleteOne();

    if (wasDefault) {
      const first = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (first) {
        first.isDefault = true;
        await first.save();
      }
    }

    res.json({ message: "Address deleted" });
  } catch (err) {
    next(err);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();
    res.json(address);
  } catch (err) {
    next(err);
  }
};

