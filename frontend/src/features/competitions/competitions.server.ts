import { serverFetch } from '@/lib/api-server';
import { API_ROUTES } from '@/lib/api-routes';
import { Competition, CompetitionPublicInfo } from './competitions.types';
import { ActionResponse } from '@/lib/types';

export const handleGetActiveCompetitionsServer = async (): Promise<
  ActionResponse<Competition[]>
> => {
  try {
    const res = await serverFetch(API_ROUTES.COMPETITIONS.ALL);

    const resData = await res.json();
    return {
      success: resData.status === 'success',
      data: resData.data.competitions as Competition[],
    };
  } catch {
    return { success: false, error: 'failed_to_load_competitions' };
  }
};

export const getPublicCompetition = async (
  slug: string,
): Promise<ActionResponse<CompetitionPublicInfo>> => {
  try {
    const res = await serverFetch(API_ROUTES.COMPETITIONS.PUBLIC.INFO(slug));

    const resData = await res.json();

    return { success: resData.status === 'success', data: resData.data as CompetitionPublicInfo };
  } catch {
    return { success: false, error: 'failed_to_get_public_competition' };
  }
};
