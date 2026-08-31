'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function ServiceWorkerRegister() {
  const t = useTranslations('PWA.update');

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => void registration.unregister());
      });
      return;
    }

    let isReloading = false;

    const handleControllerChange = () => {
      if (isReloading) return;
      isReloading = true;
      window.location.reload();
    };

    const promptUpdate = (worker: ServiceWorker) => {
      toast(t('title'), {
        description: t('description'),
        duration: Infinity,
        action: {
          label: t('action'),
          onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }),
        },
      });
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          promptUpdate(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              promptUpdate(installing);
            }
          });
        });
      })
      .catch(() => undefined);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [t]);

  return null;
}
