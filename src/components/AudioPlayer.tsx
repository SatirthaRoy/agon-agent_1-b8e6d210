import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Pause, Music, Volume2, VolumeX, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onTogglePlay }) => {
  const { settings } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Autoplay blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, settings.bg_music_url]);

  if (!settings.enabled_components.music) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio
        ref={audioRef}
        src={settings.bg_music_url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'}
        loop
      />

      <button
        onClick={onTogglePlay}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-xl backdrop-blur-xl transition-all duration-300 ${
          isPlaying
            ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30 animate-pulse'
            : 'bg-white/90 dark:bg-rose-950/90 text-rose-700 dark:text-rose-200 border-pink-200 dark:border-rose-800'
        }`}
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        <span className="text-xs font-bold">{isPlaying ? 'Romantic Melody' : 'Play Music'}</span>
        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-rose-600" />}
      </button>
    </div>
  );
};
