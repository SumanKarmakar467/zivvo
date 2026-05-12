import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markNotificationAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
