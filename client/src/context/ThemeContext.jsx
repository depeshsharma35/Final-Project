import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAutoTheme } from '../utils/helpers';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themePref, setThemePrefState] = useState(() => {
    try { return localStorage.getItem('sv_theme') || 'dark'; } catch { return 'dark'; }
  });

  const resolveTheme = (pref) => pref === 'auto' ? getAutoTheme() : pref;
  const actualTheme = resolveTheme(themePref);

  // Apply dark class to <html> for Tailwind dark: variant
  useEffect(() => {
    const html = document.documentElement;
    if (actualTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    // keep data-theme for any legacy usage
    html.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  const setThemePref = useCallback((pref) => {
    setThemePrefState(pref);
    try { localStorage.setItem('sv_theme', pref); } catch { /* ignore */ }
    const resolved = resolveTheme(pref);
    const html = document.documentElement;
    if (resolved === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('data-theme', resolved);
  }, []);

  return (
    <ThemeContext.Provider value={{ themePref, actualTheme, setThemePref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
