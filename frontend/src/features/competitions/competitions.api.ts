import { API_ROUTES } from '@/lib/api-routes';
import { JoinCompetitionResponse } from './competitions.types';
import { api } from '@/lib/api';

export const handleGetCompetitionBySlug = async () => {
  return {
    name: 'Competition Name',
  };
};

export const handleJoinCompetition = async (
  competitionId: string,
): Promise<JoinCompetitionResponse> => {
  try {
    const response = await api.post(API_ROUTES.COMPETITIONS.JOIN, { competitionId });

    return { success: response.status === 201 };
  } catch {
    return { success: false, error: 'failed_to_join_competition' };
  }
};
