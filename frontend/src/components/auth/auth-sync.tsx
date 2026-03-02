'use client';

import { useEffect } from 'react';
import { handleGetMe } from '@/features/auth/auth.api';

export const AuthSync = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    handleGetMe();
  }, []);

  return <>{children}</>;
};
