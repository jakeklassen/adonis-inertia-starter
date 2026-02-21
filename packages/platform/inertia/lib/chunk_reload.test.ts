import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearReloadGuard,
  handleChunkLoadError,
  hasReloadBeenAttempted,
  markReloadAttempted,
} from './chunk_reload';

/**
 * Minimal in-memory Storage stub so tests don't depend on a browser environment.
 */
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(_index: number) {
      return null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('chunk_reload', () => {
  let storage: Storage;

  afterEach(() => {
    storage = createMemoryStorage();
  });

  // -- low-level helpers --

  describe('hasReloadBeenAttempted', () => {
    it('returns false when nothing is stored', () => {
      storage = createMemoryStorage();
      expect(hasReloadBeenAttempted(storage)).toBe(false);
    });

    it('returns true after markReloadAttempted', () => {
      storage = createMemoryStorage();
      markReloadAttempted(storage);
      expect(hasReloadBeenAttempted(storage)).toBe(true);
    });
  });

  describe('clearReloadGuard', () => {
    it('resets the flag so a future reload can be attempted', () => {
      storage = createMemoryStorage();
      markReloadAttempted(storage);
      clearReloadGuard(storage);
      expect(hasReloadBeenAttempted(storage)).toBe(false);
    });
  });

  // -- main handler --

  describe('handleChunkLoadError', () => {
    it('triggers a reload on first failure', () => {
      storage = createMemoryStorage();
      const reload = vi.fn();
      const error = new Error('Failed to fetch dynamically imported module');

      const result = handleChunkLoadError(error, { storage, reload });

      expect(result).toBe(true);
      expect(reload).toHaveBeenCalledOnce();
    });

    it('does not reload on second failure (same session)', () => {
      storage = createMemoryStorage();
      const reload = vi.fn();
      const error = new Error('Failed to fetch dynamically imported module');

      handleChunkLoadError(error, { storage, reload });
      reload.mockClear();

      const result = handleChunkLoadError(error, { storage, reload });

      expect(result).toBe(false);
      expect(reload).not.toHaveBeenCalled();
    });

    it('reloads again after the guard is cleared', () => {
      storage = createMemoryStorage();
      const reload = vi.fn();
      const error = new Error('Failed to fetch dynamically imported module');

      handleChunkLoadError(error, { storage, reload });
      clearReloadGuard(storage);
      reload.mockClear();

      const result = handleChunkLoadError(error, { storage, reload });

      expect(result).toBe(true);
      expect(reload).toHaveBeenCalledOnce();
    });

    it('sets the storage flag before reloading', () => {
      storage = createMemoryStorage();
      const reload = vi.fn(() => {
        // At the point of reload, the flag should already be set
        expect(hasReloadBeenAttempted(storage)).toBe(true);
      });

      handleChunkLoadError(new Error('chunk error'), { storage, reload });

      expect(reload).toHaveBeenCalledOnce();
    });
  });
});
