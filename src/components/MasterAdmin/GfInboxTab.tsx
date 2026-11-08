import React, { useState, useEffect } from 'react';
import { GfMessage } from '../../types';
import { Heart, MessageCircle, Trash2, Sparkles } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';

export const GfInboxTab: React.FC = () => {
  const [messages, setMessages] = useState<GfMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/gf-messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete message?')) return;
    try {
      await fetch(`/api/gf-messages?id=${id}`, { method: 'DELETE' });
      await fetchMessages();
      notifyContentUpdated('lovejar');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-pink-500" />
          <span>Girlfriend Love Jar Inbox ({messages.length})</span>
        </h3>
      </div>

      {loading ? (
        <div className="text-rose-500 text-sm">Loading inbox...</div>
      ) : messages.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border text-center text-rose-600">
          No notes left by your girlfriend yet! 💕
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-600">
                  <Heart className="w-3.5 h-3.5 fill-pink-500" />
                  <span>{m.sender}</span>
                  <span className="text-[10px] text-rose-400">
                    {m.created_at ? new Date(m.created_at).toLocaleString() : ''}
                  </span>
                </div>

                <p className="text-sm font-medium text-rose-900 dark:text-rose-100 italic">"{m.message}"</p>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
