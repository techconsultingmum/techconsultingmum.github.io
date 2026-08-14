import { lazy, type ComponentType } from "react";

const RELOAD_FLAG = "chunk-reload-at";

/** True when a dynamic import failed because the deployed chunk is gone/stale. */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error ?? "");
  return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk|Failed to fetch dynamically/i.test(
    message,
  );
}

/**
 * Reload the page once after a stale-chunk failure (new deploy replaced hashed
 * files while the tab was open). Guarded so we never loop.
 */
export function reloadOnceForStaleChunk(): boolean {
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_FLAG) || 0);
    if (Date.now() - last < 30_000) return false;
    window.sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    /* storage unavailable — still attempt a single reload */
  }
  window.location.reload();
  return true;
}

/**
 * lazy() with transient-failure retries. Network blips and cold CDN edges are
 * retried with backoff; a genuinely stale chunk triggers one page reload.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
) {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await factory();
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        }
      }
    }
    if (isChunkLoadError(lastError) && reloadOnceForStaleChunk()) {
      // Keep the promise pending while the page reloads.
      return new Promise<{ default: T }>(() => {});
    }
    throw lastError;
  });
}
