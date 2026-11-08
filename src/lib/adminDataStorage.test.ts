import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocalStorageAdapter } from './adminDataStorage.ts';

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };
};

test('stores and reads admin data through the local fallback adapter', () => {
  const storage = createMemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });

  const adapter = createLocalStorageAdapter<{ id?: number; title: string }>('test-items');
  const initial = [{ id: 1, title: 'A dream' }];

  adapter.set(initial);
  assert.deepEqual(adapter.get(), initial);

  const updated = adapter.upsert({ id: 2, title: 'Another dream' });
  assert.equal(updated.length, 2);
  assert.equal(adapter.get()[1].title, 'Another dream');

  const third = adapter.upsert({ id: 0, title: 'A third dream' });
  assert.equal(third.length, 3);
  assert.equal(third[2].id, 3);

  const removed = adapter.remove(1);
  assert.equal(removed.length, 2);
  assert.equal(adapter.get()[0].id, 2);
});
