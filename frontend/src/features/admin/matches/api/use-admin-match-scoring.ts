import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

export function useAdminMatchRecalculate() {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const recalculateMatch = async (matchId: string) => {
    setIsRecalculating(true);
    try {
      await api.post(API_ROUTES.ADMIN.MATCHES.RECALCULATE(matchId));
      toast.success('Body boli úspešne prerátané.');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Nepodarilo sa prerátať body.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsRecalculating(false);
    }
  };

  return { recalculateMatch, isRecalculating };
}

export function useAdminMatchRevertEvaluation() {
  const [isReverting, setIsReverting] = useState(false);

  const revertEvaluation = async (matchId: string) => {
    setIsReverting(true);
    try {
      await api.post(API_ROUTES.ADMIN.MATCHES.REVERT_EVALUATION(matchId));
      toast.success('Bodovanie bolo vrátené späť.');
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Nepodarilo sa vrátiť bodovanie.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsReverting(false);
    }
  };

  return { revertEvaluation, isReverting };
}
