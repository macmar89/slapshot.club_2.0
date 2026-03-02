'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Users, Trophy, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

interface League {
  id: string;
  name: string;
}

interface LeagueSwitcherProps {
  slug: string;
  effectiveLeagueId: string | null;
  selectedLeague?: League;
  leagues: League[];
  onLeagueChange: (leagueId: string | 'global') => void;
}

export function LeagueSwitcher({
  slug,
  effectiveLeagueId,
  selectedLeague,
  leagues,
  onLeagueChange,
}: LeagueSwitcherProps) {
  const t = useTranslations('Header');

  if (!slug) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'rounded-app group flex h-9 cursor-pointer items-center gap-3 border px-4 transition-all',
            effectiveLeagueId
              ? 'border-[#eab308]/30 bg-[#eab308]/10 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)] hover:bg-[#eab308]/20'
              : 'border-[#eab308]/20 bg-[#eab308]/5 text-[#eab308]/80 hover:bg-[#eab308]/10',
          )}
        >
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full',
              effectiveLeagueId ? 'bg-[#eab308] text-black' : 'bg-white/10 text-white/40',
            )}
          >
            {effectiveLeagueId ? <Users className="h-3 w-3" /> : <Trophy className="h-3 w-3" />}
          </div>
          <span
            className={cn(
              'text-xs font-bold tracking-wider uppercase',
              effectiveLeagueId ? 'text-[#eab308]' : 'text-white',
            )}
          >
            {selectedLeague ? selectedLeague.name : t('global_league')}
          </span>
          <ChevronDown className="h-3 w-3 text-white/40 transition-colors group-hover:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tighter text-[#eab308] uppercase italic">
            {t('select_league')}
          </DialogTitle>
          <DialogDescription className="font-medium text-white/40">
            {t('select_league_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {/* Global Option */}
          <DialogClose asChild>
            <button
              onClick={() => onLeagueChange('global')}
              className={cn(
                'rounded-app group flex w-full cursor-pointer items-center justify-between border p-4 transition-all',
                !effectiveLeagueId
                  ? 'border-[#eab308]/30 bg-[#eab308]/10'
                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    !effectiveLeagueId
                      ? 'bg-[#eab308] text-black'
                      : 'bg-white/10 text-white/40 group-hover:bg-[#eab308]/20 group-hover:text-[#eab308]',
                  )}
                >
                  <Trophy className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'text-sm font-bold tracking-tight uppercase',
                    !effectiveLeagueId ? 'text-[#eab308]' : 'text-white',
                  )}
                >
                  {t('global_league')}
                </span>
              </div>
              {!effectiveLeagueId && <CheckCircle className="h-5 w-5 text-[#eab308]" />}
            </button>
          </DialogClose>

          {/* User Leagues */}
          {leagues.map((league) => (
            <DialogClose key={league.id} asChild>
              <button
                onClick={() => onLeagueChange(league.id)}
                className={cn(
                  'rounded-app group flex w-full cursor-pointer items-center justify-between border p-4 transition-all',
                  effectiveLeagueId === league.id
                    ? 'border-[#eab308]/30 bg-[#eab308]/10'
                    : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                      effectiveLeagueId === league.id
                        ? 'bg-[#eab308] text-black'
                        : 'bg-white/10 text-white/40 group-hover:bg-[#eab308]/20 group-hover:text-[#eab308]',
                    )}
                  >
                    <Users className="h-4 w-4" />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold tracking-tight',
                      effectiveLeagueId === league.id ? 'text-[#eab308]' : 'text-white',
                    )}
                  >
                    {league.name}
                  </span>
                </div>
                {effectiveLeagueId === league.id && (
                  <CheckCircle className="h-5 w-5 text-[#eab308]" />
                )}
              </button>
            </DialogClose>
          ))}

          {leagues.length === 0 && (
            <div className="py-4 text-center text-xs text-white/20 italic">{t('no_leagues')}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
