'use client';

import { useParams } from 'next/navigation';

interface AppRouteParams {
  slug: string;
  username: string;
  matchId: string;
  groupSlug: string;
}

export function useAppParams<K extends keyof AppRouteParams>(keys: K[]): Pick<AppRouteParams, K> {
  const params = useParams();
  const result = {} as Pick<AppRouteParams, K>;

  keys.forEach((key) => {
    result[key] = params[key] as any;
  });

  return result;
}
