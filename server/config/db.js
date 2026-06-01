import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGO_URI or MONGODB_URI is not defined in environment variables");
  }

  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const details = [
      "Unable to connect to MongoDB Atlas.",
      "Check that your current public IP is allowed in Atlas Network Access.",
      "Also verify that your MongoDB username/password are correct and URL-encoded in MONGO_URI or MONGODB_URI.",
      "If you are on a restricted network, allow outbound TCP traffic to port 27017 or try another network/VPN."
    ];

    error.message = `${details.join(" ")} Original error: ${error.message}`;
    throw error;
  }
};

export default connectDB;
