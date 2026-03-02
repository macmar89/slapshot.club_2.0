'use client';

import { useEffect, useState } from 'react';
import { dashboardConfig } from '@/config/sidebar';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LayoutDashboard } from 'lucide-react';
import { handleGetCompetitionBySlug } from '@/features/competitions/competitions.api';

export function Sidebar() {
  const t = useTranslations('Dashboard.nav');
  const params = useParams();
  const pathname = usePathname();
  const slug = params?.slug as string | undefined;
  const locale = useLocale();

  const [competitionName, setCompetitionName] = useState<string | null>(null);

  const segments = useSelectedLayoutSegments();

  useEffect(() => {
    async function fetchCompetition() {
      if (slug) {
        const comp = await handleGetCompetitionBySlug(slug);
        if (comp) {
          setCompetitionName(comp.name);
        }
      } else {
        setCompetitionName(null);
      }
    }
    fetchCompetition();
  }, [slug, locale]);

  return (
    <nav className="mt-4 flex flex-col gap-2">
      <Link
        href="/arena"
        className={cn(
          'group relative flex gap-3 overflow-hidden px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-200',
          pathname === '/arena' ? 'text-white' : 'text-white/70 hover:text-white',
        )}
      >
        {pathname === '/arena' && (
          <div className="via-primary absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
        )}
        <div className="via-primary animate-knight-rider pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent to-transparent opacity-0 blur-[1px] group-hover:opacity-100" />
        <LayoutDashboard className="relative z-10 h-5 w-5" />
        <span className="relative z-10 text-shadow-sm">{t('arena')}</span>
      </Link>

      {slug && (
        <>
          <div className="px-4 py-2">
            <div className="h-px w-full bg-white/10" />
          </div>

          {competitionName && (
            <div className="px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
              {competitionName}
            </div>
          )}
        </>
      )}

      {dashboardConfig.sidebarNav.map((item) => {
        let href = item.href;
        if (slug) {
          if (href === '/dashboard') {
            href = `/dashboard/${slug}`;
          } else if (href.startsWith('/dashboard/')) {
            const subPath = href.replace('/dashboard/', '');
            href = `/dashboard/${slug}/${subPath}`;
          }
        } else {
          if (item.href !== '/dashboard' && !slug) return null;
        }

        const itemSegment = item.href.split('/').pop();
        const isOverview = itemSegment === 'dashboard';

        let isActive = false;
        if (isOverview) {
          isActive = slug ? segments.length === 1 : segments.length === 0;
        } else {
          isActive = itemSegment ? segments.includes(itemSegment) : false;
        }

        return (
          <Link
            key={item.href}
            href={href as any}
            className={cn(
              'group relative flex gap-3 overflow-hidden px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-200',
              isActive ? 'text-white' : 'text-white/70 hover:text-white',
            )}
          >
            {isActive && (
              <div className="via-primary absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
            )}
            <div className="via-primary animate-knight-rider pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent to-transparent opacity-0 blur-[1px] group-hover:opacity-100" />

            <item.icon className="relative z-10 h-5 w-5" />
            <span className="relative z-10 text-shadow-sm">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
