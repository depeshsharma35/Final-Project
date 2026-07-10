import React from 'react';

export default function Input({ id, type = 'text', label, placeholder, value, onChange, error, disabled, required, autoComplete, icon, rightElement, className = '', inputMode, maxLength, onKeyDown, onPaste, 'aria-label': al, ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">{icon}</span>
        )}
        <input
          id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
          disabled={disabled} required={required} autoComplete={autoComplete}
          inputMode={inputMode} maxLength={maxLength} onKeyDown={onKeyDown} onPaste={onPaste}
          aria-label={al} aria-invalid={!!error}
          className={`
            w-full bg-zinc-100 dark:bg-zinc-800/60 border rounded-xl px-4 py-3 text-sm
            text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}
          `}
          {...rest}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation" />{error}
        </p>
      )}
    </div>
  );
}
