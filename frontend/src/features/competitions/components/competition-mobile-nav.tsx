'use client';

import { PwaOnlyNav } from '@/components/layout/pwa-only-nav';
import { MobileTabNavItem } from '@/components/layout/mobile-tab-nav';
import { dashboardConfig } from '@/config/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

interface CompetitionMobileNavProps {
  slug: string;
}

export const CompetitionMobileNav = ({ slug }: CompetitionMobileNavProps) => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: unreadData } = useSWR<{ count: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);

  const unreadCount = unreadData?.count || 0;

  const leftItems = dashboardConfig.sidebarNav.slice(0, 2);
  const rightItems = dashboardConfig.sidebarNav.slice(2, 4);

  const getHref = (originalHref: string) => originalHref.replace('[slug]', slug);

  return (
    <PwaOnlyNav
      leftChildren={leftItems.map((item) => {
        const href = getHref(item.href);
        return (
          <MobileTabNavItem
            key={item.href}
            href={href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={pathname === href}
          />
        );
      })}
      rightChildren={rightItems.map((item) => {
        const href = getHref(item.href);
        const badge =
          item.badgeType === 'notifications' && unreadCount > 0 ? unreadCount : undefined;

        return (
          <MobileTabNavItem
            key={item.href}
            href={href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={pathname === href}
            badge={badge}
          />
        );
      })}
    />
  );
};
