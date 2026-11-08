import React, { useState, useEffect } from 'react';
import { BucketItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, Circle, Sparkles, Compass, Plus, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection } from '../lib/adminDataStorage';

export const BucketListSection: React.FC = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');

  const fetchBucketList = async () => {
    try {
      const data = await readAdminCollection<BucketItem>(STORAGE_KEYS.bucketlist, '/api/bucketlist');
      setItems(data);
    } catch (err) {
      console.error('Error fetching bucket list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketList();
    return subscribeToContentUpdates('bucketlist', fetchBucketList);
  }, []);

  const toggleComplete = async (item: BucketItem) => {
    if (!isAdmin) return;

    const updated = {
      ...item,
      completed: !item.completed,
      completed_date: !item.completed ? new Date().toISOString().split('T')[0] : undefined,
    };

    try {
      await writeAdminCollection<BucketItem>(STORAGE_KEYS.bucketlist, '/api/bucketlist', updated, 'PUT');
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      if (!item.completed) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to update bucket item:', err);
    }
  };

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Travel')))];
  const filteredItems = selectedCat === 'All' ? items : items.filter((i) => i.category === selectedCat);

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <section id="bucketlist" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-pink-500" />
          <span>Our Future Dreams</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
          Our Couple Bucket List
        </h2>
        <p className="text-base text-rose-700/80 dark:text-rose-300/80 max-w-xl mx-auto">
          Adventures, trips, and memories we plan to create together forever!
        </p>
        {!isAdmin && (
          <p className="text-xs font-semibold text-rose-500/80">
            Only the site admin can mark dreams as completed.
          </p>
        )}

        {/* Progress Bar */}
        <div className="max-w-md mx-auto pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-200 mb-1">
            <span>Completed Dreams ({completedCount}/{items.length})</span>
            <span className="text-pink-600 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-pink-100 dark:bg-rose-900/60 rounded-full overflow-hidden p-0.5 border border-pink-200 dark:border-rose-800">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              selectedCat === cat
                ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                : 'bg-white/80 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 border-pink-200 dark:border-rose-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-rose-500">Loading our bucket list...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No dreams listed in this category yet. Add them in the Master Admin panel! 💕
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={isAdmin ? () => toggleComplete(item) : undefined}
              onKeyDown={isAdmin ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  void toggleComplete(item);
                }
              } : undefined}
              role={isAdmin ? 'button' : undefined}
              tabIndex={isAdmin ? 0 : undefined}
              className={`p-4 rounded-2xl ${theme.cardBg} border ${isAdmin ? 'cursor-pointer hover:scale-[1.02]' : ''} flex items-center justify-between gap-4 transition-all duration-300 ${
                item.completed ? 'opacity-80' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-rose-500">
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-pink-500 fill-pink-100 dark:fill-pink-900" />
                  ) : (
                    <Circle className="w-6 h-6 text-rose-300 dark:text-rose-700" />
                  )}
                </span>

                <div>
                  <h4
                    className={`font-bold text-base text-rose-950 dark:text-rose-100 ${
                      item.completed ? 'line-through text-rose-500/70' : ''
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-rose-500/80">
                    Category: {item.category || 'Adventure'}
                  </span>
                </div>
              </div>

              {item.completed && item.completed_date && (
                <div className="text-[10px] font-bold text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-rose-900/80 px-2 py-1 rounded-full whitespace-nowrap">
                  Done {item.completed_date} 🎉
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
