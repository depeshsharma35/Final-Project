import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PLAYLIST } from '../../data/videos';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../utils/helpers';
import CommentsView from '../comments/CommentsView';
import Spinner from '../ui/Spinner';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const QUALITIES = ['Auto', '4K', '1080p', '720p', '480p', '360p'];

const pBtn = 'flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-base';
const menuItem = (active) => `w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${active ? 'text-amber-400 font-semibold bg-amber-400/10' : 'text-white/75 hover:text-white hover:bg-white/10'}`;

export default function PlayerView() {
  const { state, selectVideo } = useApp();
  const playlist = (state.videos?.length > 0) ? state.videos : PLAYLIST;

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimer = useRef(null);

  const getIdx = useCallback(() => {
    if (state.currentVideoId != null) {
      const i = playlist.findIndex(v => String(v.id) === String(state.currentVideoId));
      if (i >= 0) return i;
    }
    return 0;
  }, [state.currentVideoId, playlist]);

  const [idx, setIdx] = useState(getIdx);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [fullscreen, setFullscreen] = useState(false);
  const [showCtrl, setShowCtrl] = useState(true);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [loading, setLoading] = useState(true);

  const cur = playlist[idx] || playlist[0] || {};

  useEffect(() => {
    const ni = getIdx();
    if (ni !== idx) setIdx(ni);
  }, [getIdx]);

  const resetTimer = useCallback(() => {
    setShowCtrl(true);
    clearTimeout(controlsTimer.current);
    if (playing) controlsTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.addEventListener('play', () => setPlaying(true));
    v.addEventListener('pause', () => { setPlaying(false); setShowCtrl(true); });
    v.addEventListener('timeupdate', () => { setTime(v.currentTime); if (v.buffered.length) setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100); });
    v.addEventListener('durationchange', () => setDur(v.duration));
    v.addEventListener('waiting', () => setLoading(true));
    v.addEventListener('canplay', () => setLoading(false));
    v.addEventListener('ended', () => {
      if (idx < playlist.length - 1) { const n = idx + 1; setIdx(n); selectVideo?.(playlist[n].id, true); }
      else { setPlaying(false); setShowCtrl(true); }
    });
  }, [idx]);

  useEffect(() => { const v = videoRef.current; if (!v) return; v.load(); setTime(0); setDur(0); setBuffered(0); setLoading(true); }, [idx]);
  useEffect(() => { if (videoRef.current) videoRef.current.volume = muted ? 0 : vol; }, [vol, muted]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const cases = { Space: () => toggle(), ArrowRight: () => seek(10), ArrowLeft: () => seek(-10), ArrowUp: () => setVol(v => Math.min(1, v + 0.1)), ArrowDown: () => setVol(v => Math.max(0, v - 0.1)), KeyM: () => setMuted(m => !m), KeyF: () => toggleFS(), KeyN: () => goNext(), KeyP: () => goPrev() };
      if (cases[e.code]) { e.preventDefault(); cases[e.code](); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [idx, playing]);

  const toggle = useCallback(() => { const v = videoRef.current; if (!v) return; v.paused ? v.play().catch(() => {}) : v.pause(); resetTimer(); }, [resetTimer]);
  const seek = (s) => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, Math.min(dur, v.currentTime + s)); };
  const onProgress = (e) => { const r = progressRef.current?.getBoundingClientRect(); if (!r || !dur) return; videoRef.current.currentTime = ((e.clientX - r.left) / r.width) * dur; };
  const toggleFS = () => { const c = document.getElementById('player-fs'); if (!document.fullscreenElement) { c?.requestFullscreen().catch(() => {}); setFullscreen(true); } else { document.exitFullscreen(); setFullscreen(false); } };
  const goNext = () => { if (idx < playlist.length - 1) { const n = idx + 1; setIdx(n); selectVideo?.(playlist[n].id, true); } };
  const goPrev = () => { if (idx > 0) { const p = idx - 1; setIdx(p); selectVideo?.(playlist[p].id, true); } };

  const pct = dur > 0 ? (time / dur) * 100 : 0;
  const volIcon = muted || vol === 0 ? 'fa-volume-xmark' : vol < 0.5 ? 'fa-volume-low' : 'fa-volume-high';
  const channelChar = (cur.channelAvatar && !/^https?/.test(cur.channelAvatar)) ? cur.channelAvatar : (cur.channel?.[0] || cur.creator?.[0] || 'S');

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Player column */}
        <div className="flex-1 min-w-0">
          {/* Video */}
          <div id="player-fs" className="relative bg-black rounded-2xl overflow-hidden aspect-video group"
            onMouseMove={resetTimer} onMouseLeave={() => { if (playing) setShowCtrl(false); }}>
            <video id="main-video-player" ref={videoRef} className="w-full h-full object-contain"
              src={cur?.src || ''} poster={cur?.thumbnail} preload="auto" onClick={toggle} />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Spinner size="xl" className="text-white" />
              </div>
            )}

            {/* Controls overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end px-4 pb-3 pt-10 transition-opacity duration-300 ${showCtrl ? 'opacity-100' : 'opacity-0'}`}>
              {/* Progress */}
              <div id="player-progress-bar" ref={progressRef} onClick={onProgress}
                className="relative h-1 bg-white/20 rounded-full cursor-pointer mb-3 hover:h-1.5 transition-all group/prog">
                <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
                <div className="absolute inset-y-0 left-0 bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-1">
                <button id="prev-track-btn" className={pBtn} onClick={goPrev} disabled={idx === 0} title="Previous (P)"><i className="fa-solid fa-backward-step" /></button>
                <button id="play-pause-btn" className={`${pBtn} text-xl`} onClick={toggle} title="Play/Pause (Space)"><i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'}`} /></button>
                <button id="next-track-btn" className={pBtn} onClick={goNext} disabled={idx === playlist.length - 1} title="Next (N)"><i className="fa-solid fa-forward-step" /></button>

                <button id="mute-btn" className={pBtn} onClick={() => setMuted(m => !m)} title="Mute (M)"><i className={`fa-solid ${volIcon}`} /></button>
                <input id="volume-slider" type="range" min="0" max="1" step="0.05" value={muted ? 0 : vol}
                  onChange={e => { setVol(+e.target.value); setMuted(false); }}
                  className="w-16 accent-amber-500 cursor-pointer" title="Volume" />

                <span className="text-white/70 text-xs font-medium ml-2 tabular-nums">{formatDuration(time)} / {formatDuration(dur)}</span>

                <div className="flex-1" />

                <button id="seek-back-btn" className={pBtn} onClick={() => seek(-10)} title="Rewind 10s"><i className="fa-solid fa-rotate-left text-sm" /></button>
                <button id="seek-fwd-btn" className={pBtn} onClick={() => seek(10)} title="Forward 10s"><i className="fa-solid fa-rotate-right text-sm" /></button>

                {/* Speed */}
                <div className="relative">
                  <button id="speed-btn" onClick={() => { setShowSpeed(s => !s); setShowQuality(false); }}
                    className={`${pBtn} text-xs font-bold w-10`}>{speed}x</button>
                  {showSpeed && (
                    <div id="speed-menu" className="absolute bottom-10 right-0 bg-zinc-950/95 border border-white/10 rounded-xl p-1.5 min-w-[90px] shadow-xl">
                      {SPEEDS.map(s => <button key={s} className={menuItem(speed === s)} onClick={() => { setSpeed(s); setShowSpeed(false); }}>{s}x{s === 1 ? ' (Normal)' : ''}</button>)}
                    </div>
                  )}
                </div>

                {/* Quality */}
                <div className="relative">
                  <button id="quality-btn" onClick={() => { setShowQuality(q => !q); setShowSpeed(false); }} className={pBtn} title="Quality">
                    <i className="fa-solid fa-gear" />
                  </button>
                  {showQuality && (
                    <div id="quality-menu" className="absolute bottom-10 right-0 bg-zinc-950/95 border border-white/10 rounded-xl p-1.5 min-w-[90px] shadow-xl">
                      {QUALITIES.map(q => <button key={q} className={menuItem(quality === q)} onClick={() => { setQuality(q); setShowQuality(false); }}>{q}</button>)}
                    </div>
                  )}
                </div>

                <button id="fullscreen-btn" className={pBtn} onClick={toggleFS} title="Fullscreen (F)">
                  <i className={`fa-solid ${fullscreen ? 'fa-compress' : 'fa-expand'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Video info */}
          <div className="mt-5">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">{cur.title}</h2>
            <p className="text-sm text-zinc-400 mb-4">{cur.views || '0 views'} · {cur.date || cur.createdAt || 'Recently added'}</p>

            <div className="flex items-center gap-3.5 py-4 border-t border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
                {channelChar}
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{cur.channel || cur.creator || 'StreamVault'}</p>
                <p className="text-xs text-zinc-400">{cur.subs || 'Subscriber'}</p>
              </div>
            </div>

            {(cur.desc || cur.description) && (
              <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl p-4 mb-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{cur.desc || cur.description}</p>
              </div>
            )}

            <div className="flex gap-4 text-xs text-zinc-400">
              <span><i className="fa-solid fa-gauge-high mr-1.5" />Speed: {speed}x</span>
              <span><i className="fa-solid fa-display mr-1.5" />Quality: {quality}</span>
              <span className="hidden md:inline"><i className="fa-solid fa-keyboard mr-1.5" />Space=Play · F=Fullscreen · M=Mute</span>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <CommentsView videoId={cur.id} isIntegrated={true} />
          </div>
        </div>

        {/* Playlist sidebar */}
        <div className="w-full xl:w-80 shrink-0">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden sticky top-20">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
              <i className="fa-solid fa-list text-amber-500 text-sm" />
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Playlist</span>
              <span className="ml-auto text-xs text-zinc-400">{idx + 1}/{playlist.length}</span>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {playlist.map((item, i) => (
                <button key={item.id} id={`playlist-item-${item.id}`}
                  className={`w-full flex items-start gap-3 px-3 py-3 text-left transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${i < playlist.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''} ${i === idx ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
                  onClick={() => { setIdx(i); selectVideo?.(item.id, true); }}>
                  <div className="relative w-20 h-11 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    {i === idx && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'} text-amber-400 text-sm`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-snug line-clamp-2 mb-0.5 ${i === idx ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>{item.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{item.channel || item.creator || 'StreamVault'}</p>
                    <p className="text-[11px] text-zinc-400">{item.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
