'use client';

import { SidebarItem } from '@/components/layout/sidebar';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { dashboardConfig } from '@/config/sidebar';

export const AdminNavItems = () => {
  const t = useTranslations('Admin.nav');
  const pathname = usePathname();

  const bestMatch = dashboardConfig.adminNav
    .filter((item) => {
      const isExact = pathname === item.href;
      const isSubPath = item.href !== '/' && pathname.startsWith(`${item.href}/`);
      return isExact || isSubPath;
    })
    .reduce((prev, curr) => (curr.href.length > (prev?.href.length || 0) ? curr : prev), null as typeof dashboardConfig.adminNav[number] | null);

  return dashboardConfig.adminNav.map((item) => {
    const isActive = bestMatch?.href === item.href;

    return (
      <SidebarItem
        key={item.href}
        href={item.href}
        icon={item.icon}
        label={t(item.labelKey)}
        isActive={isActive}
        disabled={item.disabled}
      />
    );
  });
};
