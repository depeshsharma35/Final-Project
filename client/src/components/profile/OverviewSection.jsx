import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getISTTime, getLoginHistory, detectLocation, detectDevice } from '../../utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function OverviewSection() {
  const { currentUser } = useAuth();
  const { themePref, actualTheme } = useTheme();
  const [istTime, setIstTime] = useState(getISTTime());

  const location = detectLocation();
  const device = detectDevice();

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTime(getISTTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let greeting = 'Evening';
  if (istTime.hours < 12) greeting = 'Morning';
  else if (istTime.hours < 17) greeting = 'Afternoon';

  const firstName = currentUser?.name?.split(' ')[0] || 'User';

  return (
    <div id="section-overview" className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-zinc-100 mb-1.5">
          Good <span id="greeting">{greeting}</span>, <span id="dashName">{firstName}</span>
        </h1>
        <p className="text-sm text-zinc-400">Here's your account and security overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Theme stat */}
        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <i className="fa-solid fa-palette text-amber-500 text-lg" />
            </div>
            <Badge variant="success">
              <i className="fa-solid fa-circle text-[6px] mr-1" /> Active
            </Badge>
          </div>
          <div className="text-xs text-zinc-400 mb-1">Current Theme</div>
          <div id="statTheme" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 capitalize">
            {actualTheme}
          </div>
          <div id="statThemeSource" className="text-[11px] text-zinc-500 mt-1">
            {themePref === 'auto' ? 'Auto-selected by IST timing' : 'Manually selected preference'}
          </div>
        </Card>

        {/* Location stat */}
        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <i className="fa-solid fa-location-dot text-blue-500 text-lg" />
            </div>
            <Badge variant="success">
              <i className="fa-solid fa-check mr-1" /> Verified
            </Badge>
          </div>
          <div className="text-xs text-zinc-400 mb-1">Current Location</div>
          <div id="statLocation" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {location.city}, {location.state}
          </div>
          <div id="statCountry" className="text-[11px] text-zinc-500 mt-1">
            {location.country}
          </div>
        </Card>

        {/* Active Device */}
        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <i className="fa-solid fa-laptop text-purple-500 text-lg" />
            </div>
            <Badge variant="info">
              <i className="fa-solid fa-shield-halved mr-1" /> Trusted
            </Badge>
          </div>
          <div className="text-xs text-zinc-400 mb-1">Active Device</div>
          <div id="statDevice" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {device.os}
          </div>
          <div id="statBrowser" className="text-[11px] text-zinc-500 mt-1 truncate">
            {device.browser} {device.version}
          </div>
        </Card>

        {/* IST Time */}
        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <i className="fa-solid fa-clock text-green-500 text-lg" />
            </div>
            <Badge variant="accent">IST</Badge>
          </div>
          <div className="text-xs text-zinc-400 mb-1">Indian Standard Time</div>
          <div id="statIST" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {istTime.formatted}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {istTime.dateFormatted}
          </div>
        </Card>
      </div>

      {/* Adaptive Security Alert */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-shield text-amber-500 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Adaptive Security Active</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Your session is actively monitored for location and device anomalies.</p>
          </div>
        </div>
        <Badge variant="success" className="px-3.5 py-1.5 self-start sm:self-auto shrink-0">
          <i className="fa-solid fa-check-circle mr-1.5" /> Secure Session
        </Badge>
      </div>
    </div>
  );
}
