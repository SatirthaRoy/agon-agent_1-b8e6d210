export type PersistedItem = { id?: number };

export const STORAGE_KEYS = {
  timeline: 'love-story-timeline',
  reasons: 'love-story-reasons',
  gallery: 'love-story-gallery',
  notes: 'love-story-notes',
  bucketlist: 'love-story-bucketlist',
  quiz: 'love-story-quiz',
} as const;

export function createLocalStorageAdapter<T extends PersistedItem>(storageKey: string) {
  const getStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if ('localStorage' in globalThis && globalThis.localStorage) return globalThis.localStorage;
    return null;
  };

  const read = (): T[] => {
    const storage = getStorage();
    if (!storage) return [];

    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const write = (items: T[]) => {
    const storage = getStorage();
    if (!storage) return items;

    try {
      storage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore quota or storage errors and keep the in-memory state working.
    }

    return items;
  };

  return {
    get: read,
    set: write,
    upsert: (item: T) => {
      const current = read();
      const next = { ...item };

      if (typeof next.id !== 'number' || next.id <= 0) {
        const highestId = current.reduce((max, entry) => Math.max(max, Number(entry.id || 0)), 0);
        next.id = highestId + 1;
      }

      const updated = current.some((entry) => entry.id === next.id)
        ? current.map((entry) => (entry.id === next.id ? { ...entry, ...next } : entry))
        : [...current, next];

      return write(updated);
    },
    remove: (id: number) => write(read().filter((entry) => entry.id !== id)),
  };
}

export async function readAdminCollection<T extends PersistedItem>(storageKey: string, endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const storage = createLocalStorageAdapter<T>(storageKey);
        const localItems = storage.get();
        if (data.length || !localItems.length) storage.set(data);
        else return localItems;
        return data;
      }
    }
  } catch {
    // Fallback to localStorage when the remote API is unavailable.
  }

  return createLocalStorageAdapter<T>(storageKey).get();
}

export async function writeAdminCollection<T extends PersistedItem>(storageKey: string, endpoint: string, item: T, method: 'POST' | 'PUT'): Promise<T> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  } catch {
    const saved = createLocalStorageAdapter<T>(storageKey).upsert(item);
    return saved[saved.length - 1];
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Save failed (${response.status}).`);
  }

  const data = await response.json();
  if (!data || typeof data !== 'object') throw new Error('The server returned an invalid save response.');
  createLocalStorageAdapter<T>(storageKey).upsert(data);
  return data;
}

export async function deleteAdminCollection<T extends PersistedItem>(storageKey: string, endpoint: string, id: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
  } catch {
    createLocalStorageAdapter<T>(storageKey).remove(id);
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Delete failed (${response.status}).`);
  }
  createLocalStorageAdapter<T>(storageKey).remove(id);
}
