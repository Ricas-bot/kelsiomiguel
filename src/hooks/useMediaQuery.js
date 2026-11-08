"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query without hydration mismatches.
 * The server snapshot (and therefore the first client render) uses
 * `serverFallback`; the real value is applied right after hydration.
 */
export function useMediaQuery(query, serverFallback = false) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}
