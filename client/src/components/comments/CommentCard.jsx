import React, { useState } from 'react';
import { LANGUAGES } from '../../data/comments';
import { nameColor, initials, timeAgo } from '../../utils/helpers';
import Spinner from '../ui/Spinner';

export default function CommentCard({ comment, index, preferredLang, userInteraction = {}, onLike, onDislike, onReport, onToast }) {
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [showTrans, setShowTrans] = useState(false);

  const isLiked = userInteraction.liked || false;
  const isDisliked = userInteraction.disliked || false;
  const isReported = userInteraction.reported || false;
  const canTranslate = comment.lang !== preferredLang;
  const col = nameColor(comment.username);
  const ini = initials(comment.username);

  const handleTranslate = () => {
    if (showTrans) { setShowTrans(false); return; }
    setTranslating(true);
    setTimeout(() => {
      setTranslating(false);
      if (comment.translations?.[preferredLang]) { setTranslated(comment.translations[preferredLang]); setShowTrans(true); }
      else onToast('Translation being processed. Check back soon.', 'w');
    }, 600 + Math.random() * 400);
  };

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700" data-id={comment.id}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: col }}>
          {ini}
        </div>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{comment.username}</span>
            {comment.showLocation && comment.location && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                <i className="fa-solid fa-location-dot text-[9px]" />{comment.location}
              </span>
            )}
            <span className="text-xs text-zinc-400">{timeAgo(comment.ts)}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">{comment.lang}</span>
            {comment.flagged && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                <i className="fa-solid fa-flag text-[9px]" /> Under Review
              </span>
            )}
            {canTranslate && (
              <button id={`translate-btn-${comment.id}`} onClick={handleTranslate}
                className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-amber-500/10 hover:text-amber-500 border border-zinc-200 dark:border-zinc-700 transition-all">
                {translating ? <><Spinner size="xs" /> Translating...</> : showTrans ? <><i className="fa-solid fa-language" /> Hide</> : <><i className="fa-solid fa-language" /> Translate</>}
              </button>
            )}
          </div>

          {/* Text */}
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-3">{comment.text}</p>
          {showTrans && translated && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 mb-3">
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1.5">Translated to {LANGUAGES[preferredLang]}</div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{translated}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button id={`like-btn-${comment.id}`} onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isLiked ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200'}`}>
              <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-thumbs-up`} />
              {comment.likes > 0 ? comment.likes : ''}
            </button>
            <button id={`dislike-btn-${comment.id}`} onClick={() => onDislike(comment.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDisliked ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200'}`}>
              <i className={`fa-${isDisliked ? 'solid' : 'regular'} fa-thumbs-down`} />
              {comment.dislikes > 0 ? comment.dislikes : ''}
            </button>
            <button id={`report-btn-${comment.id}`} onClick={() => onReport(comment.id)} disabled={isReported}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isReported ? 'text-red-500' : 'text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500'}`}>
              <i className="fa-solid fa-flag text-[10px]" />
              {isReported ? 'Reported' : 'Report'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
