'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import {
  navigationConfig,
  resolveActiveHref,
  resolveNavHref,
  type NavContext,
} from '@/config/navigation';
import { useNavBadges } from '@/hooks/use-nav-badges';
import { BottomNavItem } from './bottom-nav-item';
import { MoreSheet } from './more-sheet';

interface BottomNavProps {
  context: NavContext;
  slug?: string;
}

export const BottomNav = ({ context, slug }: BottomNavProps) => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();
  const { getBadge } = useNavBadges();

  const { bottom, more } = navigationConfig[context];

  const bottomItems = bottom.map((item) => ({ ...item, href: resolveNavHref(item.href, slug) }));
  const moreHrefs = more.map((item) => resolveNavHref(item.href, slug));
  const activeHref = resolveActiveHref(pathname, [
    ...bottomItems.map((item) => item.href),
    ...moreHrefs,
  ]);

  const moreBadge = more.reduce((total, item) => total + (getBadge(item.badgeType) ?? 0), 0);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-[calc(var(--app-bottom-nav-h)+var(--app-safe-bottom))] pb-[var(--app-safe-bottom)] lg:hidden">
      <div className="flex h-[var(--app-bottom-nav-h)] items-stretch border-t border-white/10 bg-black/70 backdrop-blur-xl">
        {bottomItems.map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={activeHref === item.href}
            badge={getBadge(item.badgeType)}
          />
        ))}
        <MoreSheet
          items={more}
          slug={slug}
          isActive={!!activeHref && moreHrefs.includes(activeHref)}
          badge={moreBadge > 0 ? moreBadge : undefined}
        />
      </div>
    </nav>
  );
};
