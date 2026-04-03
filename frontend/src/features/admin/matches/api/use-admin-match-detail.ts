import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { AdminMatchDto } from '../admin-matches.types';

export function useAdminMatchDetail(id: string) {
  return useSWR<AdminMatchDto>(
    id ? API_ROUTES.ADMIN.MATCHES.DETAIL(id) : null
  );
}
