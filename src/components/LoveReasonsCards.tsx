import React, { useState, useEffect } from 'react';
import { LoveReason } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, RefreshCw, Sparkles, Bookmark, Layers } from 'lucide-react';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection } from '../lib/adminDataStorage';

export const LoveReasonsCards: React.FC = () => {
  const { theme, settings } = useTheme();
  const [reasons, setReasons] = useState<LoveReason[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchReasons = async () => {
    try {
      const data = await readAdminCollection<LoveReason>(STORAGE_KEYS.reasons, '/api/reasons');
      setReasons(data);
    } catch (err) {
      console.error('Error fetching reasons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
    return subscribeToContentUpdates('reasons', fetchReasons);
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
  };

  const handleRandom = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * reasons.length);
    setCurrentIndex(randomIndex);
  };

  const currentReason = reasons[currentIndex];

  return (
    <section id="reasons" className="py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>Reasons Why I Love You</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
          Reasons My Heart Belongs To You
        </h2>
        <p className="text-base text-rose-700/80 dark:text-rose-300/80">
          Click the card to reveal why you are so deeply special to me!
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-rose-500">Loading reason cards...</div>
      ) : reasons.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No reasons added yet. Add reasons in the Master Admin panel! 💕
        </div>
      ) : (
        <div className="space-y-6">
          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer perspective-1000 max-w-xl mx-auto h-72 sm:h-80"
          >
            <div
              className={`w-full h-full relative rounded-3xl transition-transform duration-700 transform-style-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 rounded-3xl p-8 ${theme.cardBg} border-2 border-pink-300 dark:border-rose-700 flex flex-col items-center justify-between backface-hidden`}
              >
                <div className="flex items-center justify-between w-full text-xs font-bold text-rose-500">
                  <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-rose-900">
                    Reason #{currentIndex + 1} of {reasons.length}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <Heart className="w-8 h-8 fill-white animate-pulse" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-rose-950 dark:text-rose-100">
                    Why I Love You #{currentIndex + 1}
                  </p>
                  <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
                    Tap to Flip Card ✨
                  </p>
                </div>

                <div className="text-xs font-medium text-rose-400">For {settings.partner_name}</div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 rounded-3xl p-8 bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white flex flex-col items-center justify-between rotate-y-180 backface-hidden shadow-2xl border-2 border-white/20`}
              >
                <div className="flex items-center justify-between w-full text-xs font-bold text-pink-100">
                  <span>Category: {currentReason?.category || 'Sweet Things'}</span>
                  <span>Reason #{currentIndex + 1}</span>
                </div>

                <div className="space-y-4 my-auto">
                  <p className="text-xl sm:text-2xl font-serif leading-relaxed italic px-2">
                    "{currentReason?.reason}"
                  </p>
                </div>

                <div className="text-xs font-bold text-pink-200">Forever & Always ❤️</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRandom}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-rose-900/60 border border-pink-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 font-semibold text-sm shadow-sm hover:bg-pink-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-pink-500" />
              <span>Random Reason</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Next Reason</span>
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
