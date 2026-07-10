import React from 'react';

const variants = {
  default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
  accent:  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
  danger:  'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
  info:    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
