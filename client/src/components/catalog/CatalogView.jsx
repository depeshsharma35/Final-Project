import React from 'react';
import { useApp } from '../../context/AppContext';
import { VIDEOS } from '../../data/videos';
import { PLANS } from '../../data/plans';
import VideoCard from './VideoCard';
import Button from '../ui/Button';
import PageLayout from '../ui/PageLayout';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'tutorial', label: 'Tutorials' },
  { id: 'documentary', label: 'Docs' },
  { id: 'music', label: 'Music' },
  { id: 'tech', label: 'Tech' },
];

export default function CatalogView() {
  const { state, setSearchQuery, setCategory, setView, getTodayDownloads } = useApp();
  const plan = PLANS[state.currentPlan];
  const limit = plan?.dailyLimit || 1;
  const used = getTodayDownloads().length;
  const pct = limit === Infinity ? 5 : Math.min(100, (used / limit) * 100);
  const quotaText = limit === Infinity ? `${used} / ∞` : `${used} / ${limit}`;

  const query = (state.searchQuery || '').toLowerCase().trim();
  const cat = state.selectedCategory;
  const filtered = VIDEOS.filter(v => {
    const matchCat = cat === 'all' || v.category === cat;
    const matchQ = !query || v.title.toLowerCase().includes(query) || v.creator.toLowerCase().includes(query) || v.category.toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  return (
    <PageLayout>
      {/* Hero */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden mb-8 p-8">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: `url(https://picsum.photos/seed/sv-hero/1400/400)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-zinc-900 via-transparent to-white dark:to-zinc-900" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
            Discover & Download<br />
            <span className="text-amber-500">Premium Videos</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
            Curated high-quality videos. Download for offline viewing based on your plan's daily allowance.
          </p>
          <div className="inline-flex items-center gap-3 bg-black/5 dark:bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-zinc-200 dark:border-zinc-700">
            <i className="fa-solid fa-gauge-high text-amber-500 text-sm" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Today's Downloads</span>
            <div id="quotaBar" className="w-28 h-1.5 bg-zinc-200 dark:bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span id="quotaText" className="text-sm font-bold text-amber-500">{quotaText}</span>
            <span className="text-xs text-zinc-400 border-l border-zinc-200 dark:border-zinc-700 pl-3">{plan?.name} Plan</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-60">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none" />
            <input id="catalog-search-input" type="text" placeholder="Search title, creator, or category..."
              value={state.searchQuery} onChange={e => setSearchQuery(e.target.value)} aria-label="Search videos"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
          </div>
          <Button id="nav-to-downloads-btn" variant="ghost" size="sm" onClick={() => setView('downloads')}>
            <i className="fa-solid fa-download" /> My Downloads ({state.downloads.length})
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(item => (
            <button key={item.id} id={`cat-btn-${item.id}`} onClick={() => setCategory(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                state.selectedCategory === item.id
                  ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div id="videoGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <i className="fa-solid fa-film text-2xl text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No videos found</h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-xs">Try a different keyword or category.</p>
          <Button variant="secondary" onClick={() => { setSearchQuery(''); setCategory('all'); }}>
            <i className="fa-solid fa-rotate-left" /> Reset Filters
          </Button>
        </div>
      )}
    </PageLayout>
  );
}
