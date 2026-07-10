import React from 'react';
import { useToast } from '../../context/ToastContext';

const STYLES = {
  success: { ring: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/40', icon: 'text-green-500', fa: 'fa-circle-check' },
  error:   { ring: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/40', icon: 'text-red-500', fa: 'fa-circle-xmark' },
  warning: { ring: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/40', icon: 'text-yellow-500', fa: 'fa-triangle-exclamation' },
  info:    { ring: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40', icon: 'text-blue-500', fa: 'fa-circle-info' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none" aria-live="polite">
      {toasts.map(t => {
        const s = STYLES[t.type] || STYLES.info;
        return (
          <div key={t.id} role="alert"
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg shadow-zinc-900/10 text-sm font-medium transition-all duration-300 ${s.ring} ${t.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <i className={`fa-solid ${s.fa} ${s.icon} shrink-0`} />
            <span className="flex-1 text-zinc-700 dark:text-zinc-200">{t.message}</span>
            <button onClick={() => removeToast(t.id)} aria-label="Dismiss"
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
