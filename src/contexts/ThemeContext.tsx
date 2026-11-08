import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';

export interface ThemeConfig {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  primaryGradient: string;
  textPrimary: string;
  textSecondary: string;
  accentGlow: string;
  heartColor: string;
  badgeBg: string;
  borderStyle: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  lovely_pink: {
    id: 'lovely_pink',
    name: 'Lovely Pink Gradient 🌸',
    bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 dark:from-rose-950 dark:via-pink-900 dark:to-purple-950',
    cardBg: 'bg-white/70 dark:bg-rose-900/40 backdrop-blur-md border border-pink-200/60 dark:border-rose-700/40 shadow-xl shadow-pink-500/5',
    primaryGradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600',
    textPrimary: 'text-rose-950 dark:text-rose-100',
    textSecondary: 'text-rose-700/80 dark:text-rose-300/80',
    accentGlow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    heartColor: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-200 border border-pink-300/50',
    borderStyle: 'border-pink-200 dark:border-rose-800',
  },
  rose_gold: {
    id: 'rose_gold',
    name: 'Rose & Champagne Gold ✨',
    bgGradient: 'bg-gradient-to-br from-amber-50 via-rose-100 to-pink-100 dark:from-stone-900 dark:via-rose-950 dark:to-amber-950',
    cardBg: 'bg-white/80 dark:bg-stone-900/60 backdrop-blur-md border border-amber-200/70 dark:border-amber-700/40 shadow-xl shadow-amber-500/5',
    primaryGradient: 'bg-gradient-to-r from-rose-400 via-amber-500 to-rose-500',
    textPrimary: 'text-amber-950 dark:text-amber-100',
    textSecondary: 'text-amber-800/80 dark:text-amber-300/80',
    accentGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    heartColor: '#f43f5e',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300/60',
    borderStyle: 'border-amber-200 dark:border-amber-800',
  },
  pastel_sunset: {
    id: 'pastel_sunset',
    name: 'Pastel Sunset Romance 🌅',
    bgGradient: 'bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950',
    cardBg: 'bg-white/75 dark:bg-purple-900/30 backdrop-blur-md border border-purple-200/60 dark:border-purple-700/40 shadow-xl shadow-purple-500/5',
    primaryGradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
    textPrimary: 'text-purple-950 dark:text-purple-100',
    textSecondary: 'text-purple-700/80 dark:text-purple-300/80',
    accentGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]',
    heartColor: '#d946ef',
    badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-300/50',
    borderStyle: 'border-purple-200 dark:border-purple-800',
  },
  romantic_midnight: {
    id: 'romantic_midnight',
    name: 'Midnight Starlight 🌙',
    bgGradient: 'bg-gradient-to-br from-red-500 via-pink-200 to-pink-950',
    cardBg: 'bg-slate-900/80 backdrop-blur-md border border-rose-800/50 shadow-2xl shadow-rose-900/20',
    primaryGradient: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500',
    textPrimary: 'text-rose-100',
    textSecondary: 'text-rose-300/80',
    accentGlow: 'shadow-[0_0_30px_rgba(244,63,94,0.5)]',
    heartColor: '#f43f5e',
    badgeBg: 'bg-rose-950/80 text-rose-200 border border-rose-700/60',
    borderStyle: 'border-rose-900',
  },
  lavender_blush: {
    id: 'lavender_blush',
    name: 'Lavender Blossom 💜',
    bgGradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900',
    cardBg: 'bg-white/80 dark:bg-indigo-900/40 backdrop-blur-md border border-purple-200/70 dark:border-indigo-700/40 shadow-xl shadow-purple-500/5',
    primaryGradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
    textPrimary: 'text-indigo-950 dark:text-purple-100',
    textSecondary: 'text-indigo-700/80 dark:text-indigo-300/80',
    accentGlow: 'shadow-[0_0_30px_rgba(99,102,241,0.35)]',
    heartColor: '#818cf8',
    badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-200 border border-indigo-300/50',
    borderStyle: 'border-indigo-200 dark:border-indigo-800',
  },
};


export const DEFAULT_SETTINGS: SiteSettings = {
  partner_name: 'My Princess',
  user_name: 'Your Handsome',
  hero_title: 'To My One and Only Love',
  hero_subtitle: 'Every single second with you feels like a beautiful dream.',
  romantic_quote: 'You are my today and all of my tomorrows.',
  anniversary_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  theme_id: 'lovely_pink',
  primary_color: '#ec4899',
  secret_code: 'LOVE',
  bg_music_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  enabled_components: {
    hero: true,
    plushie: true,
    countdown: true,
    timeline: true,
    reasons: true,
    gallery: true,
    notes: true,
    bucketlist: true,
    quiz: true,
    lovejar: true,
    music: true,
  },
  section_order: [
    'hero',
    'plushie',
    'countdown',
    'timeline',
    'reasons',
    'gallery',
    'notes',
    'bucketlist',
    'quiz',
    'lovejar',
  ],
};

interface ThemeContextType {
  settings: SiteSettings;
  theme: ThemeConfig;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
  refetchSettings: () => Promise<void>;
}

const STORAGE_KEY = 'love-story-site-settings';

const readStoredSettings = (): SiteSettings | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const ThemeContext = createContext<ThemeContextType>({
  settings: DEFAULT_SETTINGS,
  theme: THEMES.lovely_pink,
  updateSettings: async () => {},
  loading: true,
  refetchSettings: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && data.partner_name) {
          const merged = {
            ...DEFAULT_SETTINGS,
            ...data,
            enabled_components: {
              ...DEFAULT_SETTINGS.enabled_components,
              ...(data.enabled_components || {}),
            },
            section_order: data.section_order || DEFAULT_SETTINGS.section_order,
          };

          setSettings(merged);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load settings from API:', err);
    }

    const stored = readStoredSettings();
    if (stored) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...stored,
        enabled_components: {
          ...DEFAULT_SETTINGS.enabled_components,
          ...(stored.enabled_components || {}),
        },
        section_order: stored.section_order || DEFAULT_SETTINGS.section_order,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const stored = readStoredSettings();
    if (stored) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...stored,
        enabled_components: {
          ...DEFAULT_SETTINGS.enabled_components,
          ...(stored.enabled_components || {}),
        },
        section_order: stored.section_order || DEFAULT_SETTINGS.section_order,
      });
    }

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const currentTheme = THEMES[settings.theme_id] || THEMES.lovely_pink;

  return (
    <ThemeContext.Provider
      value={{
        settings,
        theme: currentTheme,
        updateSettings,
        loading,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
