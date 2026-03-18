'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { dashboardConfig } from '@/config/sidebar';

export const AdminNavItems = () => {
  const t = useTranslations('Admin.nav');
  const pathname = usePathname();

  return dashboardConfig.adminNav.map((item) => {
    const href = item.href;
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
  });
};
