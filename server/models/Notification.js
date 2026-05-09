import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "error", "order"], default: "info" },
    readAt: { type: Date, default: null },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
