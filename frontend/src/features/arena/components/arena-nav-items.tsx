'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { dashboardConfig, DashboardItem } from '@/config/sidebar';

export const ArenaNavItems = () => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: unreadData } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
  );
  const unreadCount = unreadData?.count || 0;

  return (
    <>
      {dashboardConfig.arenaNav.map((item: DashboardItem) => (
        <SidebarItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.labelKey)}
          isActive={pathname === item.href}
          badge={item.showBadge && unreadCount > 0 ? unreadCount : undefined}
        />
      ))}
    </>
  );
};
