'use client';

import React from 'react';
import { dashboardConfig } from '@/config/dashboard';
import { IceGlassCard } from '@/components/ui/IceGlassCard';
import { MoreHorizontal, MessageSquarePlus, LogOut, X, LayoutDashboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { getCompetitionBySlugAction } from '@/features/competitions/actions';
import Image from 'next/image';
import logo from '@/assets/images/logo/ssc_logo_2.png';

export function MobileTabNav() {
  const t = useTranslations('Dashboard.nav');
  const th = useTranslations('Header');
  const ta = useTranslations('Auth');
  const params = useParams();
  const pathname = usePathname();
  const slug = params?.slug as string | undefined;
  const locale = useLocale();
  const segments = useSelectedLayoutSegments();

  const [isOpen, setIsOpen] = React.useState(false);
  const [competitionName, setCompetitionName] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCompetition() {
      if (slug) {
        const comp = await getCompetitionBySlugAction(slug, locale);
        if (comp) {
          setCompetitionName(comp.name);
        }
      } else {
        setCompetitionName(null);
      }
    }
    fetchCompetition();
  }, [slug, locale]);

  // Items for the bottom bar (Original items)
  const leftItems = dashboardConfig.sidebarNav.slice(1, 3);
  const rightItems = dashboardConfig.sidebarNav.slice(3, 4);

  const getHref = (originalHref: string) => {
    if (!slug) return originalHref;

    if (originalHref === '/dashboard') {
      return `/dashboard/${slug}`;
    } else if (originalHref.startsWith('/dashboard/')) {
      const subPath = originalHref.replace('/dashboard/', '');
      return `/dashboard/${slug}/${subPath}`;
    }
    return originalHref;
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
      <IceGlassCard
        className="rounded-t-app h-20 w-full overflow-visible rounded-b-none border-x-0 border-b-0"
        backdropBlur="lg"
        allowOverflow
      >
        <div className="flex h-full items-center justify-between px-1">
          {/* Left 2 items */}
          <div className="flex flex-1 items-center justify-around">
            {leftItems.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href) as any}
                className="flex flex-col items-center gap-1.5 text-white/50 transition-colors hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-tight uppercase">
                  {t(item.labelKey)}
                </span>
              </Link>
            ))}
          </div>

          {/* Logo in the center */}
          <div className="relative z-50 -mt-10 flex items-center justify-center px-2">
            <Link
              href={`/dashboard/${slug}` as any}
              className="animate-in fade-in zoom-in group relative z-10 flex h-24 w-24 rotate-3 items-center justify-center duration-500"
            >
              <Image
                src={logo}
                alt="Slapshot Club"
                width={80}
                height={80}
                className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                priority
              />
              <span className="bg-primary pointer-events-none absolute top-4 -right-2 rotate-12 rounded-sm px-1.5 py-0.5 text-[8px] font-black tracking-normal text-black normal-case shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300">
                BETA
              </span>
            </Link>
          </div>

          {/* Right 1 item + More */}
          <div className="flex flex-1 items-center justify-around">
            {rightItems.map((item) => (
              <Link
                key={item.href}
                href={getHref(item.href) as any}
                className="flex flex-col items-center gap-1.5 text-white/50 transition-colors hover:text-white"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-tight uppercase">
                  {t(item.labelKey)}
                </span>
              </Link>
            ))}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-auto flex-col items-center gap-1.5 p-0 text-white/50 transition-colors hover:bg-transparent hover:text-white"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-[10px] font-bold tracking-tight uppercase">
                    {t('more')}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex h-[90vh] flex-col overflow-hidden rounded-t-[2.5rem] border-white/10 bg-slate-950/95 p-0 backdrop-blur-lg"
              >
                <div className="absolute top-6 right-6 z-50">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-white/40 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="absolute top-6 left-6 z-50"></div>

                <SheetHeader className="border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-8 pb-6">
                  <LanguageSwitcher />
                </SheetHeader>

                <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-2">
                  <nav className="flex flex-col gap-2">
                    {/* Global Aréna Link */}
                    <Link
                      href="/arena"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group relative flex items-center gap-3 overflow-hidden px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-200',
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

                    {(slug || competitionName) && (
                      <>
                        <div className="px-4 py-4">
                          <div className="h-px w-full bg-white/5" />
                        </div>
                        {competitionName && (
                          <div className="px-5 py-2 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase italic">
                            {competitionName}
                          </div>
                        )}
                      </>
                    )}

                    {dashboardConfig.sidebarNav.map((item: any) => {
                      let href = item.href;
                      if (slug) {
                        if (href === '/dashboard') {
                          href = `/dashboard/${slug}`;
                        } else if (href.startsWith('/dashboard/')) {
                          const subPath = href.replace('/dashboard/', '');
                          href = `/dashboard/${slug}/${subPath}`;
                        }
                      } else if (item.href !== '/dashboard' && !slug) {
                        return null;
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
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'group relative flex items-center gap-3 overflow-hidden px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-200',
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

                    <div className="my-4 h-px bg-white/5" />

                    <FeedbackModal triggerClassName="w-full">
                      <div className="rounded-app bg-primary/[0.03] border-primary/20 text-primary hover:bg-primary/[0.08] group flex cursor-pointer items-center gap-3 border px-5 py-4 transition-all active:scale-[0.98]">
                        <MessageSquarePlus className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-black tracking-[0.2em] uppercase">
                          {t('feedback')}
                        </span>
                      </div>
                    </FeedbackModal>
                  </nav>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 bg-black/40 p-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-wider text-white">V1.0.0</span>
                    <span className="bg-primary rounded-sm px-1.5 py-0.5 text-[9px] leading-tight font-black tracking-normal text-black uppercase shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                      BETA
                    </span>
                  </div>
                  <LogoutButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </IceGlassCard>
    </div>
  );
}
