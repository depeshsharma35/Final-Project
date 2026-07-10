import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import OverviewSection from './OverviewSection';
import SecuritySection from './SecuritySection';
import AppearanceSection from './AppearanceSection';
import AccountSection from './AccountSection';
import Button from '../ui/Button';
import PageLayout from '../ui/PageLayout';

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser, handleLogout } = useAuth();
  const { actualTheme, setThemePref } = useTheme();

  if (!currentUser) return null;

  const toggleQuickTheme = () => {
    setThemePref(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { id: 'overview',   label: 'Overview',              icon: 'fa-table-cells-large' },
    { id: 'security',   label: 'Security & Verification', icon: 'fa-shield-halved' },
    { id: 'appearance', label: 'Appearance & Theme',    icon: 'fa-palette' },
    { id: 'account',    label: 'Account Settings',      icon: 'fa-user-gear' }
  ];

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SV';
  const isUrlAvatar = currentUser?.avatar && /^https?:\/\/|^\/|^data:/.test(currentUser.avatar);

  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 min-h-[calc(100vh-180px)]">
        {/* Profile Sidebar */}
        <aside className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col h-fit">
          {/* User Card Header */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-zinc-200 dark:border-zinc-800 mb-5">
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-500 text-base overflow-hidden shrink-0">
              {isUrlAvatar ? (
                <img src={currentUser.avatar} alt={currentUser?.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</div>
              <div className="text-xs text-zinc-400 truncate mt-0.5">{currentUser.email}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mb-6">
            {navLinks.map((link) => {
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`profile-nav-${link.id}`}
                  type="button"
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    active
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <i className={`fa-solid ${link.icon} text-sm w-5 text-center`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Actions */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-auto flex gap-2">
            <Button
              type="button"
              onClick={toggleQuickTheme}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              <i className={actualTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
              Theme
            </Button>
            <Button
              type="button"
              id="logoutBtn"
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-500 border border-red-500/10 dark:border-red-500/5 hover:bg-red-500/10 hover:text-red-500"
            >
              <i className="fa-solid fa-right-from-bracket" />
            </Button>
          </div>
        </aside>

        {/* Main Section Content */}
        <div className="min-w-0">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'appearance' && <AppearanceSection />}
          {activeTab === 'account' && <AccountSection />}
        </div>
      </div>
    </PageLayout>
  );
}
