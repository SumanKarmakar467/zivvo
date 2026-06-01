// Types: see models/types/Notification.ts
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "new_order",
        "order_status",
        "review_received",
        "low_stock",
        "promo",
        "return_requested",
        "verification_request",
        "verification_approved"
      ],
      required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, trim: true, maxlength: 300, default: "" },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
