import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { SAMPLE_COMMENTS, LANGUAGES } from '../../data/comments';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import SortBar from './SortBar';
import ReviewPanel from './ReviewPanel';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';
import Button from '../ui/Button';
import PageLayout from '../ui/PageLayout';

function commentsReducer(state, action) {
  switch (action.type) {
    case 'SET_ALL': return action.comments;
    case 'LIKE': return state.map(c => c.id === action.id ? { ...c, likes: c.likes + (action.userInt.liked ? -1 : 1) } : c);
    case 'DISLIKE': return state.map(c => c.id === action.id ? { ...c, dislikes: c.dislikes + (action.userInt.disliked ? -1 : 1) } : c);
    case 'REPORT': return state.map(c => c.id === action.id ? { ...c, reports: (c.reports || 0) + 1, flagged: true } : c);
    case 'ADD': return [action.comment, ...state];
    case 'APPROVE': return state.map(c => c.id === action.id ? { ...c, flagged: false, reports: 0 } : c);
    case 'REMOVE': return state.filter(c => c.id !== action.id);
    default: return state;
  }
}

function interactionsReducer(state, action) {
  const cur = state[action.id] || {};
  switch (action.type) {
    case 'LIKE': return { ...state, [action.id]: { ...cur, liked: !cur.liked, disliked: false } };
    case 'DISLIKE': return { ...state, [action.id]: { ...cur, disliked: !cur.disliked, liked: false } };
    case 'REPORT': return { ...state, [action.id]: { ...cur, reported: true } };
    default: return state;
  }
}

export default function CommentsView({ videoId = 'bunny-2024', isIntegrated = false }) {
  const [comments, dispatchComments] = useReducer(commentsReducer, []);
  const [interactions, dispatchInteractions] = useReducer(interactionsReducer, {});
  const [sortBy, setSortBy] = useState('newest');
  const [preferredLang, setPreferredLang] = useState('en');
  const [showLocation, setShowLocation] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('North America');
  const [reviewOpen, setReviewOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api.get(`/comments?videoId=${encodeURIComponent(videoId)}`).then(res => {
      if (res?.comments?.length > 0) dispatchComments({ type: 'SET_ALL', comments: res.comments });
      else loadFallback();
    }).catch(loadFallback);
    function loadFallback() {
      const fb = SAMPLE_COMMENTS.filter(c => c.videoId === videoId || (!c.videoId && (videoId === 'bunny-2024' || videoId === 1 || videoId === '1')));
      dispatchComments({ type: 'SET_ALL', comments: fb });
    }
  }, [videoId]);

  const handleLike = useCallback((id) => {
    const t = comments.find(c => c.id === id);
    dispatchComments({ type: 'LIKE', id, userInt: interactions[id] || {} });
    dispatchInteractions({ type: 'LIKE', id });
    if (t) api.put(`/comments/${id}`, { likes: t.likes + ((interactions[id] || {}).liked ? -1 : 1) });
  }, [comments, interactions]);

  const handleDislike = useCallback((id) => {
    const t = comments.find(c => c.id === id);
    dispatchComments({ type: 'DISLIKE', id, userInt: interactions[id] || {} });
    dispatchInteractions({ type: 'DISLIKE', id });
    if (t) api.put(`/comments/${id}`, { dislikes: t.dislikes + ((interactions[id] || {}).disliked ? -1 : 1) });
  }, [comments, interactions]);

  const handleReport = useCallback((id) => {
    if ((interactions[id] || {}).reported) { showToast('Already reported', 'warning', 2000); return; }
    dispatchComments({ type: 'REPORT', id });
    dispatchInteractions({ type: 'REPORT', id });
    api.put(`/comments/${id}`, { reports: (comments.find(c => c.id === id)?.reports || 0) + 1, flagged: true });
    showToast('Comment reported for review', 'warning');
  }, [comments, interactions, showToast]);

  const handlePost = useCallback(async ({ text, lang }) => {
    const res = await api.post('/comments', { username: 'You', lang, text, translations: {}, location: showLocation ? selectedRegion : null, showLocation, videoId });
    dispatchComments({ type: 'ADD', comment: res?.comment || { id: Date.now(), videoId, username: 'You', lang, text, translations: {}, location: showLocation ? selectedRegion : null, showLocation, ts: Date.now(), likes: 0, dislikes: 0, reports: 0, flagged: false } });
    showToast('Comment posted!', 'success', 2500);
  }, [showLocation, selectedRegion, showToast, videoId]);

  const handleApprove = useCallback((id) => { dispatchComments({ type: 'APPROVE', id }); api.put(`/comments/${id}`, { flagged: false, reports: 0 }); showToast('Comment approved', 'success', 2000); }, [showToast]);
  const handleRemove = useCallback((id) => { dispatchComments({ type: 'REMOVE', id }); api.delete(`/comments/${id}`); showToast('Comment removed', 'info', 2000); }, [showToast]);

  const sorted = [...comments].sort((a, b) => sortBy === 'newest' ? b.ts - a.ts : sortBy === 'oldest' ? a.ts - b.ts : (b.likes - b.dislikes) - (a.likes - a.dislikes));
  const flagged = comments.filter(c => c.flagged);

  const Wrapper = isIntegrated ? ({ children }) => <div className="w-full">{children}</div> : ({ children }) => <PageLayout>{children}</PageLayout>;

  return (
    <Wrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3 ${isIntegrated ? 'text-xl' : 'text-2xl'}`}>
          <i className="fa-solid fa-comments text-amber-500" />
          {isIntegrated ? 'Comments' : 'Community Discussion'}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Share your thoughts in any language · {comments.length} comments</p>
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <i className="fa-solid fa-globe text-amber-500 text-sm" />
        <span className="text-sm text-zinc-400">Translate to:</span>
        <select id="preferred-lang-select" value={preferredLang} onChange={e => setPreferredLang(e.target.value)}
          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all">
          {Object.entries(LANGUAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <CommentForm onPostComment={handlePost} showLocation={showLocation} onToggleLocation={() => setShowLocation(l => !l)} selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      <SortBar sortBy={sortBy} onSort={setSortBy} total={comments.length} />

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <i className="fa-regular fa-comment-dots text-2xl text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No comments yet</h3>
          <p className="text-sm text-zinc-400">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((c, i) => (
            <CommentCard key={c.id} comment={c} index={i} preferredLang={preferredLang} userInteraction={interactions[c.id] || {}}
              onLike={handleLike} onDislike={handleDislike} onReport={handleReport}
              onToast={(msg, type) => showToast(msg, type === 'w' ? 'warning' : 'info')} />
          ))}
        </div>
      )}

      {/* Admin review button */}
      <button id="open-review-panel-btn" onClick={() => setReviewOpen(true)}
        className="fixed bottom-5 left-5 z-30 flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
        <i className="fa-solid fa-shield-halved" />
        Admin Review
        {flagged.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{flagged.length}</span>
        )}
      </button>

      <ReviewPanel isOpen={reviewOpen} onClose={() => setReviewOpen(false)} flaggedComments={flagged} onApprove={handleApprove} onRemove={handleRemove} />
    </Wrapper>
  );
}
