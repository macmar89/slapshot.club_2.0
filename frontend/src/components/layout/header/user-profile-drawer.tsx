'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  User as UserIcon,
  ChevronDown,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Settings,
  MessageSquarePlus,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoutButton } from '@/features/auth/components/logout-button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { sk, enUS, cs } from 'date-fns/locale';
// import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { useTranslations } from 'next-intl';
import { ReferralLink } from '@/components/common/referral-link';

interface UserProfileDrawerProps {
  user: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // upcomingMatches?: any[];
  slug: string;
  locale: string;
  effectiveLeagueId: string | null;
}

export function UserProfileDrawer({
  user,
  isOpen,
  onOpenChange,
  // upcomingMatches,
  slug,
  locale,
  effectiveLeagueId,
}: UserProfileDrawerProps) {
  const t = useTranslations('Header');
  const dt = useTranslations('Dashboard.nav');

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-3 rounded-xs border border-white/10 bg-white/5 px-3 py-2 transition-all hover:border-white/20 hover:bg-white/10"
        >
          <div className="bg-primary/20 border-primary/30 text-primary group-hover:bg-primary/30 flex h-8 w-8 items-center justify-center rounded-full border transition-colors">
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-white/80 transition-colors group-hover:text-white">
            {user?.username || t('host')}
          </span>
          <ChevronDown
            className={cn(
              'h-3 w-3 text-white/40 transition-transform',
              isOpen && 'text-primary rotate-180',
            )}
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-white/10 bg-black/95 p-0 backdrop-blur-2xl sm:max-w-md"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t('account_menu')}</SheetTitle>
          <SheetDescription>{t('account_menu_desc')}</SheetDescription>
        </SheetHeader>
        {/* Header Section */}
        <div className="from-primary/10 border-b border-white/5 bg-gradient-to-b to-transparent p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-app bg-primary/20 border-primary/30 flex h-16 w-16 items-center justify-center border shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.4)]">
                <UserIcon className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-white uppercase italic">
                  {user?.username || t('host')}
                </h3>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Match Feed Section */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
          {/* <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {t('dont_forget_to_tip')}
            </h4>
            {upcomingMatches.length > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-black uppercase tracking-tighter">
                {t('matches_count', { count: upcomingMatches.length })}
              </span>
            )}
          </div> */}

          {/* {upcomingMatches.length > 0 ? (
            <div className="grid gap-4">
              {upcomingMatches.map((match) => (
                <Link
                  key={match.id}
                  href={
                    `/dashboard/${slug}/matches?matchId=${match.id}${effectiveLeagueId ? `&leagueId=${effectiveLeagueId}` : ''}` as any
                  }
                  onClick={() => onOpenChange(false)}
                  className="group block p-4 rounded-app bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                      {match.date
                        ? format(new Date(match.date), 'EEEE, d. MMM HH:mm', {
                            locale: locale === 'sk' ? sk : locale === 'cs' ? cs : enUS,
                          })
                        : ''}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right truncate text-sm font-bold text-white/80">
                      {match.homeTeam?.name}
                    </div>
                    <div className="text-xs font-black text-primary italic">VS</div>
                    <div className="flex-1 text-left truncate text-sm font-bold text-white/80">
                      {match.awayTeam?.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-app bg-white/[0.02] border border-dashed border-white/10 text-center">
              <AlertTriangle className="w-8 h-8 text-white/10 mb-4" />
              <p className="text-sm font-medium text-white/20 italic">{t('all_tipped_message')}</p>
            </div>
          )} */}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto border-t border-white/5 bg-black/40 p-8">
          <div className="grid gap-2">
            <Link
              href="/account"
              onClick={() => onOpenChange(false)}
              className="rounded-app group flex items-center gap-3 bg-white/5 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              <UserIcon className="group-hover:text-primary h-5 w-5 transition-colors" />
              <span className="text-xs font-bold tracking-widest uppercase">{t('my_account')}</span>
              <ChevronRight className="ml-auto h-4 w-4 opacity-20 transition-all group-hover:opacity-100" />
            </Link>
            <div className="rounded-app border border-white/5 bg-white/5 p-4">
              <ReferralLink align="center" />
            </div>
          </div>

          <div className="my-6 h-px bg-white/5" />

          <div className="flex flex-col gap-4">
            {/* <FeedbackModal triggerClassName="w-full">
              <div className="rounded-app bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex cursor-pointer items-center gap-3 border p-3 transition-all">
                <MessageSquarePlus className="h-4 w-4" />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {t('feedback')}
                </span>
              </div>
            </FeedbackModal> */}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  v1.0.0
                </span>
                <span className="bg-primary rounded-sm px-1.5 py-0.5 text-[8px] font-black tracking-normal text-black normal-case">
                  BETA
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
