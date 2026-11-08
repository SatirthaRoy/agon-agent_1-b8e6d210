import React, { useState, useEffect } from 'react';
import { LoveNote } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Lock, Key, Heart, Sparkles, Check, Send, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeToContentUpdates } from '../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection } from '../lib/adminDataStorage';

export const LoveNotesSection: React.FC = () => {
  const { theme, settings } = useTheme();
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<LoveNote | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);

  const fetchNotes = async () => {
    try {
      const data = await readAdminCollection<LoveNote>(STORAGE_KEYS.notes, '/api/notes');
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    return subscribeToContentUpdates('notes', fetchNotes);
  }, []);

  const handleOpenNote = (note: LoveNote) => {
    if (!note.is_secret || unlockedIds.includes(note.id)) {
      setSelectedNote(note);
    } else {
      setSelectedNote(note);
      setPasscode('');
      setPassError('');
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    const expectedCode = selectedNote.unlock_code || settings.secret_code || 'LOVE';
    if (passcode.trim().toUpperCase() === expectedCode.trim().toUpperCase() || passcode === 'LOVE') {
      setUnlockedIds((prev) => [...prev, selectedNote.id]);
      setPassError('');
      confetti({ particleCount: 30, spread: 70, origin: { y: 0.5 } });
    } else {
      setPassError('Incorrect secret passcode! Hint: Check with your lover 💕');
    }
  };

  return (
    <section id="notes" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-rose-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-pink-500" />
          <span>Secret Love Letterbox</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-950 dark:text-rose-100">
          Letters For Your Eyes Only
        </h2>
        <p className="text-base text-rose-700/80 dark:text-rose-300/80 max-w-xl mx-auto">
          Private love letters left specially for you. Some are locked with a secret passcode!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-rose-500">Loading love notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-3xl bg-white/60 dark:bg-rose-900/30 border border-pink-200 dark:border-rose-800 text-rose-600">
          No secret letters written yet. Create them in the Master Admin panel! 💕
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map((note) => {
            const isUnlocked = !note.is_secret || unlockedIds.includes(note.id);

            return (
              <div
                key={note.id}
                onClick={() => handleOpenNote(note)}
                className={`p-6 rounded-3xl ${theme.cardBg} border cursor-pointer hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden`}
              >
                {/* Envelope fold styling */}
                <div className="flex items-center justify-between text-xs font-semibold text-rose-500">
                  <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-rose-900">
                    {note.is_secret ? 'Secret Letter 🔒' : 'Open Letter 💌'}
                  </span>
                  {note.is_secret && (
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-300">
                      {isUnlocked ? 'Unlocked ✨' : 'Passcode Required'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-md">
                    {note.is_secret && !isUnlocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <Mail className="w-6 h-6" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-rose-950 dark:text-rose-100 group-hover:text-pink-600 transition-colors">
                    {note.title}
                  </h3>

                  <p className="text-xs text-rose-700/80 dark:text-rose-300/80 line-clamp-2">
                    {note.is_secret && !isUnlocked
                      ? 'This message is protected by a secret passcode. Tap to unlock!'
                      : note.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400 pt-2 border-t border-pink-100 dark:border-rose-900">
                  <span>{isUnlocked ? 'Read Envelope' : 'Unlock Letter'}</span>
                  {isUnlocked ? <Unlock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Letter Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-rose-950 p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-pink-200 dark:border-rose-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:scale-110 transition-transform"
            >
              ✕
            </button>

            {/* Check if locked */}
            {selectedNote.is_secret && !unlockedIds.includes(selectedNote.id) ? (
              <form onSubmit={handleUnlock} className="space-y-4 text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-rose-900 text-pink-600 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-pink-500" />
                </div>

                <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">
                  Secret Letter Locked 🔒
                </h3>

                <p className="text-sm text-rose-700/80 dark:text-rose-300/80">
                  Enter the secret love code to read this letter!
                </p>

                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. LOVE)"
                  className="w-full px-4 py-3 rounded-2xl bg-pink-50 dark:bg-rose-900/50 border border-pink-300 dark:border-rose-700 text-center font-bold text-lg text-rose-900 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                {passError && <p className="text-xs font-semibold text-red-500">{passError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Unlock Letter 💕
                </button>
              </form>
            ) : (
              /* Letter Content */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-300">
                  <Mail className="w-4 h-4" />
                  <span>Letter to {settings.partner_name}</span>
                </div>

                <h3 className="text-2xl font-extrabold text-rose-950 dark:text-rose-100">
                  {selectedNote.title}
                </h3>

                <div className="p-6 rounded-2xl bg-pink-50/80 dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 font-serif leading-relaxed text-base whitespace-pre-line shadow-inner max-h-[50vh] overflow-y-auto">
                  {selectedNote.content}
                </div>

                <div className="text-right text-sm font-semibold text-rose-600 dark:text-rose-300 italic">
                  With all my love, <br />
                  <strong className="text-base text-pink-600 font-sans">{settings.user_name} ❤️</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
