import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!rawUri) {
      throw new Error("MongoDB connection URI is missing from environment variables.");
    }
    
    // Safely append DB_NAME avoiding double slashes
    const baseUri = rawUri.endsWith("/") ? rawUri.slice(0, -1) : rawUri;
    const connectionString = DB_NAME ? `${baseUri}/${DB_NAME}` : baseUri;

    const connectionInstance = await mongoose.connect(connectionString);
    console.log(
      `📡 MongoDB connected! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED: ", error);
    throw error;
  }
};

export default connectDB;
