/**
 * Vercel Serverless Entry Point
 *
 * This file is used ONLY by Vercel (referenced in server/vercel.json).
 * It exports the Express `app` as the default handler — Vercel's @vercel/node
 * adapter uses the default export as the serverless function handler.
 *
 * Key difference from src/index.js:
 *  - Does NOT call app.listen() (no TCP server in serverless)
 *  - Connects to MongoDB lazily (first request) with caching to avoid
 *    reconnecting on every cold start / warm invocation
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { app } from './app.js';
import { DB_NAME } from './constants.js';

// Cache the connection promise so we only connect once per container lifetime
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // Already connected (warm container)
    return;
  }
  if (!connectionPromise) {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
  }
  try {
    await connectionPromise;
    global.lastDbError = null;
  } catch (err) {
    connectionPromise = null; // Reset promise so next invocation can retry
    global.lastDbError = err.message;
    throw err;
  }
}

// Wrap app to ensure DB is connected before handling each request
const handler = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ MongoDB connection failed in serverless handler:', err.message);
    // Continue anyway — app will return 500 for DB-dependent routes,
    // but health check and non-DB routes will still work.
  }
  return app(req, res);
};

export default handler;
