'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { handleGetMe } from '@/features/auth/auth.api';
import { usePathname } from '@/i18n/routing';
import { consumeSessionExpiredFlag, isPublicPath } from '@/lib/session';

const RESUME_REVALIDATE_AFTER_MS = 30_000;

export const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const t = useTranslations('Auth');

  useEffect(() => {
    if (!consumeSessionExpiredFlag()) return;

    toast.error(t('session_expired_title'), {
      description: t('session_expired_description'),
    });
  }, [t]);

  useEffect(() => {
    if (isPublicPath(pathname)) return;

    handleGetMe();

    let hiddenAt: number | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
        return;
      }

      if (hiddenAt === null) return;

      const awayFor = Date.now() - hiddenAt;
      hiddenAt = null;

      if (awayFor >= RESUME_REVALIDATE_AFTER_MS) {
        handleGetMe();
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        handleGetMe();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [pathname]);

  return <>{children}</>;
};
