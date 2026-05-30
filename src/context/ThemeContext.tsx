import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { COLOR_PRESETS, type ColorPreset } from '../theme/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  colorPreset: ColorPreset;
  setMode: (mode: ThemeMode) => void;
  setColorPreset: (preset: ColorPreset) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyColorPreset(preset: ColorPreset) {
  const colors = COLOR_PRESETS[preset];
  const root = document.documentElement;
  root.style.setProperty('--color-primary',      colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-primary-light', colors.primaryLight);
  root.style.setProperty('--color-primary-muted', colors.primaryMuted);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const s = localStorage.getItem('hrms_theme') as ThemeMode | null;
    return s ?? 'dark';
  });

  const [colorPreset, setColorPresetState] = useState<ColorPreset>(() => {
    const s = localStorage.getItem('hrms_color') as ColorPreset | null;
    return s && s in COLOR_PRESETS ? s : 'blue';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolved: 'light' | 'dark' = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  }, [resolved]);

  useEffect(() => {
    applyColorPreset(colorPreset);
  }, [colorPreset]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem('hrms_theme', m);
  }, []);

  const setColorPreset = useCallback((p: ColorPreset) => {
    setColorPresetState(p);
    localStorage.setItem('hrms_color', p);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, colorPreset, setMode, setColorPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}