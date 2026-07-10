import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { detectLocation, detectDevice } from '../../utils/helpers';
import { USER_DB } from '../../data/mockDb';
import { api } from '../../utils/api';
import Button from '../ui/Button';

export default function OtpView() {
  const { pendingLoginData, setPendingLoginData, otpReason, currentOTP, completeLogin, setActiveView } = useAuth();
  const { showToast } = useToast();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef([]);

  useEffect(() => { showToast('📬 Verification code sent to your registered contact.', 'info', 6000); }, []);
  useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[idx] = val.slice(-1); setDigits(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (p.length === 6) { setDigits(p.split('')); refs.current[5]?.focus(); }
  };

  const verify = async () => {
    const entered = digits.join('');
    if (entered.length !== 6) { showToast('Enter all 6 digits', 'warning'); return; }
    setLoading(true);
    const location = detectLocation(); const device = detectDevice();
    const { email, user, isSignup, signupData } = pendingLoginData;
    const res = await api.post('/auth/verify-otp', { email, otp: entered, location, device, isSignup, signupData });
    setLoading(false);
    if (res?.status === 'success') { completeLogin(email, res.user, location, device, true, res.user); setPendingLoginData(null); return; }
    if (res?.status === 'error') { showToast(res.message || 'Incorrect OTP', 'error'); return; }
    const target = pendingLoginData.offlineOtp || currentOTP;
    if (entered !== target) { showToast('Incorrect OTP. Please try again.', 'error'); return; }
    if (isSignup && signupData) USER_DB[email] = signupData;
    completeLogin(email, user, location, device, true); setPendingLoginData(null);
  };

  const resend = async () => {
    setCooldown(30); setDigits(['', '', '', '', '', '']); refs.current[0]?.focus();
    const res = await api.post('/auth/resend-otp', { email: pendingLoginData?.email });
    if (res?.status === 'success') { showToast('📬 New code sent.', 'success', 5000); return; }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    if (pendingLoginData) pendingLoginData.offlineOtp = otp;
    showToast('📬 New code sent.', 'success', 5000);
  };

  const user = pendingLoginData?.user;
  const method = user?.otpMethod === 'sms' ? 'SMS' : 'Email';
  const dest = user?.otpMethod === 'sms' ? (user?.phone || '+XX XXXXXX') : pendingLoginData?.email;
  const complete = digits.every(d => d !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl shadow-zinc-900/10 dark:shadow-zinc-950/50">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
            <i className="fa-solid fa-shield-halved text-2xl text-amber-500" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {pendingLoginData?.isSignup ? 'Verify New Account' : 'Verify Identity'}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-1">{otpReason} Code sent via {method}:</p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6">{dest}</p>

          {/* OTP inputs */}
          <div className="flex gap-2.5 justify-center mb-6" role="group" aria-label="Verification code">
            {digits.map((d, i) => (
              <input key={i} id={`otp-digit-${i}`} ref={el => { refs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)} onPaste={handlePaste}
                autoComplete="off" aria-label={`Digit ${i + 1}`}
                className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200
                  bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                  focus:outline-none focus:ring-0 focus:border-amber-500
                  ${d ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}
                `}
              />
            ))}
          </div>

          <Button id="otp-verify-btn" variant="primary" size="lg" className="w-full mb-3"
            onClick={verify} loading={loading} disabled={loading || !complete}>
            {!loading && <i className="fa-solid fa-check-circle" />}
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <div className="flex items-center justify-between">
            <Button id="otp-resend-btn" variant="ghost" size="sm" onClick={resend} disabled={cooldown > 0}>
              <i className="fa-solid fa-rotate-right text-xs" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </Button>
            <Button id="otp-back-btn" variant="ghost" size="sm" onClick={() => setActiveView('login')}>
              <i className="fa-solid fa-arrow-left text-xs" /> Back
            </Button>
          </div>

          {/* Progress dots */}
          <div className="mt-6 flex gap-1.5">
            {digits.map((d, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-200 ${d ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
