import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { FeedbackStatus } from '../feedback.types';

export const feedbackApi = {
  updateStatus: async (id: string, status: FeedbackStatus) => {
    return await api.patch(API_ROUTES.ADMIN.FEEDBACK.UPDATE(id), { status });
  },
};
