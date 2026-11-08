import React, { useState, useEffect } from 'react';
import { LoveReason } from '../../types';
import { Heart, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const ReasonsEditorTab: React.FC = () => {
  const [reasons, setReasons] = useState<LoveReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReason, setEditingReason] = useState<Partial<LoveReason> | null>(null);

  const fetchReasons = async () => {
    try {
      const data = await readAdminCollection<LoveReason>(STORAGE_KEYS.reasons, '/api/reasons');
      setReasons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReason) return;

    try {
      const isNew = !editingReason.id;
      await writeAdminCollection<LoveReason>(
        STORAGE_KEYS.reasons,
        '/api/reasons',
        {
          ...editingReason,
          id: editingReason.id ?? 0,
        } as LoveReason,
        isNew ? 'POST' : 'PUT',
      );

      setEditingReason(null);
      await fetchReasons();
      notifyContentUpdated('reasons');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this reason?')) return;
    try {
      await deleteAdminCollection<LoveReason>(STORAGE_KEYS.reasons, '/api/reasons', id);
      await fetchReasons();
      notifyContentUpdated('reasons');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span>Manage Reasons Why I Love You ({reasons.length})</span>
        </h3>

        <button
          onClick={() =>
            setEditingReason({
              reason: '',
              category: 'Sweet Things',
              order_index: reasons.length + 1,
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reason</span>
        </button>
      </div>

      {editingReason && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingReason.id ? 'Edit Reason' : 'Add New Reason'}
            </h4>
            <button type="button" onClick={() => setEditingReason(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Reason Text</label>
              <textarea
                rows={3}
                required
                value={editingReason.reason || ''}
                onChange={(e) => setEditingReason({ ...editingReason, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Category Tag</label>
              <input
                type="text"
                value={editingReason.category || 'Sweet Things'}
                onChange={(e) => setEditingReason({ ...editingReason, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Reason
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading reasons...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reasons.map((r, idx) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-pink-600 bg-pink-100 dark:bg-rose-900 px-2 py-0.5 rounded-full">
                  Reason #{idx + 1}
                </span>
                <p className="text-sm font-medium text-rose-900 dark:text-rose-100">{r.reason}</p>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setEditingReason(r)} className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
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
