import React, { useState, useEffect } from 'react';
import { LoveNote } from '../../types';
import { Mail, Plus, Trash2, Edit2, Save, X, Lock } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const NotesEditorTab: React.FC = () => {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Partial<LoveNote> | null>(null);

  const fetchNotes = async () => {
    try {
      const data = await readAdminCollection<LoveNote>(STORAGE_KEYS.notes, '/api/notes');
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const isNew = !editingNote.id;
      await writeAdminCollection<LoveNote>(
        STORAGE_KEYS.notes,
        '/api/notes',
        {
          ...editingNote,
          id: editingNote.id ?? 0,
        } as LoveNote,
        isNew ? 'POST' : 'PUT',
      );

      setEditingNote(null);
      await fetchNotes();
      notifyContentUpdated('notes');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete love note?')) return;
    try {
      await deleteAdminCollection<LoveNote>(STORAGE_KEYS.notes, '/api/notes', id);
      await fetchNotes();
      notifyContentUpdated('notes');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Mail className="w-5 h-5 text-pink-500" />
          <span>Manage Secret Love Letters ({notes.length})</span>
        </h3>

        <button
          onClick={() =>
            setEditingNote({
              title: '',
              content: '',
              is_secret: true,
              unlock_code: 'LOVE',
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write Love Letter</span>
        </button>
      </div>

      {editingNote && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingNote.id ? 'Edit Love Letter' : 'Write New Love Letter'}
            </h4>
            <button type="button" onClick={() => setEditingNote(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Letter Title</label>
              <input
                type="text"
                required
                value={editingNote.title || ''}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Letter Content</label>
              <textarea
                rows={6}
                required
                value={editingNote.content || ''}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm font-serif"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={editingNote.is_secret || false}
                  onChange={(e) => setEditingNote({ ...editingNote, is_secret: e.target.checked })}
                  className="w-4 h-4 text-pink-500 rounded"
                />
                <span>Lock with Passcode 🔒</span>
              </label>

              {editingNote.is_secret && (
                <input
                  type="text"
                  placeholder="Unlock code (e.g. LOVE)"
                  value={editingNote.unlock_code || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, unlock_code: e.target.value })}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-rose-950 border text-xs font-bold uppercase"
                />
              )}
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Letter
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading love notes...</div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-base text-rose-950 dark:text-rose-100 flex items-center gap-2">
                  <span>{n.title}</span>
                  {n.is_secret && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                </h4>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 line-clamp-1">{n.content}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setEditingNote(n)} className="p-2 rounded-lg bg-pink-100 text-pink-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
