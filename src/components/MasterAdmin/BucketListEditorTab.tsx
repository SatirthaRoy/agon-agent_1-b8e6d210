import React, { useState, useEffect } from 'react';
import { BucketItem } from '../../types';
import { Compass, Plus, Trash2, Edit2, X } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const BucketListEditorTab: React.FC = () => {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<BucketItem> | null>(null);

  const fetchBucketList = async () => {
    try {
      const data = await readAdminCollection<BucketItem>(STORAGE_KEYS.bucketlist, '/api/bucketlist');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const isNew = !editingItem.id;
      await writeAdminCollection<BucketItem>(
        STORAGE_KEYS.bucketlist,
        '/api/bucketlist',
        {
          ...editingItem,
          id: editingItem.id ?? 0,
        } as BucketItem,
        isNew ? 'POST' : 'PUT',
      );

      setEditingItem(null);
      await fetchBucketList();
      notifyContentUpdated('bucketlist');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete bucket list dream?')) return;
    try {
      await deleteAdminCollection<BucketItem>(STORAGE_KEYS.bucketlist, '/api/bucketlist', id);
      await fetchBucketList();
      notifyContentUpdated('bucketlist');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-tab-heading flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-pink-500" />
          <span>Manage Couple Bucket List ({items.length})</span>
        </h3>

        <button
          onClick={() =>
            setEditingItem({
              title: '',
              category: 'Travel & Trips',
              completed: false,
              completed_date: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Future Dream</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingItem.id ? 'Edit Bucket Item' : 'Add Bucket Item'}
            </h4>
            <button type="button" onClick={() => setEditingItem(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Dream Title</label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Category</label>
              <input
                type="text"
                value={editingItem.category || 'Travel'}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-200">
              <input
                type="checkbox"
                checked={editingItem.completed || false}
                onChange={(e) => {
                  const completed = e.target.checked;
                  setEditingItem({
                    ...editingItem,
                    completed,
                    completed_date: completed
                      ? editingItem.completed_date || new Date().toISOString().split('T')[0]
                      : '',
                  });
                }}
                className="w-4 h-4 rounded text-pink-500"
              />
              Mark as completed
            </label>

            {editingItem.completed && (
              <div className="space-y-1">
                <label htmlFor="bucket-completed-date" className="text-xs font-semibold">Completed date</label>
                <input
                  id="bucket-completed-date"
                  type="date"
                  required
                  value={editingItem.completed_date || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, completed_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
                />
              </div>
            )}
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Bucket Item
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading bucket list...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-bold text-sm text-rose-950 dark:text-rose-100">{i.title}</h4>
                <span className="text-[11px] text-pink-600 font-semibold">{i.category}</span>
                {i.completed && (
                  <span className="block text-[11px] text-emerald-600 font-semibold">
                    Completed {i.completed_date || '(date not set)'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setEditingItem(i)} className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(i.id)} className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
