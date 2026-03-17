'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { dashboardConfig } from '@/config/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { LayoutDashboard } from 'lucide-react';
import { CompetitionPublicInfo } from '@/features/competitions/competitions.types';

interface CompetitionNavProps {
  slug: string;
  competition: CompetitionPublicInfo;
}

export const CompetitionNav = ({ slug, competition }: CompetitionNavProps) => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  return (
    <>
      <SidebarItem
        href="/arena"
        icon={LayoutDashboard}
        label={t('arena')}
        isActive={pathname === '/arena'}
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

        return (
          <SidebarItem
            key={item.href}
            href={href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive}
          />
        );
      })}
    </>
  );
};
