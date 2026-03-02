'use client';

import { SWRConfig } from 'swr';
import { api } from '@/lib/api';
import { AuthSync } from '../auth/auth-sync';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => api.get(url).then((res) => res.data.data),
        revalidateOnFocus: true,
        revalidateIfStale: true,
        dedupingInterval: 5000,
      }}
    >
      <AuthSync>{children}</AuthSync>
      <Toaster />
    </SWRConfig>
  );
};
