import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
  const unreadOnly = String(req.query.unreadOnly || "false") === "true";
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user._id };
  if (unreadOnly) filter.isRead = false;

  const [items, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false })
  ]);

  res.json({ items, page, pages: Math.ceil(total / limit), total, unreadCount });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid notification id");
  }

  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { $set: { isRead: true } },
    { new: true }
  ).lean();

  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json(notif);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ success: true });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid notification id");
  }

  const deleted = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id }).lean();
  if (!deleted) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json({ success: true });
});

