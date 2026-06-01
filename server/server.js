import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;
const allowServerWithoutDb =
  process.env.ALLOW_SERVER_WITHOUT_DB === "true" ||
  (process.env.NODE_ENV || "development") !== "production";

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    if (!allowServerWithoutDb) throw error;
    console.warn(error.message);
    console.warn("Starting API without MongoDB for local development. Database-backed routes will fail until Atlas access is fixed.");
  }

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
