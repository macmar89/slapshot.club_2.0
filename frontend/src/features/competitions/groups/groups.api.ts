import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { GroupDetailSettings } from './group.types';

export const postCreatePrivateGroup = async (slug: string, name: string) => {
  try {
    const response = await api.post(API_ROUTES.GROUPS.CREATE, {
      name,
      competitionSlug: slug,
      type: 'private',
    });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const postJoinGroup = async (code: string, competitionSlug: string) => {
  try {
    const response = await api.post(API_ROUTES.GROUPS.JOIN, { code, competitionSlug });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const patchUpdateGroupSettings = async (
  groupSlug: string,
  settings: Partial<GroupDetailSettings>,
) => {
  try {
    const response = await api.patch(API_ROUTES.GROUPS.DETAIL.SETTINGS(groupSlug), settings);

    return { success: response.status === 200, data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const deleteGroup = async (groupSlug: string) => {
  try {
    const response = await api.delete(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));

    return { success: response.status === 200 || response.status === 204 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};
