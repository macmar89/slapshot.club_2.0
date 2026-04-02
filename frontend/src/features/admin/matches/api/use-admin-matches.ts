import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { AdminMatchesResponse } from '../admin-matches.types';

export function useAdminMatches(queryString: string) {
  return useSWR<AdminMatchesResponse>(
    `${API_ROUTES.ADMIN.MATCHES.LIST}?${queryString}`
  );
}
