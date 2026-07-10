import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    avatar: String,
    audio: Boolean,
    video: Boolean,
    color: String,
    isHost: Boolean,
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    id: String,
    isSystem: { type: Boolean, default: false },
    isMe: { type: Boolean, default: false },
    user: String,
    avatar: String,
    color: String,
    text: String,
    time: String,
  },
  { _id: false },
);

const watchPartySchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true },
    hostName: { type: String, required: true },
    participants: [participantSchema],
    messages: [messageSchema],
    isPlaying: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("WatchParty", watchPartySchema);
