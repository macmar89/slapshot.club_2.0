'use client';

import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

export function useAnnouncementsUnreadCount() {
  const { data, mutate } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT('ANNOUNCEMENTS')
  );

  return {
    unreadCount: data?.count || 0,
    mutate,
  };
}
