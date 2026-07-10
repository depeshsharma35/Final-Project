import express from 'express';
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';
import WatchParty from '../models/WatchParty.js';
import AppState from '../models/AppState.js';

const router = express.Router();

// ── Videos Catalog ──
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ id: -1 });
    res.json({ status: 'success', videos });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/videos', async (req, res) => {
  try {
    const videoData = req.body;
    const newVideo = await Video.create({
      ...videoData,
      id: videoData.id || Date.now()
    });
    res.json({ status: 'success', video: newVideo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// ── Comments ──
router.get('/comments', async (req, res) => {
  try {
    const { videoId } = req.query;
    let filter = {};
    if (videoId) {
      const numId = Number(videoId);
      if (videoId === 'bunny-2024' || videoId === '1' || numId === 1) {
        filter = { $or: [{ videoId: 'bunny-2024' }, { videoId: 1 }, { videoId: '1' }, { videoId: null }, { videoId: { $exists: false } }] };
      } else {
        filter = isNaN(numId) ? { videoId } : { $or: [{ videoId }, { videoId: numId }] };
      }
    }
    const comments = await Comment.find(filter).sort({ ts: -1 });
    res.json({ status: 'success', comments });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/comments', async (req, res) => {
  try {
    const { username, lang, text, translations = {}, location = null, showLocation = false, videoId = 'bunny-2024' } = req.body;
    const count = await Comment.countDocuments();
    const newComment = await Comment.create({
      id: Date.now() + Math.floor(Math.random() * 1000),
      videoId: videoId || 'bunny-2024',
      username,
      lang: lang || 'en',
      text,
      translations,
      location,
      showLocation,
      ts: Date.now(),
      likes: 0,
      dislikes: 0,
      reports: 0,
      flagged: false
    });
    res.json({ status: 'success', comment: newComment });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/comments/:id', async (req, res) => {
  try {
    const { likes, dislikes, reports, flagged } = req.body;
    const comment = await Comment.findOne({ id: Number(req.params.id) });
    if (!comment) return res.status(404).json({ status: 'error', message: 'Comment not found' });

    if (likes !== undefined) comment.likes = likes;
    if (dislikes !== undefined) comment.dislikes = dislikes;
    if (reports !== undefined) comment.reports = reports;
    if (flagged !== undefined) comment.flagged = flagged;

    await comment.save();
    res.json({ status: 'success', comment });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    await Comment.deleteOne({ id: Number(req.params.id) });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Watch Party ──
router.post('/watchparty/create', async (req, res) => {
  try {
    const { roomCode, hostName, participants, messages } = req.body;
    const room = await WatchParty.findOneAndUpdate(
      { roomCode },
      { hostName, participants, messages, isPlaying: false, currentTime: 0 },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ status: 'success', room });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/watchparty/join', async (req, res) => {
  try {
    const { roomCode, participant, message } = req.body;
    let room = await WatchParty.findOne({ roomCode });
    if (!room) {
      // Create if doesn't exist
      room = await WatchParty.create({
        roomCode,
        hostName: participant.name,
        participants: [participant],
        messages: [message]
      });
    } else {
      // Add participant if not present
      if (!room.participants.some(p => p.id === participant.id)) {
        room.participants.push(participant);
      }
      if (message) room.messages.push(message);
      await room.save();
    }
    res.json({ status: 'success', room });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/watchparty/message', async (req, res) => {
  try {
    const { roomCode, message } = req.body;
    const room = await WatchParty.findOne({ roomCode });
    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    room.messages.push(message);
    await room.save();
    res.json({ status: 'success', room });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/watchparty/leave', async (req, res) => {
  try {
    const { roomCode, participantId, isHost } = req.body;
    if (isHost) {
      await WatchParty.deleteOne({ roomCode });
    } else if (roomCode && participantId) {
      const room = await WatchParty.findOne({ roomCode });
      if (room) {
        room.participants = room.participants.filter(p => p.id !== participantId);
        await room.save();
      }
    }
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── App State (Downloads & Subscription Plan) ──
router.get('/state/:email', async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    let state = await AppState.findOne({ email });
    if (!state) {
      state = await AppState.create({ email, currentPlan: 'free', downloads: [] });
    }
    res.json({ status: 'success', state });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/state/:email', async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    const { currentPlan, downloads } = req.body;
    const state = await AppState.findOneAndUpdate(
      { email },
      { currentPlan, downloads },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ status: 'success', state });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
