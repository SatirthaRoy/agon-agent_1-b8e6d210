import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Sparkles, Stars, Gift, Calendar, ArrowDown } from 'lucide-react';
import { HeartPlushieCanvas } from './3d/HeartPlushieCanvas';

export const HeroSection: React.FC = () => {
  const { settings, theme } = useTheme();

  const handleScrollToTimeline = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#timeline');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="relative min-h-[85vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 overflow-hidden text-center">
      {/* Background Floating Hearts Particle Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-pink-300/30 dark:bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Ambient floating heart icons */}
        <div className="absolute top-20 left-[10%] text-pink-300/60 dark:text-rose-500/40 animate-bounce" style={{ animationDuration: '4s' }}>
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <div className="absolute top-40 right-[12%] text-rose-400/50 dark:text-pink-400/30 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>
          <Heart className="w-12 h-12 fill-current" />
        </div>
        <div className="absolute bottom-32 left-[15%] text-pink-400/40 dark:text-purple-400/30 animate-bounce" style={{ animationDuration: '6s', animationDelay: '0.8s' }}>
          <Sparkles className="w-7 h-7" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-rose-950/80 backdrop-blur-md border border-pink-200/80 dark:border-rose-800 shadow-md text-sm font-semibold text-rose-600 dark:text-pink-300">
          <Stars className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Made Especially For You, {settings.partner_name} 💕</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 dark:from-pink-300 dark:via-rose-200 dark:to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
            {settings.hero_title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl font-medium text-rose-800/90 dark:text-rose-200/90 leading-relaxed">
          "{settings.hero_subtitle}"
        </p>

        {/* Quote pill */}
        {settings.romantic_quote && (
          <div className="inline-block px-6 py-2.5 rounded-2xl bg-white/60 dark:bg-rose-900/40 backdrop-blur-sm border border-pink-200/50 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 italic text-sm sm:text-base font-serif shadow-sm">
            ✨ {settings.romantic_quote} ✨
          </div>
        )}

        {/* 3D Heart Plushie Interactive Scene */}
        {settings.enabled_components.plushie && (
          <div className="pt-2">
            <HeartPlushieCanvas partnerName={settings.partner_name} />
          </div>
        )}

        {/* Scroll CTA */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <a
            href="#timeline"
            onClick={handleScrollToTimeline}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Explore Our Journey</span>
          </a>
          <a
            href="#timeline"
            onClick={handleScrollToTimeline}
            className="text-rose-500 dark:text-rose-400 animate-bounce mt-2 p-1"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
