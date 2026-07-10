// Content moderation utilities (from Task 6)
import { ABUSIVE } from '../data/comments';

function normalizeWord(w) {
  return w.toLowerCase().replace(/[^a-z]/g, '');
}

export function checkAbusive(text) {
  const words = text.split(/\s+/);
  for (const w of words) {
    const nw = normalizeWord(w);
    if (ABUSIVE.includes(nw)) return true;
    const stripped = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (ABUSIVE.includes(stripped) && stripped.length > 2) return true;
  }
  return false;
}

export function checkSpam(text) {
  if (/(www\.|https?:\/\/|\.(com|net|org)\/)/.test(text)) return true;
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  const freq = {};
  for (const w of words) { freq[w] = (freq[w] || 0) + 1; if (freq[w] >= 3) return true; }
  const alpha = text.replace(/[^a-zA-Z]/g, '');
  if (alpha.length > 15) {
    const upper = alpha.replace(/[a-z]/g, '').length;
    if (upper / alpha.length > 0.7) return true;
  }
  if (text.length > 30 && !/\s/.test(text)) return true;
  return false;
}

export function checkSpecialChars(text) {
  if (/[^a-zA-Z0-9\s]{4,}/.test(text)) return true;
  const special = text.replace(/[a-zA-Z0-9\s]/g, '').length;
  if (text.length > 10 && special / text.length > 0.4) return true;
  return false;
}

export function moderate(text) {
  if (checkAbusive(text)) return 'Your comment contains abusive language and cannot be posted. Please keep the discussion respectful.';
  if (checkSpam(text)) return 'Your comment appears to be spam. Links, repeated text, and excessive capitalization are not allowed.';
  if (checkSpecialChars(text)) return 'Your comment contains too many special characters. Please write in plain text.';
  return null;
}
