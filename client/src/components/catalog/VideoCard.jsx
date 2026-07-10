import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS } from '../../data/plans';
import { getCategoryIcon } from '../../data/videos';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const CAT_STYLE = {
  tutorial:    'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
  documentary: 'bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20',
  music:       'bg-pink-500/10 text-pink-500 dark:text-pink-400 border-pink-500/20',
  tech:        'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border-cyan-500/20',
};

export default function VideoCard({ video }) {
  const { state, startDownload, canDownload, setView, selectVideo } = useApp();
  const [showModal, setShowModal] = useState(false);

  const go = () => { selectVideo?.(video.id, true); setView?.('player'); };
  const active = state.activeDownloads[video.id];
  const downloaded = state.downloads.some(d => d.videoId === video.id);
  const able = canDownload(video.id);
  const catIcon = getCategoryIcon ? getCategoryIcon(video.category) : 'fa-tag';
  const catStyle = CAT_STYLE[video.category] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700';

  return (
    <>
      <article id={`video-card-${video.id}`}
        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/10 dark:hover:shadow-zinc-950/50 transition-all duration-200"
        onClick={go}>
        {/* Thumb */}
        <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <img src={video.thumbnail} alt={video.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="fa-solid fa-play text-white ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium">{video.duration}</span>
        </div>

        {/* Body */}
        <div className="p-3.5">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2 leading-snug">{video.title}</h3>
          <p className="text-xs text-zinc-400 mb-3">{video.creator}{video.views ? ` · ${video.views}` : ''}</p>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catStyle}`}>
              <i className={`fa-solid ${catIcon} text-[10px]`} />{video.category}
            </span>
            <button id={`download-btn-${video.id}`} onClick={e => { e.stopPropagation(); if (!downloaded && !active) setShowModal(true); }}
              title={downloaded ? 'Downloaded' : 'Download'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                downloaded ? 'text-green-500' : active ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}>
              {active ? <><Spinner size="xs" />{Math.round(active.progress)}%</> : <><i className={`fa-solid ${downloaded ? 'fa-check-circle' : 'fa-download'} text-xs`} />{video.sizeMB ? `${video.sizeMB} MB` : ''}</>}
            </button>
          </div>
          {active && (
            <div className="mt-2.5 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-200" style={{ width: `${active.progress}%` }} />
            </div>
          )}
        </div>
      </article>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            {able ? (
              <>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-0.5">{video.title}</h3>
                    <p className="text-xs text-zinc-400">{video.creator} · {video.sizeMB} MB</p>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 mb-5">
                  <p className="text-xs text-zinc-400 mb-1">Download quality</p>
                  <p className="text-sm font-semibold text-amber-500">
                    <i className="fa-solid fa-photo-film mr-2" />{PLANS[state.currentPlan]?.quality || '720p'}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Button id={`cancel-download-${video.id}`} variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button id={`confirm-download-${video.id}`} variant="primary" className="flex-1" onClick={() => { setShowModal(false); startDownload(video); }}>
                    <i className="fa-solid fa-download" /> Download
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-2 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-lock text-3xl text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Limit Reached</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    You've reached your daily download limit on the <strong className="text-amber-500">{PLANS[state.currentPlan]?.name}</strong> plan.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Close</Button>
                  <Button variant="primary" className="flex-1" onClick={() => setShowModal(false)}>
                    <i className="fa-solid fa-crown" /> Upgrade
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
