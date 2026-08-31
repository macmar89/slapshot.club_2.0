'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useStandalone } from '@/hooks/use-standalone';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isIosDevice = () =>
  typeof window !== 'undefined' &&
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
  !/crios|fxios/i.test(window.navigator.userAgent);

const subscribeNoop = () => () => {};

export function usePwaInstall() {
  const isStandalone = useStandalone();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isIos = useSyncExternalStore(subscribeNoop, isIosDevice, () => false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => setDeferredPrompt(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    return outcome === 'accepted';
  }, [deferredPrompt]);

  return {
    canInstall: !isStandalone && !!deferredPrompt,
    showIosHint: !isStandalone && isIos && !deferredPrompt,
    promptInstall,
  };
}
