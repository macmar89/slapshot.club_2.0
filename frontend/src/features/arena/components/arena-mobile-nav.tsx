'use client';

import { PwaOnlyNav } from '@/components/layout/pwa-only-nav';
import { MobileTabNavItem } from '@/components/layout/mobile-tab-nav';
import { dashboardConfig } from '@/config/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

export const ArenaMobileNav = () => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: unreadData } = useSWR<{ count: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
  const { data: missingData } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);

  const unreadCount = unreadData?.count || 0;
  const missingCount = missingData?.count || 0;

  const leftItems = dashboardConfig.arenaMobileNav.slice(0, 2);
  const rightItems = dashboardConfig.arenaMobileNav.slice(2, 5);

  return (
    <PwaOnlyNav
      leftChildren={leftItems.map((item) => (
        <MobileTabNavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.labelKey)}
          isActive={pathname === item.href}
          badge={
            item.badgeType === 'missing_tips'
              ? missingCount > 0
                ? missingCount
                : undefined
              : undefined
          }
        />
      ))}
      rightChildren={rightItems.map((item) => (
        <MobileTabNavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.labelKey)}
          isActive={pathname === item.href}
          badge={
            item.badgeType === 'notifications'
              ? unreadCount > 0
                ? unreadCount
                : undefined
              : undefined
          }
        />
      ))}
    />
  );
};
