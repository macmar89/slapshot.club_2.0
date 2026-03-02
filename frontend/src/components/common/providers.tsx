'use client';

import { SWRConfig } from 'swr';
import { api } from '@/lib/api';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => api.get(url).then((res) => res.data),
        revalidateOnFocus: true,
        revalidateIfStale: true,
        dedupingInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
