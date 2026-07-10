import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./db/index.js";
import { app } from "./app.js";
import { verifySMTP } from './utils/sendOTP.js';

const PORT = process.env.PORT || 8000;

// Connect to MongoDB & Start Server
connectDB()
  .then(async () => {
    console.log("📡 Connected to MongoDB successfully.");
    await verifySMTP();
    app.listen(PORT, () => {
      console.log(`🚀 StreamVault Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error("❌ Failed to connect to MongoDB server:", err.message);
    console.log("⚠️ Please ensure your MongoDB server is running on mongodb://localhost:27017/");
    await verifySMTP();
    // Start server anyway so health endpoint reports database disconnected status
    app.listen(PORT, () => {
      console.log(`🚀 StreamVault Backend Server running (offline DB mode) on http://localhost:${PORT}`);
    });
  });

export default app;
