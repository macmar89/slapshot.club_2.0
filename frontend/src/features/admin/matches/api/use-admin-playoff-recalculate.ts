import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

export function useAdminPlayoffRecalculate() {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const recalculatePlayoffs = async (apiSportId: number, seasonYear: number) => {
    setIsRecalculating(true);
    try {
      const response = await api.post(API_ROUTES.ADMIN.MATCHES.RECALCULATE_PLAYOFFS, {
        apiSportId,
        seasonYear,
      });

      const result = response.data;

      toast.success(result.data || 'Výpočet Playoff sérií prebehol úspešne.');
      return result.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Nepodarilo sa spustiť výpočet Playoff.';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsRecalculating(false);
    }
  };

  return {
    recalculatePlayoffs,
    isRecalculating,
  };
}
