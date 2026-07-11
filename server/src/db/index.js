import mongoose from "mongoose";
import dns from "dns";
import { DB_NAME } from "../constants.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  family: 4,
};

const connectDB = async () => {
  const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
  try {
    console.log(`🔌 Connecting to MongoDB Atlas...`);
    const connectionInstance = await mongoose.connect(uri, MONGODB_OPTIONS);
    console.log(
      `📡 MongoDB connected! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED: ", error.message);
    throw error;
  }
};

export default connectDB;