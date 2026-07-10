import React, { useRef, useEffect, useState } from 'react';
import { useWatchParty } from '../../context/WatchPartyContext';
import { useToast } from '../../context/ToastContext';
import { formatDuration } from '../../utils/helpers';
import WatchPartySidebar from './WatchPartySidebar';
import VideoCallStrip from './VideoCallStrip';
import WatchPartyModals from './WatchPartyModals';
import Button from '../ui/Button';

const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function WatchPartyRoom() {
  const {
    roomCode, participants, isSidebarOpen, setIsSidebarOpen,
    isPlaying, setIsPlaying, volume, setVolume,
    isRecording, isScreenSharing,
    currentTime, setCurrentTime, duration, setDuration,
    unreadCount, setUnreadCount,
    setShowInviteModal, setShowSettingsModal,
    leaveRoom, copyInviteLink,
  } = useWatchParty();

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const { showToast } = useToast();
  const [showSyncBadge, setShowSyncBadge] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onUpdate = () => setCurrentTime(vid.currentTime);
    const onDuration = () => setDuration(vid.duration || 0);
    vid.addEventListener('timeupdate', onUpdate);
    vid.addEventListener('durationchange', onDuration);
    return () => { vid.removeEventListener('timeupdate', onUpdate); vid.removeEventListener('durationchange', onDuration); };
  }, [setCurrentTime, setDuration]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play().catch(() => {}); setIsPlaying(true); }
    else { vid.pause(); setIsPlaying(false); }
  };

  const handleSync = () => {
    setShowSyncBadge(true);
    setTimeout(() => setShowSyncBadge(false), 3000);
    showToast('Synced with all participants', 'success', 2500);
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const vid = videoRef.current;
    if (vid && duration) { vid.currentTime = pct * duration; setCurrentTime(pct * duration); }
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volIcon = volume === 0 ? 'fa-volume-xmark' : volume < 50 ? 'fa-volume-low' : 'fa-volume-high';

  const handleCopyLink = (url) => {
    copyInviteLink(url);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-950 text-white overflow-hidden">
      {/* Room Navbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <i className="fa-solid fa-play-circle text-indigo-500 text-lg shrink-0" />
          <span className="font-semibold text-sm hidden sm:inline shrink-0">Watch Party</span>
          <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono text-zinc-300 select-all shrink-0">
            {roomCode}
          </span>

          {isRecording && (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/25 px-2.5 py-0.5 rounded-lg text-xs text-red-400 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Recording
            </div>
          )}

          {isScreenSharing && (
            <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-lg text-xs text-indigo-400 shrink-0">
              <i className="fa-solid fa-desktop text-[10px]" /> Screen Share
            </div>
          )}

          <div className="text-xs text-zinc-500 hidden md:inline truncate">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex gap-1.5 items-center">
          <button id="wp-sync-btn" onClick={handleSync} title="Sync with all"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg text-xs font-medium transition-all">
            <i className="fa-solid fa-sync text-[10px]" /> Sync
          </button>
          <button id="wp-invite-btn" onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 border border-transparent rounded-lg text-xs font-medium transition-all text-white">
            <i className="fa-solid fa-user-plus text-[10px]" /> Invite
          </button>
          <button id="wp-settings-btn" onClick={() => setShowSettingsModal(true)} title="Settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white">
            <i className="fa-solid fa-gear" />
          </button>
          <button id="wp-leave-btn" onClick={leaveRoom} title="Leave room"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600 hover:bg-red-500 transition-all text-white">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column: Video Player & Video Call Strip */}
        <div className="flex-1 flex flex-col min-w-0 bg-black">
          {/* Video element container */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden group">
            <video
              id="wp-main-video"
              ref={videoRef}
              src={SAMPLE_VIDEO}
              className="w-full h-full object-contain cursor-pointer"
              loop
              onClick={togglePlay}
            />

            {/* Sync success overlay badge */}
            {showSyncBadge && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <i className="fa-solid fa-check" /> Synced!
              </div>
            )}

            {/* Controls panel */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
              {/* Progress track */}
              <div id="wp-progress-bar" ref={progressRef} onClick={handleProgressClick}
                className="relative h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-all scale-0 group-hover/progress:scale-100" style={{ left: `${pct}%`, marginLeft: '-6px' }} />
              </div>

              {/* Controls triggers row */}
              <div className="flex items-center gap-2">
                <button id="wp-play-btn" onClick={togglePlay} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                  <i className="fa-solid fa-backward-step" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                  <i className="fa-solid fa-forward-step" />
                </button>

                <button id="wp-volume-btn" onClick={() => setVolume(v => v === 0 ? 75 : 0)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                  <i className={`fa-solid ${volIcon}`} />
                </button>
                <input
                  id="wp-volume-slider"
                  type="range" min="0" max="100" step="5"
                  value={volume}
                  onChange={e => setVolume(parseInt(e.target.value))}
                  className="w-16 accent-indigo-500 cursor-pointer"
                />

                <span className="text-xs text-white/70 font-medium tabular-nums ml-2">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </span>

                <div className="flex-1" />

                <button id="wp-sidebar-toggle" title="Toggle chat"
                  onClick={() => { setIsSidebarOpen(o => !o); if (!isSidebarOpen) setUnreadCount(0); }}
                  className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSidebarOpen ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-white'
                  }`}>
                  <i className="fa-solid fa-comments" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                  )}
                </button>

                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors">
                  <i className="fa-solid fa-expand" />
                </button>
              </div>
            </div>
          </div>

          {/* WebRTC Video Call Strip */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800">
            <VideoCallStrip />
          </div>
        </div>

        {/* Right column: Chat/Participants Sidebar */}
        <WatchPartySidebar />
      </div>

      {/* Modals manager */}
      <WatchPartyModals onCopyLink={handleCopyLink} />
    </div>
  );
}
