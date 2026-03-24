'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { dashboardConfig } from '@/config/sidebar';

export const ArenaNavItems = () => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: unreadData } = useSWR<{ count: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
  const { data: missingData } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);

  const unreadCount = unreadData?.count || 0;
  const missingCount = missingData?.count || 0;

  return (
    <>
      {dashboardConfig.arenaNav.map((item) => {
        const badge = item.showBadge
          ? item.badgeType === 'notifications'
            ? unreadCount > 0
              ? unreadCount
              : undefined
            : item.badgeType === 'missing_tips'
              ? missingCount > 0
                ? missingCount
                : undefined
              : undefined
          : undefined;

        return (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={pathname === item.href}
            badge={badge}
          />
        );
      })}
    </>
  );
};
