import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { PLANS } from '../data/plans';
import { VIDEOS as INITIAL_VIDEOS } from '../data/videos';
import { formatDate } from '../data/plans';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

// ── Navigation Tabs ──
export const VIEWS = ['catalog', 'player', 'watchparty', 'comments', 'plans', 'profile'];

const STORAGE_KEY = 'sv_appstate';

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s);
  } catch { return null; }
}

function saveState(state) {
  try {
    const minimal = { downloads: state.downloads, currentPlan: state.currentPlan };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
  } catch { /* ignore */ }
}

const initialState = {
  currentView: 'catalog',
  currentPlan: 'free',
  searchQuery: '',
  selectedCategory: 'all',
  downloads: [],
  activeDownloads: {}, // { id: { progress, speed, status } }
  videos: INITIAL_VIDEOS,
  currentVideoId: null,
  autoplayVideo: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.view };
    case 'SET_PLAN':
      return { ...state, currentPlan: action.plan };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.cat };
    case 'SET_VIDEOS':
      return { ...state, videos: action.videos };
    case 'ADD_VIDEO':
      return { ...state, videos: [action.video, ...state.videos] };
    case 'SELECT_VIDEO':
      return { ...state, currentVideoId: action.videoId, autoplayVideo: action.autoplay !== undefined ? action.autoplay : true };
    case 'ADD_DOWNLOAD':
      return { ...state, downloads: [action.download, ...state.downloads] };
    case 'REMOVE_DOWNLOAD':
      return { ...state, downloads: state.downloads.filter(d => d.id !== action.id) };
    case 'CLEAR_DOWNLOADS':
      return { ...state, downloads: [] };
    case 'SET_ACTIVE_DOWNLOAD':
      return { ...state, activeDownloads: { ...state.activeDownloads, [action.videoId]: action.data } };
    case 'CLEAR_ACTIVE_DOWNLOAD': {
      const { [action.videoId]: _, ...rest } = state.activeDownloads;
      return { ...state, activeDownloads: rest };
    }
    case 'LOAD_PERSISTED':
      return { ...state, ...action.data };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  // Load from localStorage on mount & fetch videos from MongoDB
  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'LOAD_PERSISTED', data: saved });

    api.get('/videos').then(res => {
      if (res && res.videos && res.videos.length > 0) {
        dispatch({ type: 'SET_VIDEOS', videos: res.videos });
      }
    });
  }, []);

  // Sync user state from MongoDB when currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      api.get(`/state/${currentUser.email}`).then(res => {
        if (res && res.state) {
          dispatch({
            type: 'LOAD_PERSISTED',
            data: { currentPlan: res.state.currentPlan, downloads: res.state.downloads || [] }
          });
        }
      });
    }
  }, [currentUser]);

  // Persist to localStorage and MongoDB
  useEffect(() => {
    saveState(state);
    if (currentUser?.email) {
      api.post(`/state/${currentUser.email}`, {
        currentPlan: state.currentPlan,
        downloads: state.downloads
      });
    }
  }, [state.downloads, state.currentPlan, currentUser]);

  const setView = useCallback((view) => {
    dispatch({ type: 'SET_VIEW', view });
  }, []);

  const setPlan = useCallback((plan) => {
    dispatch({ type: 'SET_PLAN', plan });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH', query });
  }, []);

  const setCategory = useCallback((cat) => {
    dispatch({ type: 'SET_CATEGORY', cat });
  }, []);

  const addVideo = useCallback((video) => {
    dispatch({ type: 'ADD_VIDEO', video });
    api.post('/videos', video);
  }, []);

  const selectVideo = useCallback((videoId, autoplay = true) => {
    dispatch({ type: 'SELECT_VIDEO', videoId, autoplay });
  }, []);

  const getTodayDownloads = useCallback(() => {
    const today = new Date().toDateString();
    return state.downloads.filter(d => new Date(d.downloadedAt).toDateString() === today);
  }, [state.downloads]);

  const getWeekDownloads = useCallback(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    return state.downloads.filter(d => now - new Date(d.downloadedAt).getTime() < week);
  }, [state.downloads]);

  const canDownload = useCallback((videoId) => {
    const plan = PLANS[state.currentPlan];
    if (!plan) return false;
    if (plan.dailyLimit === Infinity) return true;
    const todayDls = getTodayDownloads();
    if (todayDls.length >= plan.dailyLimit) return false;
    const alreadyDone = state.downloads.some(d => d.videoId === videoId);
    return !alreadyDone;
  }, [state.currentPlan, state.downloads, getTodayDownloads]);

  const startDownload = useCallback((video) => {
    if (!canDownload(video.id)) {
      const plan = PLANS[state.currentPlan];
      if (state.downloads.some(d => d.videoId === video.id)) {
        showToast('Already downloaded', 'warning');
      } else {
        showToast(`Daily limit of ${plan.dailyLimit} reached. Upgrade to download more.`, 'error');
      }
      return false;
    }

    dispatch({
      type: 'SET_ACTIVE_DOWNLOAD',
      videoId: video.id,
      data: { progress: 0, speed: '0 KB/s', status: 'preparing' }
    });

    let progress = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 8 + 3;
      progress = Math.min(100, progress + increment);
      const speedKBs = Math.floor(Math.random() * 4000 + 500);
      const speed = speedKBs > 1024 ? (speedKBs / 1024).toFixed(1) + ' MB/s' : speedKBs + ' KB/s';

      dispatch({
        type: 'SET_ACTIVE_DOWNLOAD',
        videoId: video.id,
        data: { progress, speed, status: 'downloading' }
      });

      if (progress >= 100) {
        clearInterval(interval);
        dispatch({ type: 'CLEAR_ACTIVE_DOWNLOAD', videoId: video.id });
        dispatch({
          type: 'ADD_DOWNLOAD',
          download: {
            id: Date.now(),
            videoId: video.id,
            title: video.title,
            creator: video.creator,
            category: video.category,
            duration: video.duration,
            sizeMB: video.sizeMB,
            thumbnail: video.thumbnail,
            downloadedAt: new Date().toISOString(),
            quality: PLANS[state.currentPlan]?.quality || '720p'
          }
        });
        showToast(`"${video.title}" downloaded!`, 'success');
      }
    }, 120);

    return true;
  }, [canDownload, state.currentPlan, state.downloads, showToast]);

  const removeDownload = useCallback((id) => {
    dispatch({ type: 'REMOVE_DOWNLOAD', id });
    showToast('Download removed', 'info');
  }, [showToast]);

  const clearAllDownloads = useCallback(() => {
    dispatch({ type: 'CLEAR_DOWNLOADS' });
    showToast('All downloads cleared', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      state, dispatch, setView, setPlan,
      setSearchQuery, setCategory, selectVideo, addVideo,
      getTodayDownloads, getWeekDownloads,
      canDownload, startDownload,
      removeDownload, clearAllDownloads,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
