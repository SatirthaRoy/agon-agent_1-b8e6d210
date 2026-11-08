import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Clock, Calendar, Heart, Sparkles, Flame } from 'lucide-react';

export const AnniversaryCountdown: React.FC = () => {
  const { settings, theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDaysTogether: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const anniversary = new Date(settings.anniversary_date);
      const now = new Date();

      // Total days since start date
      const diffSinceStart = Math.max(0, now.getTime() - anniversary.getTime());
      const totalDays = Math.floor(diffSinceStart / (1000 * 60 * 60 * 24));

      // Calculate next anniversary
      const nextAnniversary = new Date(anniversary);
      nextAnniversary.setFullYear(now.getFullYear());
      if (now > nextAnniversary) {
        nextAnniversary.setFullYear(now.getFullYear() + 1);
      }

      const diffToNext = nextAnniversary.getTime() - now.getTime();

      const days = Math.floor(diffToNext / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffToNext / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffToNext / 1000 / 60) % 60);
      const seconds = Math.floor((diffToNext / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalDaysTogether: totalDays,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.anniversary_date]);

  const startDateFormatted = new Date(settings.anniversary_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <div className={`p-8 rounded-3xl ${theme.cardBg} border shadow-2xl relative overflow-hidden text-center`}>
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-400/20 blur-2xl rounded-full" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-rose-200 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Days of Pure Happiness</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-950 dark:text-rose-100">
            Together For <span className="text-pink-600 dark:text-pink-400">{timeLeft.totalDaysTogether}</span> Beautiful Days
          </h2>

          <p className="text-sm sm:text-base text-rose-700/80 dark:text-rose-300/80 max-w-xl mx-auto">
            Since our official love story began on <strong className="text-rose-900 dark:text-rose-100">{startDateFormatted}</strong>, every second has been a blessing.
          </p>

          {/* Countdown Grid */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-4">
              Countdown to Our Next Anniversary
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-rose-950/70 border border-pink-200 dark:border-rose-800 shadow-sm flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-pink-400 font-mono">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-rose-700/70 dark:text-rose-300/70 mt-1 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
