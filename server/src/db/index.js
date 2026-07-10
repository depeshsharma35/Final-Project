import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {    
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(
      `📡 MongoDB connected! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED: ", error);
    throw error;
  }
};

export default connectDB;
