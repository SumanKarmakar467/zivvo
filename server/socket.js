import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let io;
const userSocketMap = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake?.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(decoded.id);
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.userId);
    if (!userSocketMap.has(userId)) userSocketMap.set(userId, new Set());
    userSocketMap.get(userId).add(socket.id);

    socket.on("disconnect", () => {
      const set = userSocketMap.get(userId);
      if (!set) return;
      set.delete(socket.id);
      if (set.size === 0) userSocketMap.delete(userId);
    });
  });

  return io;
};

export const emitToUser = (userId, event, data) => {
  if (!io) return;
  const socketIds = userSocketMap.get(String(userId));
  if (!socketIds) return;
  socketIds.forEach((id) => io.to(id).emit(event, data));
};

