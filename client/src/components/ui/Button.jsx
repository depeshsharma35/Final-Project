import React from 'react';

const base = 'inline-flex items-center justify-center gap-2 font-medium cursor-pointer select-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2 rounded-xl';

const variants = {
  primary:   'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700',
  ghost:     'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
  outline:   'bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500/10',
  danger:    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1',
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  xl: 'px-7 py-3.5 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, type = 'button', onClick, id, 'aria-label': al, ...rest }) {
  return (
    <button id={id} type={type} onClick={onClick} disabled={disabled || loading} aria-label={al}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
