import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    creator: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    size: { type: String, required: true },
    sizeMB: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    views: { type: String, default: "0 views" },
    src: { type: String, default: "" },
    channel: { type: String, default: "" },
    channelAvatar: { type: String, default: "" },
    subs: { type: String, default: "" },
    date: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
