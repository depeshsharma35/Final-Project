// Unified helpers (Task 5 + Task 6 merged)
import { TZ_LOCATION_MAP } from '../data/mockDb';
import { AVATAR_COLORS, ABUSIVE } from '../data/comments';

// ── Task 5: IST Time & Location ──

export function getISTTime() {
  const now = new Date();
  const istStr = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istStr);
  return {
    hours: istDate.getHours(),
    minutes: istDate.getMinutes(),
    seconds: istDate.getSeconds(),
    full: istDate,
    formatted: istDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
    dateFormatted: istDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })
  };
}

export function getAutoTheme() {
  const ist = getISTTime();
  if (ist.hours >= 10 && ist.hours < 12) return 'light';
  return 'dark';
}

export function detectLocation() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (TZ_LOCATION_MAP[tz]) return TZ_LOCATION_MAP[tz];
  const parts = tz.split('/');
  const city = (parts[parts.length - 1] || 'Unknown').replace(/_/g, ' ');
  return { city, state: 'Unknown', country: 'Unknown Region' };
}

export function detectDevice() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh/i.test(ua)) os = 'Mac';
  else if (/iPhone/i.test(ua)) os = 'iPhone';
  else if (/iPad/i.test(ua)) os = 'iPad';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const versionMatch = ua.match(/(Edg|Chrome|Firefox|Safari|OPR)\/(\d+)/);
  const version = versionMatch ? versionMatch[2] : '';

  return {
    browser,
    os,
    version,
    full: `${os} — ${browser}${version ? ' ' + version : ''}`,
    fingerprint: `${os}-${browser}-${window.screen.width}x${window.screen.height}`
  };
}

export function getUserProfile(email) {
  try {
    const data = localStorage.getItem('sv_profile_' + email);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function saveUserProfile(email, profile) {
  try {
    localStorage.setItem('sv_profile_' + email, JSON.stringify(profile));
  } catch (e) { console.warn('Could not save profile:', e); }
}

export function getLoginHistory(email) {
  try {
    const data = localStorage.getItem('sv_history_' + email);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addLoginHistory(email, entry) {
  const history = getLoginHistory(email);
  history.unshift(entry);
  if (history.length > 20) history.length = 20;
  try {
    localStorage.setItem('sv_history_' + email, JSON.stringify(history));
  } catch (e) { console.warn('Could not save history:', e); }
}

export function needsOTPVerification(email, location, device) {
  const profile = getUserProfile(email);
  if (!profile) return { needed: true, reason: 'First-time login from this account' };

  const reasons = [];
  const settings = profile.securitySettings || { locationCheck: true, deviceCheck: true };

  if (settings.locationCheck) {
    if (profile.lastCity && profile.lastCity.toLowerCase() !== location.city.toLowerCase()) {
      reasons.push(`New city detected: ${location.city} (previous: ${profile.lastCity})`);
    }
    if (profile.lastState && profile.lastState.toLowerCase() !== location.state.toLowerCase()) {
      reasons.push(`New state detected: ${location.state} (previous: ${profile.lastState})`);
    }
  }

  if (settings.deviceCheck) {
    if (profile.lastDeviceFingerprint && profile.lastDeviceFingerprint !== device.fingerprint) {
      reasons.push(`New device detected: ${device.os} — ${device.browser}`);
    }
  }

  if (reasons.length > 0) return { needed: true, reason: reasons.join('. ') + '.' };
  return { needed: false, reason: '' };
}

// ── Task 6: Comment Utilities ──

export function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function initials(name) {
  if (!name) return '??';
  const cjk = name.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/);
  if (cjk) return name.substring(0, 2);
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + ' min ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd ago';
  return Math.floor(days / 30) + 'mo ago';
}

// ── Shared Formatters ──

export function formatFileSize(mb) {
  if (!mb) return '0 MB';
  return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB';
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
