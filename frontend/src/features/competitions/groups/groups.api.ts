import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

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
