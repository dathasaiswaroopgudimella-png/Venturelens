"use client";

import { useEffect } from "react";

// Bump this to match CACHE_VERSION in ventureStore.ts
const CACHE_VERSION = "v3";

/**
 * Runs once on first page load and nukes all VentureLens localStorage entries
 * that were saved by an older scoring engine version. This prevents stale
 * cached reports (e.g., a nonsense idea that scored 48/100 under the old engine)
 * from appearing in the UI.
 */
export function CacheBuster() {
  useEffect(() => {
    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key === "latest_venturelens_report" || key.startsWith("venturelens_report_")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.engineVersion !== CACHE_VERSION) {
                keysToDelete.push(key);
              }
            } catch {
              keysToDelete.push(key);
            }
          }
        }
      }
      if (keysToDelete.length > 0) {
        console.info(`[CacheBuster] Removing ${keysToDelete.length} stale VentureLens reports (engine v${CACHE_VERSION})`);
        keysToDelete.forEach((k) => localStorage.removeItem(k));
      }
    } catch (e) {
      // Silent — localStorage may be unavailable
    }
  }, []);

  return null;
}
