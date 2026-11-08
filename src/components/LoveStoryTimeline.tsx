import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, MapPin, Heart, Sparkles, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection } from '../lib/adminDataStorage';

export const LoveStoryTimeline: React.FC = () => {
  const { theme } = useTheme();
  const isMidnightTheme = theme.id === 'romantic_midnight';
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchTimeline = async () => {
    try {
      const data = await readAdminCollection<TimelineEvent>(STORAGE_KEYS.timeline, '/api/timeline');
      setEvents(data);
    } catch (err) {
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    return subscribeToContentUpdates('timeline', fetchTimeline);
  }, []);

  const eventImages = selectedEvent?.image_urls?.filter(Boolean) ?? [];
  const selectedImages = eventImages.length
    ? eventImages
    : selectedEvent?.image_url
      ? [selectedEvent.image_url]
      : [];

  const openEvent = (event: TimelineEvent) => {
    setActiveImageIndex(0);
    setSelectedEvent(event);
  };

  return (
    <section id="timeline" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Our Love Journey</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold ${isMidnightTheme ? 'text-rose-50' : 'text-rose-950 dark:text-rose-100'}`}>
          Our Special Milestones
        </h2>
        <p className={`text-base max-w-xl mx-auto ${isMidnightTheme ? 'text-rose-200/90' : 'text-rose-700/80 dark:text-rose-300/80'}`}>
          Every memory with you is standard in my heart forever.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-rose-500">Loading our magical moments...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No story milestones added yet. Add them in the Master Admin panel! 💕
        </div>
      ) : (
        <div className="relative">
          {/* Vertical Timeline center line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-pink-300 via-rose-400 to-pink-500 dark:from-rose-800 dark:to-pink-900 rounded-full" />

          <div className="space-y-8 md:space-y-12">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={event.id || index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content card */}
                  <div className="w-full md:w-1/2 px-0 md:px-6">
                    <div
                      onClick={() => openEvent(event)}
                      className={`p-6 rounded-3xl ${theme.cardBg} border cursor-pointer hover:scale-[1.02] transition-all duration-300 space-y-3 group`}
                    >
                      {(event.image_urls?.[0] || event.image_url) && (
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-3 bg-rose-100 dark:bg-rose-900">
                          <img
                            src={event.image_urls?.[0] || event.image_url}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                          />
                          <img
                            src={event.image_urls?.[0] || event.image_url}
                            alt={event.title}
                            className="relative w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-pink-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.event_date}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-rose-500/80">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-sm text-rose-800/80 dark:text-rose-200/80 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center text-xs font-bold text-pink-600 dark:text-pink-400 pt-1 group-hover:translate-x-1 transition-transform">
                        <span>Read full memory</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Center Node Heart */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white items-center justify-center shadow-lg shadow-pink-500/30 z-10 border-4 border-white dark:border-rose-950">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expanded Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-rose-950 p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-pink-200 dark:border-rose-800 shadow-2xl space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Close milestone"
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-full bg-pink-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedImages.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-rose-100 dark:bg-rose-900">
                <div
                  className="flex w-full transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {selectedImages.map((imageUrl, index) => (
                    <div key={`${imageUrl}-${index}`} className="relative h-60 w-full min-w-full shrink-0 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover blur-xl scale-110 opacity-60"
                      />
                      <img
                        src={imageUrl}
                        alt={`${selectedEvent.title} photo ${index + 1}`}
                        className="relative h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                {selectedImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => setActiveImageIndex((activeImageIndex - 1 + selectedImages.length) % selectedImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => setActiveImageIndex((activeImageIndex + 1) % selectedImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      {selectedImages.map((imageUrl, index) => (
                        <button
                          key={`${imageUrl}-dot-${index}`}
                          type="button"
                          aria-label={`Show photo ${index + 1}`}
                          aria-current={index === activeImageIndex}
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2 w-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs font-bold text-rose-500">
              <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-rose-900">{selectedEvent.event_date}</span>
              {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
            </div>

            <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">{selectedEvent.title}</h3>

            <p className="text-base text-rose-800/90 dark:text-rose-200/90 leading-relaxed whitespace-pre-line">
              {selectedEvent.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
