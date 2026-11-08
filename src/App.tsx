import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AnniversaryCountdown } from './components/AnniversaryCountdown';
import { LoveStoryTimeline } from './components/LoveStoryTimeline';
import { LoveReasonsCards } from './components/LoveReasonsCards';
import { MemoryGallery } from './components/MemoryGallery';
import { LoveNotesSection } from './components/LoveNotesSection';
import { BucketListSection } from './components/BucketListSection';
import { CouplesQuiz } from './components/CouplesQuiz';
import { LoveJarBoard } from './components/LoveJarBoard';
import { AudioPlayer } from './components/AudioPlayer';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/MasterAdmin/AdminLoginModal';
import { AdminDashboard } from './components/MasterAdmin/AdminDashboard';
import { handleGoogleRedirect } from './lib/googleAuth';

// Trigger google redirect handler
handleGoogleRedirect();

const AppContent: React.FC = () => {
  const { theme, settings, loading } = useTheme();
  const { isAdmin } = useAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 dark:bg-rose-950 text-pink-600 font-bold">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center text-xl shadow-lg">
            ❤️
          </div>
          <span>Opening Our Romantic World...</span>
        </div>
      </div>
    );
  }

  // Component Map for customizable ordering
  const componentMap: Record<string, React.ReactNode> = {
    hero: settings.enabled_components.hero ? <HeroSection key="hero" /> : null,
    countdown: settings.enabled_components.countdown ? <AnniversaryCountdown key="countdown" /> : null,
    timeline: settings.enabled_components.timeline ? <LoveStoryTimeline key="timeline" /> : null,
    reasons: settings.enabled_components.reasons ? <LoveReasonsCards key="reasons" /> : null,
    gallery: settings.enabled_components.gallery ? <MemoryGallery key="gallery" /> : null,
    notes: settings.enabled_components.notes ? <LoveNotesSection key="notes" /> : null,
    bucketlist: settings.enabled_components.bucketlist ? <BucketListSection key="bucketlist" /> : null,
    quiz: settings.enabled_components.quiz ? <CouplesQuiz key="quiz" /> : null,
    lovejar: settings.enabled_components.lovejar ? <LoveJarBoard key="lovejar" /> : null,
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgGradient} ${theme.textPrimary} transition-colors duration-500 selection:bg-pink-400 selection:text-white`}>
      {/* Navigation */}
      <Navbar
        onOpenAdminLogin={handleOpenAdmin}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={() => setIsPlayingMusic(!isPlayingMusic)}
      />

      {/* Main Dynamic Sections */}
      <main className="space-y-4">
        {settings.section_order.map((key) => componentMap[key] || null)}
      </main>

      {/* Music Player Floating */}
      <AudioPlayer isPlaying={isPlayingMusic} onTogglePlay={() => setIsPlayingMusic(!isPlayingMusic)} />

      {/* Footer */}
      <Footer onOpenAdminLogin={handleOpenAdmin} />

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {(isAdminDashboardOpen || (isAdmin && isAdminDashboardOpen)) && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
