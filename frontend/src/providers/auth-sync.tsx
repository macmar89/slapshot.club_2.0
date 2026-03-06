'use client';

import { useEffect } from 'react';
import { handleGetMe } from '@/features/auth/auth.api';
import { usePathname } from '@/i18n/routing';
import { APP_CONFIG } from '@/config/app';

const PUBLIC_PATHS = APP_CONFIG.publicPaths;

export const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    if (!isPublicPath) {
      handleGetMe();
    }
  }, [pathname]);

  return <>{children}</>;
};
