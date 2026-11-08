import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { settings } = useTheme();

  return (
    <footer className="py-12 px-4 border-t border-pink-200/60 dark:border-rose-900/60 text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
        <span className="text-base font-bold text-rose-950 dark:text-rose-100">
          {settings.partner_name} & {settings.user_name}
        </span>
      </div>

      <p className="text-xs text-rose-700/80 dark:text-rose-300/80 max-w-sm mx-auto">
        Crafted with infinite love and sweet memories. You are my forever & always. 💕
      </p>

      <div className="pt-2">
        <button
          onClick={onOpenAdminLogin}
          className="text-[11px] font-semibold text-rose-500 hover:text-pink-600 dark:text-rose-400 underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
        >
          Master Login / Customize Website
        </button>
      </div>
    </footer>
  );
};
