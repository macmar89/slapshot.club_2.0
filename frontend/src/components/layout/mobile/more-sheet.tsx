'use client';

import { useState } from 'react';
import { MoreHorizontal, MessageSquarePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { useAuthStore } from '@/store/use-auth-store';
import { adminNavItem, resolveNavHref, type NavItem } from '@/config/navigation';
import { useNavBadges } from '@/hooks/use-nav-badges';
import { BottomNavContent, bottomNavItemClass } from './bottom-nav-item';
import { InstallAppButton } from './install-app-button';
import packageJson from '../../../../package.json';

interface MoreSheetProps {
  items: NavItem[];
  slug?: string;
  isActive: boolean;
  badge?: number;
}

export const MoreSheet = ({ items, slug, isActive, badge }: MoreSheetProps) => {
  const t = useTranslations('Dashboard.nav');
  const headerT = useTranslations('Header');
  const [isOpen, setIsOpen] = useState(false);

  const { getBadge } = useNavBadges();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'editor';

  const tiles = isAdmin ? [...items, adminNavItem] : items;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className={cn('group', bottomNavItemClass)}>
        <BottomNavContent
          icon={MoreHorizontal}
          label={t('more')}
          isActive={isActive}
          badge={badge}
        />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] gap-0 overflow-y-auto border-white/10 bg-slate-950/95 backdrop-blur-2xl"
      >
        <SheetHeader className="pb-2">
          <SheetTitle className="text-sm font-black tracking-widest text-white uppercase italic">
            {t('menu')}
          </SheetTitle>
          <SheetDescription className="sr-only">{headerT('mobile_menu_desc')}</SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-2 px-4">
          {tiles.map((item) => {
            const itemBadge = getBadge(item.badgeType);

            return (
              <Link
                key={item.href}
                href={resolveNavHref(item.href, slug) as Parameters<typeof Link>[0]['href']}
                onClick={() => setIsOpen(false)}
                className="rounded-app relative flex min-h-20 flex-col items-center justify-center gap-2 border border-white/10 bg-white/5 p-3 text-white/60 transition-all active:bg-white/10 active:text-white"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-center text-[10px] leading-tight font-bold tracking-wide uppercase">
                  {t(item.labelKey)}
                </span>
                {itemBadge !== undefined && (
                  <span className="bg-primary absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] leading-none font-black text-black">
                    {itemBadge > 99 ? '99+' : itemBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 px-4 pt-4">
          <FeedbackModal triggerClassName="w-full">
            <div className="rounded-app bg-warning/5 border-warning/10 text-warning active:bg-warning/10 flex min-h-11 cursor-pointer items-center justify-center gap-2 border transition-all">
              <MessageSquarePlus className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {headerT('feedback')}
              </span>
            </div>
          </FeedbackModal>

          <InstallAppButton />

          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 px-4 pt-6 pb-[calc(var(--app-safe-bottom)+1rem)] text-[9px] font-black tracking-widest text-white/40 uppercase">
          <Link href="/terms" target="_blank" className="active:text-white/80">
            {t('terms')}
          </Link>
          <span>&bull;</span>
          <Link href="/privacy-policy" target="_blank" className="active:text-white/80">
            {t('privacy')}
          </Link>
          <span>&bull;</span>
          <span>v{packageJson.version}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
};
