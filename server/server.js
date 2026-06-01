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
  httpServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
      console.error(`Stop the existing process or start this server with another port, for example: PORT=5001 npm run dev`);
      process.exit(1);
    }
    throw error;
  });
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
