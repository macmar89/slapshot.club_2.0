import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { AnnouncementFormValues } from '../announcements.types';

export const announcementsApi = {
  create: async (data: AnnouncementFormValues) => {
    return await api.post(API_ROUTES.ADMIN.ANNOUNCEMENTS.CREATE, data);
  },

  update: async (id: string, data: Partial<AnnouncementFormValues>) => {
    // Note: To be implemented on backend
    return await api.patch(`/admin/announcements/${id}`, data);
  },

  delete: async (id: string) => {
    // Note: To be implemented on backend
    return await api.delete(`/admin/announcements/${id}`);
  },
};
