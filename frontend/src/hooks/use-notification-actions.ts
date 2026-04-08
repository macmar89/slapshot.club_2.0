'use client';

import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import type { AppNotification } from '@/features/notifications/components/notification-bell';

export function useNotificationActions() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleNotificationClick = async (
    notification: AppNotification,
    onAfterClick?: () => void,
  ) => {
    try {
      // 1. Mark as read if needed
      if (!notification.isRead) {
        await api.patch(API_ROUTES.NOTIFICATIONS.READ_ONE(notification.id));
        // Global revalidate for all notification-related keys
        mutate(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
        mutate(API_ROUTES.NOTIFICATIONS.ALL(10, 'ALL'));
      }

      // 2. Optional UI side effect (e.g. close popover)
      onAfterClick?.();

      const payload = notification.payload || {};

      // 3. Handle Navigation based on type
      switch (notification.type) {
        case 'MATCH_FINISHED':
          if (payload.matchId) router.push(`/matches/${payload.matchId}`);
          break;
        case 'MATCH_REMINDER':
        case 'DAILY_TIPS_REMINDER':
          if (payload.missingTipsCount) {
            router.push('/arena/missing-tips');
          } else if (payload.matchId) {
            router.push(`/matches/${payload.matchId}`);
          }
          break;
        case 'GROUP_INVITE':
        case 'GROUP_INVITE_ACCEPTED':
        case 'GROUP_INVITE_REJECTED':
        case 'GROUP_PENDING':
          return router.push(`/${payload.competitionSlug}/groups/${payload.groupSlug}?tab=roster`);
        case 'GROUP_PENDING_ACCEPTED':
          return router.push(`/${payload.competitionSlug}/groups/${payload.groupSlug}?tab=members`);
        case 'GROUP_PENDING_REJECTED':
        case 'SYSTEM_ALERT':
        case 'NEW_FEATURE':
        case 'UPDATE_SUMMARY':
          // No navigation needed
          break;
        case 'NEW_ANNOUNCEMENT':
          if (payload.announcementSlug) {
            router.push(`/announcements/${payload.announcementSlug}`);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to handle notification click', err);
    }
  };

  return { handleNotificationClick };
}
