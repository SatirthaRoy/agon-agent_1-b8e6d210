import React, { useState, useEffect } from 'react';
import { GalleryMemory } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Image, Heart, Star, Sparkles, X, ZoomIn } from 'lucide-react';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection } from '../lib/adminDataStorage';

export const MemoryGallery: React.FC = () => {
  const { theme } = useTheme();
  const [memories, setMemories] = useState<GalleryMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<GalleryMemory | null>(null);
  const [filterFav, setFilterFav] = useState(false);

  const fetchMemories = async () => {
    try {
      const data = await readAdminCollection<GalleryMemory>(STORAGE_KEYS.gallery, '/api/gallery');
      setMemories(data);
    } catch (err) {
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
    return subscribeToContentUpdates('gallery', fetchMemories);
  }, []);

  const displayedMemories = filterFav ? memories.filter((m) => m.is_favorite) : memories;

  return (
    <section id="gallery" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-center md:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Image className="w-3.5 h-3.5 text-pink-500" />
            <span>Memory Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
            Snapshots of Our Love
          </h2>
        </div>

        {/* Filter Favorites toggle */}
        <button
          onClick={() => setFilterFav(!filterFav)}
          className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold border transition-all ${
            filterFav
              ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
              : 'bg-white/80 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 border-pink-200 dark:border-rose-800'
          }`}
        >
          <Star className={`w-4 h-4 ${filterFav ? 'fill-white' : 'text-amber-500'}`} />
          <span>{filterFav ? 'Showing Favorites ⭐' : 'Show Favorites Only'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-rose-500">Loading photo memories...</div>
      ) : displayedMemories.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No photo memories found. Add photo memories in the Master Admin panel! 💕
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setActivePhoto(mem)}
              className={`group relative rounded-3xl overflow-hidden ${theme.cardBg} border cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="aspect-4/3 w-full overflow-hidden relative">
                <img
                  src={mem.image_url}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white flex items-center justify-between w-full">
                    <span className="text-xs font-medium">Click to view</span>
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                {mem.is_favorite && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-500/90 text-white shadow-md">
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-500">
                  <span>{mem.date_taken || 'Special Day'}</span>
                </div>
                <h3 className="font-bold text-base text-rose-950 dark:text-rose-100 line-clamp-1">
                  {mem.title}
                </h3>
                {mem.caption && (
                  <p className="text-xs text-rose-700/80 dark:text-rose-300/80 line-clamp-2">
                    {mem.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-rose-950 p-6 rounded-3xl max-w-2xl w-full border border-pink-200 dark:border-rose-800 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.image_url}
              alt={activePhoto.title}
              className="w-full max-h-[60vh] object-contain rounded-2xl"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-500">
                <span>{activePhoto.date_taken}</span>
                {activePhoto.is_favorite && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> Favorite Memory
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">{activePhoto.title}</h3>

              {activePhoto.caption && (
                <p className="text-sm text-rose-800/90 dark:text-rose-200/90 leading-relaxed italic">
                  "{activePhoto.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
