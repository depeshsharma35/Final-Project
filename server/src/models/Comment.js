import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    videoId: { type: mongoose.Schema.Types.Mixed, default: "bunny-2024" },
    username: { type: String, required: true },
    lang: { type: String, default: "en" },
    text: { type: String, required: true },
    translations: { type: Map, of: String, default: {} },
    location: { type: String, default: null },
    showLocation: { type: Boolean, default: false },
    ts: { type: Number, default: () => Date.now() },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
