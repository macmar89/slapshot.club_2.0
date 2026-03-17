'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { LayoutDashboard } from 'lucide-react';

export const ArenaNavItems = () => {
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
    </>
  );
};
