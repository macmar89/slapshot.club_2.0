import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

export function useAdminMatchSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const syncMatches = async (apiSportId: number, daysAhead: number = 14, seasonYear?: number) => {
    setIsSyncing(true);
    try {
      const url = `${API_ROUTES.ADMIN.MATCHES.SYNC}?apiSportId=${apiSportId}&daysAhead=${daysAhead}${seasonYear ? `&seasonYear=${seasonYear}` : ''}`;
      const response = await api.post(url);

      const result = response.data;

      toast.success(result.message || 'Zápasy boli úspešne synchronizované.');
      return result.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Nepodarilo sa synchronizovať zápasy.';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncMatches,
    isSyncing,
  };
}
