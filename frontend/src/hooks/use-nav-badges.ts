'use client';

import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import type { NavBadgeType } from '@/config/navigation';

export function useNavBadges() {
  const { data: notifications } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT(),
  );
  const { data: missingTips } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);
  const { data: announcements } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT('ANNOUNCEMENTS'),
  );

  const counts: Record<NavBadgeType, number> = {
    notifications: notifications?.count || 0,
    missing_tips: missingTips?.count || 0,
    announcements: announcements?.count || 0,
  };

  const getBadge = (badgeType?: NavBadgeType) => {
    if (!badgeType) return undefined;
    return counts[badgeType] > 0 ? counts[badgeType] : undefined;
  };

  return { counts, getBadge };
}
