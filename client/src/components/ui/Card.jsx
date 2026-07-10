import React from 'react';

export default function Card({ children, className = '', padding = true, ...rest }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl ${padding ? 'p-6' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}