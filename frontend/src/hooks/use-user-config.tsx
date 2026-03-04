'use client';

import { useMemo } from 'react';

export const useUserTimezone = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'Europe/Bratislava';
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);
};
