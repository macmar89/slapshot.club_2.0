import { serverFetch } from '@/lib/api-server';
import { API_ROUTES } from '@/lib/api-routes';
import { Competition, CompetitionPublicInfo } from './competitions.types';
import { ActionResponse } from '@/lib/types';

export const getActiveCompetitionsServer = async (tab: string = 'active'): Promise<ActionResponse<Competition[]>> => {
  try {
    const query = new URLSearchParams({ tab });
    const res = await serverFetch(`${API_ROUTES.COMPETITIONS.ALL}?${query.toString()}`);

    const resData = await res.json();

    if (resData.status !== 'success') {
      return { success: false, error: 'failed_to_load_competitions' };
    }

    return {
      success: true,
      data: resData.data.competitions as Competition[],
    };
  } catch {
    return { success: false, error: 'failed_to_load_competitions' };
  }
};

export const getCompetitionCountsServer = async (): Promise<ActionResponse<{ active: number; upcoming: number; finished: number }>> => {
  try {
    const res = await serverFetch(API_ROUTES.COMPETITIONS.COUNTS);

    const resData = await res.json();

    if (resData.status !== 'success') {
      return { success: false, error: 'failed_to_load_competition_counts' };
    }

    return {
      success: true,
      data: resData.data,
    };
  } catch {
    return { success: false, error: 'failed_to_load_competition_counts' };
  }
};

export const getPublicCompetition = async (
  slug: string,
): Promise<ActionResponse<CompetitionPublicInfo>> => {
  try {
    const res = await serverFetch(API_ROUTES.COMPETITIONS.PUBLIC.INFO(slug));

    const resData = await res.json();

    if (resData.status !== 'success') {
      return { success: false, error: 'failed_to_get_public_competition' };
    }

    return { success: true, data: resData.data as CompetitionPublicInfo };
  } catch {
    return { success: false, error: 'failed_to_get_public_competition' };
  }
};
