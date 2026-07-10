import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS } from '../../data/plans';
import { formatFileSize } from '../../utils/helpers';
import Button from '../ui/Button';
import PageLayout from '../ui/PageLayout';

const CAT_BADGE = {
  tutorial:    'bg-blue-500/10 text-blue-500 dark:text-blue-400',
  documentary: 'bg-violet-500/10 text-violet-500 dark:text-violet-400',
  music:       'bg-pink-500/10 text-pink-500 dark:text-pink-400',
  tech:        'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400',
};

export default function DownloadsView() {
  const { state, getTodayDownloads, getWeekDownloads, removeDownload, clearAllDownloads, setView } = useApp();
  const [showClear, setShowClear] = useState(false);

  const todayDl = getTodayDownloads();
  const weekDl = getWeekDownloads();
  const totalSize = state.downloads.reduce((s, d) => s + (d.sizeMB || 0), 0);

  const grouped = {};
  [...state.downloads]
    .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt))
    .forEach(d => {
      const key = new Date(d.downloadedAt).toDateString();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });

  const stats = [
    { label: 'Today', value: todayDl.length, unit: 'downloads', icon: 'fa-calendar-day', color: 'text-amber-500 bg-amber-500/10' },
    { label: 'This Week', value: weekDl.length, unit: 'downloads', icon: 'fa-calendar-week', color: 'text-green-500 bg-green-500/10' },
    { label: 'All Time', value: state.downloads.length, unit: 'total', icon: 'fa-database', color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Storage', value: formatFileSize(totalSize), unit: '', icon: 'fa-hard-drive', color: 'text-yellow-500 bg-yellow-500/10' },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" className="mb-3" onClick={() => setView('catalog')}>
            <i className="fa-solid fa-arrow-left" /> Catalog
          </Button>
          <h1 id="back-to-catalog-btn" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Downloads</h1>
          <p className="text-sm text-zinc-400 mt-1">Videos you've downloaded — organized by date</p>
        </div>
        <div className="flex gap-2.5 items-center">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm">
            <i className="fa-solid fa-chart-simple text-amber-500" />
            Total: <strong id="totalDownloads" className="text-amber-500">{state.downloads.length}</strong>
          </div>
          <Button id="clear-all-btn" variant="danger" size="sm"
            onClick={() => state.downloads.length > 0 && setShowClear(true)}
            disabled={state.downloads.length === 0}>
            <i className="fa-solid fa-trash-can" /> Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <i className={`fa-solid ${s.icon} text-xs`} />
              </div>
              <span className="text-xs text-zinc-400">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</div>
            {s.unit && <div className="text-xs text-zinc-400 mt-0.5">{s.unit}</div>}
          </div>
        ))}
      </div>

      {/* List */}
      {state.downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <i className="fa-solid fa-download text-2xl text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No downloads yet</h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-xs leading-relaxed">
            Head to the Catalog to download videos. Your {PLANS[state.currentPlan]?.name} plan allows {PLANS[state.currentPlan]?.dailyLimit === Infinity ? 'unlimited' : PLANS[state.currentPlan]?.dailyLimit} downloads/day.
          </p>
          <Button id="go-to-catalog-btn" variant="primary" onClick={() => setView('catalog')}>
            <i className="fa-solid fa-film" /> Browse Catalog
          </Button>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fa-regular fa-calendar" />{date}
            </h3>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {items.map((d, idx) => (
                <div key={d.id} id={`dl-row-${d.id}`}
                  className={`flex items-center gap-3.5 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${idx < items.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                  <div className="w-16 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                    <img src={d.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{d.title}</p>
                    <p className="text-xs text-zinc-400">{d.creator} · {d.duration} · {d.sizeMB} MB · {d.quality}</p>
                  </div>
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${CAT_BADGE[d.category] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    {d.category}
                  </span>
                  <Button id={`remove-dl-${d.id}`} variant="danger" size="xs" onClick={() => removeDownload(d.id)} className="shrink-0">
                    <i className="fa-solid fa-trash-can" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Clear confirm */}
      {showClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowClear(false)}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-triangle-exclamation text-2xl text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Clear All Downloads?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                This will remove all {state.downloads.length} downloaded videos. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button id="cancel-clear-btn" variant="ghost" className="flex-1" onClick={() => setShowClear(false)}>Cancel</Button>
              <Button id="confirm-clear-btn" variant="danger" className="flex-1" onClick={() => { clearAllDownloads(); setShowClear(false); }}>
                <i className="fa-solid fa-trash-can" /> Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
