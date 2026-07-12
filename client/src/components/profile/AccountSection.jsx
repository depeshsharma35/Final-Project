import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const inputCls = 'w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50';

export default function AccountSection() {
  const { currentUser, userProfile, updateProfile, handleLogout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpMethod, setOtpMethod] = useState('email');

  useEffect(() => {
    if (currentUser) {
      setName(userProfile?.name || currentUser.name || '');
      setPhone(userProfile?.phone || currentUser.phone || '');
      setOtpMethod(userProfile?.otpMethod || currentUser.otpMethod || 'email');
    }
  }, [currentUser, userProfile]);

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile?.(name, phone, otpMethod);
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    try {
      localStorage.removeItem('sv_history_' + currentUser.email);
      showToast('Login history has been cleared', 'info');
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      showToast('Error clearing history', 'error');
    }
  };

  const handleResetData = () => {
    if (!currentUser) return;
    try {
      localStorage.removeItem('sv_profile_' + currentUser.email);
      localStorage.removeItem('sv_history_' + currentUser.email);
      showToast('All custom profile data reset. Signing out...', 'warning');
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } catch {
      showToast('Error resetting data', 'error');
    }
  };

  if (!currentUser) return null;

  return (
    <div id="section-account" className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-zinc-100 mb-1.5 font-display">Account Settings</h1>
        <p className="text-sm text-zinc-400">
          Update your personal details, preferred OTP delivery method, and manage stored data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <Card>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-5">Personal Information</h3>

          <form id="profileForm" onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="profileName" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="profilePhone" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                id="profilePhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="profileEmail" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="profileEmail"
                disabled
                value={currentUser.email}
                className={`${inputCls} opacity-60 cursor-not-allowed`}
              />
            </div>

            <div>
              <label htmlFor="profileOtpMethod" className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Preferred OTP Method
              </label>
              <select
                id="profileOtpMethod"
                value={otpMethod}
                onChange={(e) => setOtpMethod(e.target.value)}
                className={inputCls}
              >
                <option value="email">Email Notification</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="mt-2 self-start"
            >
              <i className="fa-solid fa-floppy-disk" /> Save Changes
            </Button>
          </form>
        </Card>

        {/* Data & Storage / Danger Zone */}
        <Card>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-5">Data &amp; Storage</h3>

          <div className="flex flex-col gap-5">
            <div>
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">Local Data Storage</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                StreamVault uses your browser's localStorage to persist theme preferences, custom security settings, and login history logs.
              </p>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 mt-2">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
                Danger Zone
              </h4>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  id="clearHistoryBtn"
                  onClick={handleClearHistory}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-semibold transition-all bg-transparent focus:outline-none"
                >
                  <i className="fa-solid fa-trash" /> Clear Login History
                </button>
                <button
                  type="button"
                  id="resetAllDataBtn"
                  onClick={handleResetData}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-semibold transition-all bg-transparent focus:outline-none"
                >
                  <i className="fa-solid fa-rotate-left" /> Reset All Stored Data
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
