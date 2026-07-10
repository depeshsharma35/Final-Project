import React from 'react';
import { nameColor, initials, timeAgo } from '../../utils/helpers';
import Button from '../ui/Button';

export default function ReviewPanel({ isOpen, onClose, flaggedComments = [], onApprove, onRemove }) {
  return (
    <>
      {/* Overlay */}
      <div id="review-overlay" onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {/* Drawer */}
      <aside id="review-panel" role="dialog" aria-label="Flagged comments review"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Flagged for Review</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Comments reported by the community</p>
          </div>
          <button id="review-panel-close" onClick={onClose} aria-label="Close panel"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        <div id="reviewList" className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {flaggedComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-3">
                <i className="fa-regular fa-circle-check text-2xl text-green-500" />
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">All clear!</p>
              <p className="text-sm text-zinc-400">No flagged comments at this time.</p>
            </div>
          ) : (
            flaggedComments.map(c => {
              const col = nameColor(c.username);
              const ini = initials(c.username);
              return (
                <div key={c.id} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: col }}>{ini}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.username}</span>
                        <span className="text-xs text-zinc-400">{timeAgo(c.ts)}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2.5">{c.text}</p>
                      <div className="flex gap-3 text-xs text-zinc-400 mb-3">
                        <span className="text-red-500"><i className="fa-solid fa-flag mr-1 text-[9px]" />{c.reports} {c.reports !== 1 ? 'reports' : 'report'}</span>
                        <span><i className="fa-solid fa-thumbs-up mr-1 text-[9px]" />{c.likes}</span>
                        <span><i className="fa-solid fa-thumbs-down mr-1 text-[9px]" />{c.dislikes}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button id={`approve-btn-${c.id}`} variant="outline" size="xs" className="flex-1" onClick={() => onApprove(c.id)}>
                          <i className="fa-solid fa-check text-[10px]" /> Approve
                        </Button>
                        <Button id={`remove-btn-${c.id}`} variant="danger" size="xs" className="flex-1" onClick={() => onRemove(c.id)}>
                          <i className="fa-solid fa-trash text-[10px]" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
