import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    id: Number,
    videoId: Number,
    title: String,
    creator: String,
    category: String,
    duration: String,
    sizeMB: Number,
    thumbnail: String,
    downloadedAt: String,
    quality: String,
  },
  { _id: false },
);

const appStateSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    currentPlan: { type: String, default: "free" },
    downloads: [downloadSchema],
  },
  { timestamps: true },
);

export default mongoose.model("AppState", appStateSchema);
