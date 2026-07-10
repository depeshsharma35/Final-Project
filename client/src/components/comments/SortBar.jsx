import React from 'react';

const SORTS = [
  { id: 'newest', label: 'Newest', icon: 'fa-clock' },
  { id: 'oldest', label: 'Oldest', icon: 'fa-hourglass-start' },
  { id: 'popular', label: 'Popular', icon: 'fa-fire' },
];

export default function SortBar({ sortBy, onSort, total }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
      <span className="text-sm text-zinc-400">
        <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{total}</strong> comments
      </span>
      <div className="flex gap-1.5">
        {SORTS.map(s => (
          <button key={s.id} id={`sort-${s.id}-btn`} onClick={() => onSort(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              sortBy === s.id
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}>
            <i className={`fa-solid ${s.icon} text-[11px]`} />{s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
