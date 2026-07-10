import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "US" },
    otpMethod: { type: String, enum: ["email", "sms"], default: "email" },
    securitySettings: {
      locationCheck: { type: Boolean, default: true },
      deviceCheck: { type: Boolean, default: true },
    },
    themePreference: {
      type: String,
      enum: ["light", "dark", "auto"],
      default: "auto",
    },
    lastCity: { type: String, default: "" },
    lastState: { type: String, default: "" },
    lastDeviceFingerprint: { type: String, default: "" },
    lastDeviceName: { type: String, default: "" },
    lastLoginTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
