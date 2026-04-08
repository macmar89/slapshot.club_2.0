'use client';

import { SWRConfig } from 'swr';
import { Toaster } from 'sonner';
import { AuthSync } from '@/providers/auth-sync';
import { swrFetcher } from '@/lib/swr-fetcher';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true,
        revalidateIfStale: true,
        dedupingInterval: 30000,
      }}
    >
      <AuthSync>{children}</AuthSync>
      <Toaster />
    </SWRConfig>
  );
};
