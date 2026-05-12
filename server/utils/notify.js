import Notification from "../models/Notification.js";
import { emitToUser } from "../socket.js";

export const createNotification = async ({ recipient, type, title, body = "", link = "", meta = {} }) => {
  const notif = await Notification.create({ recipient, type, title, body, link, meta });
  emitToUser(recipient, "notification", notif);
  return notif;
};

