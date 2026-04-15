'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { dashboardConfig } from '@/config/sidebar';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

export const AdminNavItems = () => {
  const t = useTranslations('Admin.nav');
  const tDashboard = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: missingData } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);
  const missingCount = missingData?.count || 0;

  const { data: unreadFeedbackData } = useSWR<{ count: number }>(
    API_ROUTES.ADMIN.FEEDBACK.UNREAD_COUNT,
  );
  const unreadFeedbackCount = unreadFeedbackData?.count || 0;

  const bestMatch = dashboardConfig.adminNav
    .filter((item) => {
      const isExact = pathname === item.href;
      const isSubPath = item.href !== '/' && pathname.startsWith(`${item.href}/`);
      return isExact || isSubPath;
    })
    .reduce(
      (prev, curr) => (curr.href.length > (prev?.href.length || 0) ? curr : prev),
      null as (typeof dashboardConfig.adminNav)[number] | null,
    );

  return (
    <>
      <SidebarItem
        href="/arena"
        icon={dashboardConfig.arenaNav[0].icon}
        label={tDashboard('arena')}
        isActive={pathname === '/arena'}
        badge={dashboardConfig.arenaNav[0].showBadge && missingCount > 0 ? missingCount : undefined}
      />

      <div className="px-4 py-2">
        <div className="h-px w-full bg-white/10" />
      </div>

      {dashboardConfig.adminNav.map((item) => {
        const isActive = bestMatch?.href === item.href;

        return (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive}
            disabled={item.disabled}
            badge={item.labelKey === 'feedback' && unreadFeedbackCount > 0 ? unreadFeedbackCount : undefined}
          />
        );
      })}
    </>
  );
};
