'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Menu as MenuIcon, User as UserIcon, Settings, MessageSquarePlus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { useTranslations } from 'next-intl';

interface League {
  id: string;
  name: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  slug: string;
  effectiveLeagueId: string | null;
  leagues: League[];
  onLeagueChange: (leagueId: string | 'global') => void;
  upcomingMatches: any[];
}

export function MobileMenu({
  isOpen,
  onOpenChange,
  user,
  slug,
  effectiveLeagueId,
  leagues,
  onLeagueChange,
  upcomingMatches,
}: MobileMenuProps) {
  const t = useTranslations('Header');
  const dt = useTranslations('Dashboard.nav');

  return (
    <div className="ml-auto md:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex w-full flex-col border-l border-white/10 bg-black/95 p-0 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t('mobile_menu')}</SheetTitle>
            <SheetDescription>{t('mobile_menu_desc')}</SheetDescription>
          </SheetHeader>
          {/* Header Section */}
          <div className="from-primary/10 border-b border-white/5 bg-gradient-to-b to-transparent p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-app bg-primary/20 border-primary/30 flex h-12 w-12 items-center justify-center border">
                  <UserIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tighter text-white uppercase italic">
                    {user?.username || t('host')}
                  </h3>
                  <p className="max-w-[150px] truncate text-[10px] font-medium tracking-widest text-white/40 uppercase">
                    {user?.email}
                  </p>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* League Switcher in Mobile Drawer */}
            {slug && (
              <div className="mb-8">
                <span className="mb-3 block text-[10px] font-black tracking-widest text-white/20 uppercase">
                  {t('active_league')}
                </span>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLeagueChange('global');
                      onOpenChange(false);
                    }}
                    className={cn(
                      'h-10 justify-start rounded-lg px-4 text-[10px] font-black tracking-widest uppercase transition-all',
                      !effectiveLeagueId
                        ? 'bg-primary text-black shadow-[0_0_15px_-5px_rgba(var(--primary-rgb),0.6)]'
                        : 'text-white/40 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {t('global_league')}
                  </Button>
                  {leagues.map((league) => (
                    <Button
                      key={league.id}
                      variant="ghost"
                      onClick={() => {
                        onLeagueChange(league.id);
                        onOpenChange(false);
                      }}
                      className={cn(
                        'h-10 justify-start rounded-lg px-4 text-[10px] font-black tracking-widest uppercase transition-all',
                        effectiveLeagueId === league.id
                          ? 'bg-primary text-black shadow-[0_0_15px_-5px_rgba(var(--primary-rgb),0.6)]'
                          : 'text-white/40 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {league.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                {t('dont_forget_to_tip')}
              </h4>
            </div>

            {upcomingMatches.length > 0 ? (
              <div className="grid gap-3">
                {upcomingMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={
                      `/dashboard/${slug}/matches?matchId=${match.id}${effectiveLeagueId ? `&leagueId=${effectiveLeagueId}` : ''}` as any
                    }
                    onClick={() => onOpenChange(false)}
                    className="rounded-app block border border-white/5 bg-white/5 p-3"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-bold text-white/70">
                      <div className="flex-1 truncate text-right">
                        {match.homeTeam?.shortName || match.homeTeam?.name}
                      </div>
                      <div className="text-primary text-[10px] font-black italic">VS</div>
                      <div className="flex-1 truncate text-left">
                        {match.awayTeam?.shortName || match.awayTeam?.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-app border border-dashed border-white/5 bg-white/[0.01] py-4 text-center text-[10px] font-medium text-white/10 italic">
                {t('all_done')}
              </p>
            )}
          </div>

          <div className="mt-auto border-t border-white/5 bg-black/40 p-6">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                href="/account"
                onClick={() => onOpenChange(false)}
                className="rounded-app flex flex-col items-center justify-center gap-2 bg-white/5 p-4 text-white/60"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {t('my_account')}
                </span>
              </Link>
              <Link
                href="/settings"
                onClick={() => onOpenChange(false)}
                className="rounded-app flex flex-col items-center justify-center gap-2 bg-white/5 p-4 text-white/60"
              >
                <Settings className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {dt('settings')}
                </span>
              </Link>
            </div>
            <LogoutButton />

            <div className="mt-4 border-t border-white/5 pt-4">
              <FeedbackModal triggerClassName="w-full">
                <div className="rounded-app bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex cursor-pointer items-center justify-center gap-2 border p-3 transition-all">
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    {t('feedback')}
                  </span>
                </div>
              </FeedbackModal>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
