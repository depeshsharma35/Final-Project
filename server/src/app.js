import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

const app = express();

// ── CORS Configuration ──
// Allowed origins: explicit CLIENT_URL env var, all *.vercel.app deployments, and localhost dev
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,          // Explicit production frontend URL (set in Vercel dashboard)
  'http://localhost:5173',          // Vite dev server
  'http://localhost:3000',          // CRA dev server (fallback)
].filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;                               // Allow non-browser requests (curl, Postman)
  if (ALLOWED_ORIGINS.includes(origin)) return true;     // Exact match
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true; // Any *.vercel.app domain
  return false;
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// cors() handles OPTIONS preflight automatically
app.use(cors(corsOptions));

app.use(express.json());

// Health check endpoints
app.get(['/api/health', '/health'], (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    dbError: global.lastDbError || null,
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      clientUrl: process.env.CLIENT_URL || null
    }
  });
});

// Mount routes with and without /api prefix (for maximum flexibility across Vercel deployments)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api', dataRoutes);
app.use('/', dataRoutes);

export { app };
