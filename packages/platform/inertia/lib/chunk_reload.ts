const STORAGE_KEY = 'vite_chunk_reload';

/**
 * Returns true if a chunk reload has already been attempted this session.
 * Uses sessionStorage so the guard resets when the tab is closed.
 */
export function hasReloadBeenAttempted(storage: Storage = sessionStorage): boolean {
  return storage.getItem(STORAGE_KEY) === '1';
}

/**
 * Marks that a chunk reload has been attempted so we don't loop.
 */
export function markReloadAttempted(storage: Storage = sessionStorage): void {
  storage.setItem(STORAGE_KEY, '1');
}

/**
 * Clears the reload guard. Call on successful page load so that
 * a future chunk failure (e.g. after another deploy) can still
 * trigger a reload.
 */
export function clearReloadGuard(storage: Storage = sessionStorage): void {
  storage.removeItem(STORAGE_KEY);
}

/**
 * Handles a Vite chunk preload error by reloading the page once.
 *
 * Designed to be called from the `vite:preloadError` event listener.
 * See: https://vite.dev/guide/build#load-error-handling
 * Background: https://vite.dev/guide/troubleshooting#failed-to-fetch-dynamically-imported-module-error
 *
 * - First failure: marks sessionStorage and reloads the page.
 * - Second failure (same session): does nothing — lets the error propagate
 *   so error tracking captures it as a genuine issue.
 *
 * Returns `true` if a reload was triggered, `false` otherwise.
 */
export function handleChunkLoadError(
  _error: unknown,
  {
    storage = sessionStorage,
    reload = () => window.location.reload(),
  }: {
    storage?: Storage;
    reload?: () => void;
  } = {},
): boolean {
  if (hasReloadBeenAttempted(storage)) {
    return false;
  }

  markReloadAttempted(storage);
  reload();

  return true;
}
