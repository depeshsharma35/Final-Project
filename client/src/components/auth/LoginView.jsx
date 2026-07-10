import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getISTTime, getAutoTheme } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function LoginView() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpMethod, setOtpMethod] = useState('email');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [istTime, setIstTime] = useState('--:--:-- AM');

  const { handleLogin, handleSignup } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const tick = () => setIstTime(getISTTime().formatted);
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const fillDemo = (e, p) => {
    setMode('signin'); setEmail(e); setPassword(p);
    showToast('Demo credentials filled', 'info', 2000);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (mode === 'signin') handleLogin(email, password, setLoading);
    else handleSignup({ name, emailInput: email, passwordInput: password, phone, otpMethod }, setLoading);
  };

  const switchMode = (m) => { setMode(m); setEmail(''); setPassword(''); setName(''); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center gap-16 justify-center">

        {/* Brand panel */}
        <div className="flex-1 max-w-sm w-full text-center lg:text-left">
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <i className="fa-solid fa-play text-black text-sm ml-0.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">StreamVault</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            Your Stream.<br />
            <span className="text-amber-500">Your Control.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
            Watch parties, offline downloads, multilingual comments, subscription tiers — all in one place.
          </p>

          <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3">
            <i className="fa-regular fa-clock text-amber-500 text-sm" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-0.5">IST Time</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{istTime}</div>
            </div>
          </div>

          <ul className="hidden lg:flex flex-col gap-3 mt-8">
            {[
              ['fa-shield-halved', 'Secure OTP Authentication'],
              ['fa-users', 'Real-time Watch Parties'],
              ['fa-download', 'Offline Downloads'],
            ].map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${icon} text-amber-500 text-xs`} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth card */}
        <div className="flex-1 max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-950/50">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-6 border border-zinc-200 dark:border-zinc-700">
            {['signin', 'signup'].map(m => (
              <button key={m} type="button" onClick={() => switchMode(m)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m ? 'bg-amber-500 text-black shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-5">
            {mode === 'signin' ? 'Access your StreamVault account' : 'Create a new StreamVault account'}
          </p>

          {/* Demo pills */}
          {mode === 'signin' && (
            <div className="flex gap-2 mb-5 flex-wrap">
              <button id="demo-btn-1" type="button" onClick={() => fillDemo('demo@nexus.io', 'Demo@2024')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-200">
                <i className="fa-solid fa-user-tie text-xs" /> Admin Demo
              </button>
              <button id="demo-btn-2" type="button" onClick={() => fillDemo('sarah@nexus.io', 'Sarah@2024')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all duration-200">
                <i className="fa-solid fa-user text-xs" /> User Demo
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <Input id="signup-name" type="text" label="Full Name" placeholder="Alex Johnson" value={name}
                onChange={e => setName(e.target.value)} icon={<i className="fa-regular fa-user" />} required />
            )}

            <Input id="login-email" type="email" label="Email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} autoComplete="email"
              icon={<i className="fa-regular fa-envelope" />} required />

            <Input id="login-password" type={showPw ? 'text' : 'password'} label="Password"
              placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" icon={<i className="fa-solid fa-lock" />}
              rightElement={
                <button type="button" onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                  <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              } required />

            {mode === 'signup' && (
              <>
                <Input id="signup-phone" type="tel" label="Phone (Optional)" placeholder="+1 (555) 000-0000"
                  value={phone} onChange={e => setPhone(e.target.value)} icon={<i className="fa-solid fa-phone" />} />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Verify Account Via</span>
                  <div className="flex gap-4">
                    {[['email', 'Email OTP', 'fa-envelope'], ['sms', 'SMS OTP', 'fa-comment-sms']].map(([v, l, ic]) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                        <input type="radio" name="otpMethod" checked={otpMethod === v} onChange={() => setOtpMethod(v)} className="accent-amber-500" />
                        <i className={`fa-solid ${ic} text-xs`} />{l}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button id="login-submit-btn" type="submit" variant="primary" size="lg" className="w-full mt-1" loading={loading} disabled={loading}>
              {!loading && <i className={`fa-solid ${mode === 'signin' ? 'fa-right-to-bracket' : 'fa-user-plus'}`} />}
              {loading ? (mode === 'signin' ? 'Signing In...' : 'Sending OTP...') : (mode === 'signin' ? 'Sign In' : 'Create Account & Send OTP')}
            </Button>
          </form>

          <div className="mt-5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info text-blue-500 text-sm mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {mode === 'signin' ? 'Secure OTP verification sent to your registered contact.' : 'New account requires email/SMS OTP verification.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
