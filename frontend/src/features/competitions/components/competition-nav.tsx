'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { dashboardConfig } from '@/config/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { CompetitionPublicInfo } from '@/features/competitions/competitions.types';

interface CompetitionNavProps {
  slug: string;
  competition: CompetitionPublicInfo;
}

export const CompetitionNav = ({ slug, competition }: CompetitionNavProps) => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const { data: unreadData } = useSWR<{ count: number }>(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
  const { data: missingData } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);

  const unreadCount = unreadData?.count || 0;
  const missingCount = missingData?.count || 0;

  return (
    <>
      <SidebarItem
        href="/arena"
        icon={dashboardConfig.arenaNav[0].icon}
        label={t('arena')}
        isActive={pathname === '/arena'}
        badge={dashboardConfig.arenaNav[0].showBadge && missingCount > 0 ? missingCount : undefined}
      />

      {slug && (
        <>
          <div className="px-4 py-2">
            <div className="h-px w-full bg-white/10" />
          </div>

          {competition.name && (
            <div className="px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
              {competition.name}
            </div>
          )}
        </>
      )}

      {dashboardConfig.sidebarNav.map((item) => {
        const isSlugPath = item.href.includes('[slug]');
        if (isSlugPath && !slug) return null;

        const href = item.href.replace('[slug]', slug || '');
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

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
            href={href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive}
            badge={badge}
          />
        );
      })}
    </>
  );
};
