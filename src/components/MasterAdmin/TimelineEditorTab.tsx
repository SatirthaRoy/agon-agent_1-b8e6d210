import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../../types';
import { Calendar, Plus, Trash2, Edit2, X } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const TimelineEditorTab: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      const data = await readAdminCollection<TimelineEvent>(STORAGE_KEYS.timeline, '/api/timeline');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSaveError(null);

    try {
      const isNew = !editingEvent.id;
      const imageUrls = (editingEvent.image_urls || [])
        .map((url) => url.trim())
        .filter(Boolean);
      const saved = await writeAdminCollection<TimelineEvent>(
        STORAGE_KEYS.timeline,
        '/api/timeline',
        {
          ...editingEvent,
          image_url: imageUrls[0] || '',
          image_urls: imageUrls,
          id: editingEvent.id ?? 0,
        } as TimelineEvent,
        isNew ? 'POST' : 'PUT',
      );

      if (!saved) {
        setSaveError('Failed to save milestone.');
        return;
      }

      setEditingEvent(null);
      await fetchTimeline();
      notifyContentUpdated('timeline');
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Something went wrong while saving the milestone.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory milestone?')) return;
    try {
      await deleteAdminCollection<TimelineEvent>(STORAGE_KEYS.timeline, '/api/timeline', id);
      await fetchTimeline();
      notifyContentUpdated('timeline');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-tab-heading flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-pink-500" />
          <span>Manage Love Story Milestones</span>
        </h3>

        <button
          onClick={() =>
            setEditingEvent({
              title: '',
              event_date: new Date().toISOString().split('T')[0],
              description: '',
              location: '',
              image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
              image_urls: ['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'],
              order_index: events.length + 1,
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Milestone</span>
        </button>
      </div>

      {editingEvent && (
        <form onSubmit={handleSaveEvent} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingEvent.id ? 'Edit Milestone' : 'Add New Milestone'}
            </h4>
            <button type="button" onClick={() => setEditingEvent(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          {saveError && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Title</label>
              <input
                type="text"
                required
                value={editingEvent.title || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Date</label>
              <input
                type="text"
                required
                placeholder="e.g. October 14, 2024"
                value={editingEvent.event_date || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Location (Optional)</label>
              <input
                type="text"
                value={editingEvent.location || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold">Photo Image URLs (one per line)</label>
              <textarea
                rows={3}
                placeholder="Paste one image URL per line"
                value={(editingEvent.image_urls?.length
                  ? editingEvent.image_urls
                  : editingEvent.image_url
                    ? [editingEvent.image_url]
                    : []).join('\n')}
                onChange={(e) => {
                  const imageUrls = e.target.value.split('\n');
                  setEditingEvent({ ...editingEvent, image_urls: imageUrls, image_url: imageUrls[0] || '' });
                }}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold">Memory Story Description</label>
              <textarea
                rows={3}
                required
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Milestone
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading milestones...</div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {(ev.image_urls?.[0] || ev.image_url) && (
                  <img src={ev.image_urls?.[0] || ev.image_url} alt={ev.title} className="w-14 h-14 rounded-xl object-contain bg-black/5" />
                )}
                <div>
                  <h4 className="font-bold text-base text-rose-950 dark:text-rose-100">{ev.title}</h4>
                  <span className="text-xs text-pink-600 font-semibold">{ev.event_date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingEvent(ev)}
                  className="p-2 rounded-lg bg-pink-100 text-pink-700 hover:scale-105"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:scale-105"
                >
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
