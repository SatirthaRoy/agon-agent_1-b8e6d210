import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Lock, Music, Sparkles, Volume2, VolumeX, Settings, Compass, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin, isPlayingMusic, onToggleMusic }) => {
  const { settings, theme } = useTheme();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Our Story', href: '#timeline', enabled: settings.enabled_components.timeline },
    { label: 'Reasons', href: '#reasons', enabled: settings.enabled_components.reasons },
    { label: 'Gallery', href: '#gallery', enabled: settings.enabled_components.gallery },
    { label: 'Love Letters', href: '#notes', enabled: settings.enabled_components.notes },
    { label: 'Bucket List', href: '#bucketlist', enabled: settings.enabled_components.bucketlist },
    { label: 'Quiz', href: '#quiz', enabled: settings.enabled_components.quiz },
    { label: 'Love Jar', href: '#lovejar', enabled: settings.enabled_components.lovejar },
  ].filter((link) => link.enabled);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/60 dark:bg-rose-950/60 border-b border-pink-200/50 dark:border-rose-900/50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 dark:from-pink-300 dark:to-rose-200 bg-clip-text text-transparent">
                {settings.partner_name} & {settings.user_name}
              </span>
              <span className="block text-[10px] font-medium text-rose-500/80 dark:text-rose-300/80 -mt-1 tracking-wider uppercase">
                Our Love Story
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-rose-900/80 dark:text-rose-200 hover:text-pink-600 dark:hover:text-pink-300 transition-colors py-1 px-2 rounded-lg hover:bg-pink-50 dark:hover:bg-rose-900/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Music Toggle */}
            {settings.enabled_components.music && (
              <button
                onClick={onToggleMusic}
                title={isPlayingMusic ? 'Mute romantic music' : 'Play romantic music'}
                className={`p-2 rounded-xl transition-all duration-300 border ${
                  isPlayingMusic
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20 animate-pulse'
                    : 'bg-white/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-pink-50'
                }`}
              >
                {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {/* Master Admin Button */}
            <button
              onClick={onOpenAdminLogin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAdmin
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-white/80 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 border-pink-200 dark:border-rose-800 hover:border-pink-400'
              }`}
            >
              {isAdmin ? (
                <>
                  <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Master Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Customize Site</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-rose-700 dark:text-rose-200 bg-white/80 dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-rose-950/95 backdrop-blur-2xl border-b border-pink-200 dark:border-rose-900 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-rose-900 dark:text-rose-100 hover:bg-pink-100 dark:hover:bg-rose-900/60"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
