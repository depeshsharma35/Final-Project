import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  reason: { type: String, default: "Identity verification required" },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL index: auto expires after 5 mins
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

export default mongoose.model("Otp", otpSchema);
