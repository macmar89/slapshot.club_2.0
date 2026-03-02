import { serverFetch } from '@/lib/api-server';
import { API_ROUTES } from '@/lib/api-routes';
import axios from 'axios';
import { CompetitionsResponse, JoinCompetitionResponse } from './competitions.types';

export const handleGetCompetitionBySlug = async (slug: string) => {
  return {
    name: 'Competition Name',
  };
};

export const handleGetActiveCompetitionsServer = async (): Promise<CompetitionsResponse> => {
  try {
    const res = await serverFetch(API_ROUTES.COMPETITIONS.ALL);

    const resData = await res.json();
    return { success: resData.status === 'success', competitions: resData.data.competitions };
  } catch (error) {
    return { success: false, error: 'failed_to_load_competitions' };
  }
};

export const handleJoinCompetition = async (
  competitionId: string,
): Promise<JoinCompetitionResponse> => {
  try {
    const response = await axios.post(API_ROUTES.COMPETITIONS.JOIN, { competitionId });

    return { success: response.status === 201 };
  } catch (error) {
    return { success: false, error: 'failed_to_join_competition' };
  }
};
