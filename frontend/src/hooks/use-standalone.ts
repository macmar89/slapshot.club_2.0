'use client';

import { useSyncExternalStore } from 'react';

/**
 * Hook to detect if the application is running in standalone mode (PWA).
 * Uses useSyncExternalStore for efficient React state synchronization and SSR safety.
 */
export function useStandalone() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};

      const mediaQuery = window.matchMedia('(display-mode: standalone)');

      // We listen for changes in the display-mode media query
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(callback);
        return () => mediaQuery.removeListener(callback);
      }
    },
    () => {
      // Snapshot of the current state
      if (typeof window === 'undefined') return false;

      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = (window.navigator as any).standalone === true;

      return isStandaloneMode || isIosStandalone;
    },
    () => false, // Server-side fallback value
  );
}
