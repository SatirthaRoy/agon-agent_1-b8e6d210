import React, { useState, useEffect } from 'react';
import { GfMessage } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Send, MessageCircle, Sparkles, Smile, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeToContentUpdates } from '../lib/contentEvents';

export const LoveJarBoard: React.FC = () => {
  const { theme, settings } = useTheme();
  const [messages, setMessages] = useState<GfMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState(settings.partner_name);
  const [selectedSentiment, setSelectedSentiment] = useState('heart');
  const [submitting, setSubmitting] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/gf-messages', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching GF messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    return subscribeToContentUpdates('lovejar', fetchMessages);
  }, []);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/gf-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: senderName || settings.partner_name,
          message: newMessage,
          sentiment: selectedSentiment,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to post GF message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="lovejar" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>Interactive Love Jar & Notes</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
          Leave a Note in Our Love Jar
        </h2>
        <p className="text-base text-rose-700/80 dark:text-rose-300/80 max-w-xl mx-auto">
          {settings.partner_name}, leave cute messages or quick sweet thoughts for {settings.user_name} here!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form: Drop a Note */}
        <div className="md:col-span-5">
          <form
            onSubmit={handleSubmitMessage}
            className={`p-6 rounded-3xl ${theme.cardBg} border space-y-4 shadow-xl`}
          >
            <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Drop a Note for {settings.user_name}</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold text-rose-900 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Your Note / Kiss</label>
              <textarea
                rows={3}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Write something sweet for ${settings.user_name}...`}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm text-rose-900 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Sentiment Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Emotion Badge</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'heart', label: '❤️ Love' },
                  { id: 'kiss', label: '💋 Kiss' },
                  { id: 'hug', label: '🤗 Hug' },
                  { id: 'smile', label: '😊 Smile' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSentiment(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedSentiment === s.id
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-white/80 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 border-pink-200 dark:border-rose-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Drop in Love Jar'}</span>
            </button>
          </form>
        </div>

        {/* Right Messages Display */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-500" />
            <span>Love Jar Messages</span>
          </h3>

          {messages.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-center text-rose-600">
              The Love Jar is waiting for its first note! Leave a cute message on the left! 💕
            </div>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl ${theme.cardBg} border space-y-2 shadow-sm transform hover:scale-[1.01] transition-transform`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-rose-500">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{m.sender}</span>
                    </span>
                    <span className="text-[10px] text-rose-400">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-rose-900 dark:text-rose-100 leading-relaxed italic">
                    "{m.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
