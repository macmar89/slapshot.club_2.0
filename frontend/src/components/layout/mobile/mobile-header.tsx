'use client';

import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/i18n/routing';
import {
  arenaSectionLabels,
  arenaSectionPrefixes,
  competitionSectionLabels,
  navigationConfig,
  resolveActiveHref,
  resolveNavHref,
} from '@/config/navigation';
import { useCompetitionStore } from '@/store/use-competition-store';
import { NotificationBell } from '@/features/notifications/components/notification-bell';

export const MobileHeader = () => {
  const t = useTranslations('Dashboard.nav');
  const commonT = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();
  const competition = useCompetitionStore((state) => state.competition);

  const segments = pathname.split('/').filter(Boolean);
  const isArenaSection = arenaSectionPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const slug = isArenaSection ? undefined : segments[0];

  const rootHrefs = [
    ...navigationConfig.arena.bottom.map((item) => item.href),
    ...navigationConfig.competition.bottom.map((item) => resolveNavHref(item.href, slug)),
  ];
  const isRootTab = rootHrefs.includes(pathname);

  const resolveTitle = () => {
    if (isArenaSection) {
      const activeHref = resolveActiveHref(pathname, Object.keys(arenaSectionLabels));
      if (activeHref) return t(arenaSectionLabels[activeHref]);
    }

    const sectionKey = segments[1] ? competitionSectionLabels[segments[1]] : undefined;
    if (sectionKey) return t(sectionKey);

    return competition?.name ?? 'SLAPSHOT';
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[calc(var(--app-header-h)+var(--app-safe-top))] border-b border-white/10 bg-black/70 pt-[var(--app-safe-top)] backdrop-blur-xl lg:hidden">
      <div className="flex h-[var(--app-header-h)] items-center gap-2 px-2">
        {!isRootTab && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={commonT('back')}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-white/70 active:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <h1 className="flex-1 truncate px-2 text-sm font-black tracking-widest text-white uppercase italic">
          {resolveTitle()}
        </h1>

        <div className="flex-shrink-0">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};
