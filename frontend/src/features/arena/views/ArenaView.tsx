'use client';

import { useTranslations } from 'next-intl';
import { CompetitionCard } from '../../competitions/components/competition-card';
import { MainMobileNav } from '@/components/layout/MainMobileNav';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useAuthStore } from '@/store/use-auth-store';

import { Competition } from '../../competitions/competitions.types';

interface ArenaViewProps {
  initialCompetitions: Competition[];
}

export function ArenaView({ initialCompetitions }: ArenaViewProps) {
  const t = useTranslations('Arena');

  const user = useAuthStore((state) => state.user);
  const { data } = useSWR(API_ROUTES.COMPETITIONS.ALL, {
    fallbackData: { success: true, competitions: initialCompetitions },
  });

  const renderCompetitionGrid = (comps: Competition[], compact: boolean = false) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both mb-12 grid grid-cols-1 gap-4 duration-700 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {comps.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} compact={compact} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] p-4 pb-24 text-white md:p-6 md:pb-8 lg:p-8">
      <div className="sm:pt-20 md:pt-16" />

      <h1 className="mb-8 text-center text-xl font-medium text-white md:text-3xl">
        {t('welcome', { username: user?.username ?? 'User' })}
      </h1>

      <main className="mx-auto max-w-7xl">
        {data?.competitions?.length > 0 && (
          <div className="mb-10 md:mb-16 lg:mb-20">
            <div className="mb-12 flex items-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              <h2 className="px-4 text-2xl font-black tracking-[0.2em] text-[#eab308] uppercase drop-shadow-[0_0_25px_rgba(234,179,8,0.8)]">
                {t('status.active')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
            </div>
            {renderCompetitionGrid(data?.competitions, false)}
          </div>
        )}
      </main>
      <MainMobileNav user={user} />
    </div>
  );
}
