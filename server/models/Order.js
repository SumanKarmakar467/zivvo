import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, unique: true, default: () => `SP${Date.now()}` },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      variant: String,
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    shippingAddress: {
      name: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String
    },
    subtotal: Number,
    discount: Number,
    deliveryCharge: Number,
    totalAmount: Number,
    couponApplied: { code: String, discount: Number },
    paymentMethod: { type: String, enum: ["UPI", "Card", "NetBanking", "COD", "BNPL"] },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
      default: "placed"
    },
    trackingId: String,
    deliverySlot: { date: Date, slot: String },
    expectedDelivery: Date,
    cancelReason: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
