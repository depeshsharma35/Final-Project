import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getISTTime } from '../../utils/helpers';
import Card from '../ui/Card';

export default function AppearanceSection() {
  const { themePref, actualTheme, setThemePref } = useTheme();
  const { currentUser, updateThemePreference } = useAuth();
  const [istInfo, setIstInfo] = useState(getISTTime());

  useEffect(() => {
    const timer = setInterval(() => setIstInfo(getISTTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (pref) => {
    if (currentUser && updateThemePreference) {
      updateThemePreference(pref);
    } else {
      setThemePref(pref);
    }
  };

  const preview = actualTheme === 'dark' ? {
    bg: '#09090b', card: '#18181b', accent: '#f59e0b', fg: '#f4f4f5'
  } : {
    bg: '#fafafa', card: '#ffffff', accent: '#d97706', fg: '#09090b'
  };

  return (
    <div id="section-appearance" className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-zinc-100 mb-1.5">Theme &amp; Appearance</h1>
        <p className="text-sm text-zinc-400">
          Customize the look and feel of StreamVault. Choose manual themes or let adaptive timing take control.
        </p>
      </div>

      {/* Live IST indicator */}
      <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-4 flex items-center gap-3 mb-6">
        <i className="fa-solid fa-clock text-amber-500 text-lg" />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          Current IST Time: <strong id="appearanceIST" className="text-amber-500 font-bold tabular-nums">{istInfo.formatted}</strong> — Adaptive selection:{' '}
          <strong id="appearanceAutoResult" className="text-zinc-900 dark:text-zinc-100 font-bold">{istInfo.hours >= 10 && istInfo.hours < 12 ? 'Light' : 'Dark'}</strong> mode
        </span>
      </div>

      {/* Theme selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Auto */}
        <div
          onClick={() => handleSelect('auto')}
          className={`stat-card cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col ${
            themePref === 'auto'
              ? 'border-amber-500 bg-amber-500/[0.02] ring-2 ring-amber-500/10'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
              <i className="fa-solid fa-wand-magic-sparkles text-amber-500" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Auto (Adaptive)</span>
            {themePref === 'auto' && <i className="fa-solid fa-circle-check text-amber-500 ml-auto" />}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Light from 10AM-12PM IST, Dark at all other times. Perfectly synced with daily workflow.
          </p>
        </div>

        {/* Dark */}
        <div
          onClick={() => handleSelect('dark')}
          className={`stat-card cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col ${
            themePref === 'dark'
              ? 'border-amber-500 bg-amber-500/[0.02] ring-2 ring-amber-500/10'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <i className="fa-solid fa-moon text-indigo-500" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Dark Mode</span>
            {themePref === 'dark' && <i className="fa-solid fa-circle-check text-amber-500 ml-auto" />}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Deep obsidian background with amber accents. Easy on the eyes for extended viewing.
          </p>
        </div>

        {/* Light */}
        <div
          onClick={() => handleSelect('light')}
          className={`stat-card cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col ${
            themePref === 'light'
              ? 'border-amber-500 bg-amber-500/[0.02] ring-2 ring-amber-500/10'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center">
              <i className="fa-solid fa-sun text-orange-500" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Light Mode</span>
            {themePref === 'light' && <i className="fa-solid fa-circle-check text-amber-500 ml-auto" />}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Warm clean background with teal accents. Crisp and professional for daytime browsing.
          </p>
        </div>
      </div>

      {/* Color Palette Preview */}
      <Card>
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">Active Color Tokens</h3>
        <p className="text-xs text-zinc-400 mb-6">
          These are the CSS custom properties currently powering the interface.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div id="previewBg" className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-700 mb-3" style={{ background: preview.bg }} />
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Background (--bg)</div>
            <div id="previewBgHex" className="text-[11px] text-zinc-400 mt-0.5">{preview.bg}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div id="previewCard" className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-700 mb-3" style={{ background: preview.card }} />
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Card surface (--card)</div>
            <div id="previewCardHex" className="text-[11px] text-zinc-400 mt-0.5">{preview.card}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div id="previewAccent" className="w-full h-12 rounded-lg mb-3" style={{ background: preview.accent }} />
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Accent color (--accent)</div>
            <div id="previewAccentHex" className="text-[11px] text-zinc-400 mt-0.5">{preview.accent}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div id="previewFg" className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-700 mb-3" style={{ background: preview.fg }} />
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Foreground text (--fg)</div>
            <div id="previewFgHex" className="text-[11px] text-zinc-400 mt-0.5">{preview.fg}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
