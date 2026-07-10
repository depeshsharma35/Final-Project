import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoginHistory } from '../../utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function SecuritySection() {
  const { currentUser, userProfile, toggleSecuritySetting } = useAuth();

  const settings = userProfile?.securitySettings || { locationCheck: true, deviceCheck: true };
  const history = currentUser ? getLoginHistory(currentUser.email) : [];

  const Toggle = ({ value, onChange, id, label }) => (
    <button id={id} type="button" role="switch" aria-checked={value} aria-label={label}
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${value ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-4' : ''}`} />
    </button>
  );

  return (
    <div id="section-security" className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-zinc-100 mb-1.5">Security &amp; Verification</h1>
        <p className="text-sm text-zinc-400">
          Manage how StreamVault protects your account and verify login locations.
        </p>
      </div>

      {/* Security Status Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Account Security Status</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Adaptive security is currently active on your account.
            </p>
          </div>
          <Badge variant="success" className="px-3.5 py-1.5">
            <i className="fa-solid fa-shield-halved mr-1.5" /> Protected
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Location Verification</span>
              <Toggle id="toggleLocation" value={settings.locationCheck} onChange={() => toggleSecuritySetting?.('location')} label="Location Verification" />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Require OTP verification when signing in from a new city or state.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Device Verification</span>
              <Toggle id="toggleDevice" value={settings.deviceCheck} onChange={() => toggleSecuritySetting?.('device')} label="Device Verification" />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Require OTP verification when signing in from an unrecognized device or browser.
            </p>
          </div>
        </div>
      </Card>

      {/* Security Score Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center font-display text-xl font-bold text-green-500 shrink-0">
            85
          </div>
          <div className="flex-1 min-w-60">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1">Security Score: Strong</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Your account has adaptive security protections enabled. Enable both location and device checks for maximum protection.
            </p>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      {/* Login History */}
      <Card padding={false} className="overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Login History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[11px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800/40">
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Device</th>
                <th className="px-5 py-3.5">Theme</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody id="historyTableBody">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-xs text-zinc-400">
                    No history recorded
                  </td>
                </tr>
              ) : (
                history.map((entry, i) => {
                  const date = new Date(entry.time);
                  const timeStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                  return (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-200">{timeStr}</td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{entry.city}, {entry.state}</td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{entry.device}</td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400 capitalize">{entry.themeAtLogin || 'dark'}</td>
                      <td className="px-5 py-4">
                        {entry.otpVerified ? (
                          <Badge variant="warning">
                            <i className="fa-solid fa-key mr-1" /> OTP Verified
                          </Badge>
                        ) : (
                          <Badge variant="success">
                            <i className="fa-solid fa-check mr-1" /> Trusted
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
