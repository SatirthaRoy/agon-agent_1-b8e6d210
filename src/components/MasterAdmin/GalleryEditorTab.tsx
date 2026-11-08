import React, { useState, useEffect } from 'react';
import { GalleryMemory } from '../../types';
import { Image, Plus, Trash2, Edit2, Save, X, Star } from 'lucide-react';
import { notifyContentUpdated } from '../../lib/contentEvents';
import { STORAGE_KEYS, readAdminCollection, writeAdminCollection, deleteAdminCollection } from '../../lib/adminDataStorage';

export const GalleryEditorTab: React.FC = () => {
  const [memories, setMemories] = useState<GalleryMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<Partial<GalleryMemory> | null>(null);

  const fetchGallery = async () => {
    try {
      const data = await readAdminCollection<GalleryMemory>(STORAGE_KEYS.gallery, '/api/gallery');
      setMemories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const isNew = !editingPhoto.id;
      await writeAdminCollection<GalleryMemory>(
        STORAGE_KEYS.gallery,
        '/api/gallery',
        {
          ...editingPhoto,
          id: editingPhoto.id ?? 0,
        } as GalleryMemory,
        isNew ? 'POST' : 'PUT',
      );

      setEditingPhoto(null);
      await fetchGallery();
      notifyContentUpdated('gallery');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete photo memory?')) return;
    try {
      await deleteAdminCollection<GalleryMemory>(STORAGE_KEYS.gallery, '/api/gallery', id);
      await fetchGallery();
      notifyContentUpdated('gallery');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Image className="w-5 h-5 text-pink-500" />
          <span>Manage Memory Gallery Photos ({memories.length})</span>
        </h3>

        <button
          onClick={() =>
            setEditingPhoto({
              title: '',
              caption: '',
              image_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
              date_taken: new Date().toISOString().split('T')[0],
              is_favorite: false,
              order_index: memories.length + 1,
            })
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo Memory</span>
        </button>
      </div>

      {editingPhoto && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-pink-50/80 dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-rose-950 dark:text-rose-100">
              {editingPhoto.id ? 'Edit Photo' : 'Add New Photo'}
            </h4>
            <button type="button" onClick={() => setEditingPhoto(null)}>
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Title</label>
              <input
                type="text"
                required
                value={editingPhoto.title || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Date Taken</label>
              <input
                type="text"
                value={editingPhoto.date_taken || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, date_taken: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold">Photo Image URL</label>
              <input
                type="text"
                required
                value={editingPhoto.image_url || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, image_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold">Caption / Story</label>
              <textarea
                rows={2}
                value={editingPhoto.caption || ''}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-rose-950 border text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_favorite"
                checked={editingPhoto.is_favorite || false}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, is_favorite: e.target.checked })}
                className="w-4 h-4 text-pink-500 rounded"
              />
              <label htmlFor="is_favorite" className="text-xs font-bold text-rose-800">
                Mark as Favorite Memory ⭐
              </label>
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md">
            Save Photo Memory
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-rose-500 text-sm">Loading gallery...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-white dark:bg-rose-900/40 border border-pink-200 dark:border-rose-800 space-y-2"
            >
              <img src={m.image_url} alt={m.title} className="w-full h-36 object-cover rounded-xl" />
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-rose-950 dark:text-rose-100 truncate">{m.title}</h4>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingPhoto(m)} className="p-1 rounded bg-pink-100 text-pink-700">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1 rounded bg-rose-100 text-rose-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
