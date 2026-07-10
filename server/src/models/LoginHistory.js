import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    time: { type: String, required: true },
    city: { type: String, default: "Unknown" },
    state: { type: String, default: "Unknown" },
    country: { type: String, default: "Unknown Region" },
    device: { type: String, default: "Unknown Device" },
    browser: { type: String, default: "Unknown Browser" },
    os: { type: String, default: "Unknown OS" },
    otpVerified: { type: Boolean, default: false },
    themeAtLogin: { type: String, default: "dark" },
  },
  { timestamps: true },
);

export default mongoose.model("LoginHistory", loginHistorySchema);
