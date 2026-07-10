import React, { useState } from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function LandingScreen() {
  const { createRoom, joinRoom } = useWatchParty();
  const { currentUser } = useAuth();
  const [username, setUsername] = useState(currentUser?.name?.split(' ')[0] || 'You');
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 text-center max-w-md w-full py-12">
        {/* Floating icon wrapper */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-6 animate-pulse">
          <i className="fa-solid fa-play-circle text-white text-4xl" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 font-display bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 dark:from-white to-zinc-500 dark:to-zinc-400">
          SyncWatch
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base mb-8">Watch together, perfectly in sync</p>

        {/* Action card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/40">
          {/* Display Name Input */}
          <div className="mb-5">
            <Input
              id="wp-display-name"
              type="text"
              label="Display Name"
              placeholder="Enter your display name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Create Button */}
          <Button
            id="create-room-btn"
            variant="primary"
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/10 py-3.5 mb-5 rounded-xl border-none"
            onClick={() => createRoom(username.trim() || 'You')}
          >
            <i className="fa-solid fa-plus-circle mr-2" /> Create Watch Party
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs text-zinc-400 font-medium">or join existing</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Join input/button group */}
          <div className="flex gap-2">
            <input
              id="join-room-code"
              type="text"
              placeholder="Room Code (XYZ-123)"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all uppercase tracking-wider"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && joinRoom(username.trim() || 'You', roomCode)}
            />
            <Button
              id="join-room-btn"
              variant="secondary"
              className="px-4 rounded-xl shrink-0"
              onClick={() => joinRoom(username.trim() || 'You', roomCode)}
            >
              <i className="fa-solid fa-arrow-right" />
            </Button>
          </div>
        </div>

        {/* Feature list */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          <span><i className="fa-solid fa-video mr-1.5 text-indigo-500" /> HD Video</span>
          <span><i className="fa-solid fa-sync mr-1.5 text-indigo-500 animate-spin-slow" /> Sync</span>
          <span><i className="fa-solid fa-lock mr-1.5 text-indigo-500" /> Secure</span>
        </div>
      </div>
    </div>
  );
}
