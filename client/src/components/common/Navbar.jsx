import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PLANS } from '../../data/plans';

const TABS = [
  { id: 'catalog',    label: 'Catalog',     icon: 'fa-film' },
  { id: 'player',     label: 'Player',      icon: 'fa-play-circle' },
  { id: 'upload',     label: 'Upload',      icon: 'fa-cloud-arrow-up' },
  { id: 'watchparty', label: 'Watch Party', icon: 'fa-users' },
  { id: 'plans',      label: 'Plans',       icon: 'fa-crown' },
  { id: 'profile',    label: 'Profile',     icon: 'fa-user-circle' },
];

const PLAN_BADGE = {
  elite:  'bg-amber-500/10 text-amber-500 border border-amber-500/30',
  pro:    'bg-violet-500/10 text-violet-400 border border-violet-500/30',
  bronze: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  free:   'bg-zinc-500/10 text-zinc-500 border border-zinc-500/30 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700',
};
const PLAN_ICON = { elite: 'fa-crown', pro: 'fa-star', bronze: 'fa-medal', free: 'fa-lock-open' };

export default function Navbar({ flaggedCount = 0 }) {
  const { state, setView } = useApp();
  const { currentUser, handleLogout } = useAuth();
  const { actualTheme, setThemePref } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const planKey = state.currentPlan || 'free';
  const plan = PLANS[planKey];
  const isUrlAvatar = currentUser?.avatar && /^https?:\/\/|^\/|^data:/.test(currentUser.avatar);
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SV';

  const go = (id) => { setView(id); setMobileOpen(false); };
  const toggleTheme = () => setThemePref(actualTheme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-14 px-4 flex items-center justify-between gap-4"
        role="navigation" aria-label="Main navigation">

        {/* Brand */}
        <button className="flex items-center gap-2 shrink-0 group" onClick={() => go('catalog')} aria-label="StreamVault home">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-play text-black text-[11px] ml-0.5" />
          </div>
          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hidden sm:block tracking-tight">StreamVault</span>
        </button>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center" role="tablist">
          {TABS.map(tab => (
            <button key={tab.id} id={`nav-tab-${tab.id}`} role="tab"
              aria-selected={state.currentView === tab.id}
              onClick={() => go(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                state.currentView === tab.id
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}>
              <i className={`fa-solid ${tab.icon} text-[11px]`} />
              {tab.label}
              {tab.id === 'comments' && flaggedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{flaggedCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Plan badge */}
          <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${PLAN_BADGE[planKey] || PLAN_BADGE.free}`} title={`${plan?.name} Plan`}>
            <i className={`fa-solid ${PLAN_ICON[planKey] || 'fa-lock-open'} text-[10px]`} />
            {plan?.name || 'Free'}
          </div>

          {/* Theme */}
          <button id="theme-toggle-btn" onClick={toggleTheme}
            title={actualTheme === 'dark' ? 'Light mode' : 'Dark mode'} aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
            <i className={`fa-solid ${actualTheme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`} />
          </button>

          {/* Avatar */}
          <button id="user-avatar-btn" onClick={handleLogout}
            title={`${currentUser?.name || 'User'} — Sign out`} aria-label="Sign out"
            className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black text-xs font-bold overflow-hidden hover:ring-2 hover:ring-amber-400 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-zinc-950 transition-all">
            {isUrlAvatar ? (
              <img src={currentUser.avatar} alt={currentUser?.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[11px] font-bold">{initials}</span>
            )}
          </button>

          {/* Hamburger */}
          <button id="mobile-menu-btn"
            className="flex md:hidden w-8 h-8 rounded-lg items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            onClick={() => setMobileOpen(o => !o)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 p-3 flex flex-col gap-1 shadow-2xl" role="menu">
          {TABS.map(tab => (
            <button key={tab.id} role="menuitem"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                state.currentView === tab.id
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              onClick={() => go(tab.id)}>
              <i className={`fa-solid ${tab.icon} w-4 text-center`} />
              {tab.label}
              {tab.id === 'comments' && flaggedCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{flaggedCount}</span>
              )}
            </button>
          ))}
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
          <button role="menuitem"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            onClick={() => { handleLogout(); setMobileOpen(false); }}>
            <i className="fa-solid fa-right-from-bracket w-4 text-center" /> Sign Out
          </button>
        </div>
      )}
    </>
  );
}
