import React, { useState } from 'react';
import { LANGUAGES, REGIONS } from '../../data/comments';
import { moderate } from '../../utils/moderation';
import Button from '../ui/Button';

const selectCls = 'px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all';

export default function CommentForm({ onPostComment, showLocation, onToggleLocation, selectedRegion, onRegionChange }) {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en');
  const [error, setError] = useState(null);
  const count = text.length;

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const err = moderate(trimmed);
    if (err) { setError(err); return; }
    setError(null);
    onPostComment({ text: trimmed, lang });
    setText('');
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        {/* My avatar */}
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black text-xs font-bold shrink-0">YO</div>
        <textarea id="comment-textarea" value={text}
          onChange={e => { setText(e.target.value); if (error) setError(null); }}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handlePost(); }}
          placeholder="Write your comment... (Ctrl+Enter to post)" maxLength={500} rows={3}
          className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select id="comment-lang-select" value={lang} onChange={e => setLang(e.target.value)} className={selectCls}>
            {Object.entries(LANGUAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
            <button id="location-toggle" type="button" role="switch" aria-checked={showLocation}
              onClick={onToggleLocation} aria-label="Toggle location display"
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${showLocation ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${showLocation ? 'translate-x-4' : ''}`} />
            </button>
            Show region
          </label>

          {showLocation && (
            <select id="region-select" value={selectedRegion} onChange={e => onRegionChange(e.target.value)} className={selectCls}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium tabular-nums ${count > 450 ? 'text-red-500' : count > 350 ? 'text-yellow-500' : 'text-zinc-400'}`}>
            {count} / 500
          </span>
          <Button id="post-comment-btn" variant="primary" size="sm" onClick={handlePost} disabled={count === 0}>
            <i className="fa-solid fa-paper-plane" /> Post
          </Button>
        </div>
      </div>

      {error && (
        <div id="comment-error-box" className="mt-3 flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-600 dark:text-red-400">
          <i className="fa-solid fa-shield-halved shrink-0" />{error}
        </div>
      )}
    </section>
  );
}
