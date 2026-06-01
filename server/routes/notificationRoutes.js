// Auth: protected routes use verifyFirebaseToken middleware (see middleware/verifyFirebaseToken.js)
import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markNotificationAsRead
} from "../controllers/notificationController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.use(verifyFirebaseToken);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
