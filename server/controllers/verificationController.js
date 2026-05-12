import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { createNotification } from "../utils/notify.js";

export const submitVerification = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Seller access required" });

    const seller = await User.findById(req.user._id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const status = seller.verification?.status || "unverified";
    if (!["unverified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Verification already submitted or approved" });
    }

    const { gstNumber, panNumber, aadhaarLast4, gstCertUrl, panCardUrl, bankProofUrl } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      "verification.status": "pending",
      "verification.submittedAt": new Date(),
      "verification.reviewedAt": null,
      "verification.reviewedBy": null,
      "verification.rejectionNote": "",
      "verification.documents": {
        gstNumber,
        panNumber,
        aadhaarLast4,
        gstCertUrl,
        panCardUrl,
        bankProofUrl
      },
      isVerified: false
    });

    const admins = await User.find({ role: "admin" }).select("_id");
    await Promise.all(
      admins.map((admin) =>
        createNotification({
          recipient: admin._id,
          type: "verification_request",
          title: "New seller verification request",
          body: `${seller.name} has submitted verification documents.`,
          link: `/admin/verification/${req.user._id}`,
          meta: { sellerId: req.user._id }
        })
      )
    );

    res.json({ message: "Verification submitted successfully" });
  } catch (err) {
    next(err);
  }
};

export const getMyVerificationStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Seller access required" });
    const seller = await User.findById(req.user._id).select("verification isVerified trustScore createdAt name email avatar");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (err) {
    next(err);
  }
};

export const getPendingVerifications = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const status = req.query.status;
    const filter = status ? { "verification.status": status } : {};
    const sellers = await User.find({ role: "seller", ...filter })
      .select("name email avatar verification.status verification.submittedAt verification.reviewedAt isVerified trustScore")
      .sort({ "verification.submittedAt": -1, createdAt: -1 })
      .lean();
    res.json({ sellers });
  } catch (err) {
    next(err);
  }
};

export const getVerificationBySellerId = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const seller = await User.findById(req.params.sellerId)
      .select("name email avatar phone verification isVerified trustScore createdAt")
      .populate("verification.reviewedBy", "name email")
      .lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (err) {
    next(err);
  }
};

export const approveVerification = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const sellerId = req.params.sellerId;
    const seller = await User.findByIdAndUpdate(
      sellerId,
      {
        "verification.status": "verified",
        "verification.reviewedAt": new Date(),
        "verification.reviewedBy": req.user._id,
        "verification.rejectionNote": "",
        isVerified: true
      },
      { new: true }
    ).select("name email verification isVerified trustScore");

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await createNotification({
      recipient: sellerId,
      type: "verification_approved",
      title: "Your seller account is verified ✓",
      body: "You now have a verified badge on your storefront.",
      link: "/seller/dashboard",
      meta: { sellerId }
    });

    res.json({ message: "Seller approved", seller });
  } catch (err) {
    next(err);
  }
};

export const rejectVerification = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { rejectionNote } = req.body;
    const seller = await User.findByIdAndUpdate(
      req.params.sellerId,
      {
        "verification.status": "rejected",
        "verification.reviewedAt": new Date(),
        "verification.reviewedBy": req.user._id,
        "verification.rejectionNote": rejectionNote,
        isVerified: false
      },
      { new: true }
    ).select("name email verification isVerified trustScore");

    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json({ message: "Seller verification rejected", seller });
  } catch (err) {
    next(err);
  }
};

export const getSellerStorefront = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
    const skip = (page - 1) * limit;

    const seller = await User.findById(sellerId)
      .select("name avatar isVerified trustScore verification.status createdAt")
      .lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const [products, statsAgg, total] = await Promise.all([
      Product.find({ seller: sellerId, isActive: true })
        .sort({ sold: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .select("name slug images price mrp sold averageRating reviewCount brand seller")
        .lean(),
      Order.aggregate([
        { $match: { "items.seller": seller._id, orderStatus: "delivered" } },
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
      ]),
      Product.countDocuments({ seller: sellerId, isActive: true })
    ]);

    const stats = statsAgg[0] || { totalSales: 0, totalOrders: 0 };
    res.json({
      seller,
      stats,
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

