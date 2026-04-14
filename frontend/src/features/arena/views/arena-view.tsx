'use client';

import { useTranslations } from 'next-intl';
import { CompetitionCard } from '../../competitions/components/competition-card';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { CustomTabs, TabItem } from '@/components/common/custom-tabs';

import { Competition } from '../../competitions/competitions.types';
import { MissingTipsSummary } from '../components/missing-tips-summary';

interface ArenaViewProps {
  initialCompetitions: Competition[];
  initialCounts: { active: number; upcoming: number; finished: number };
  currentTab: string;
}

export function ArenaView({ initialCompetitions, initialCounts, currentTab }: ArenaViewProps) {
  const t = useTranslations('Arena');

  const user = useAuthStore((state) => state.user);

  const { data: countsData } = useSWR(API_ROUTES.COMPETITIONS.COUNTS, {
    fallbackData: { success: true, data: initialCounts },
  });

  const { data } = useSWR(`${API_ROUTES.COMPETITIONS.ALL}?tab=${currentTab}`, {
    fallbackData: { success: true, competitions: initialCompetitions },
  });

  const counts = countsData?.data || initialCounts;

  const tabItems: TabItem[] = [
    {
      value: 'active',
      label: t('status.active'),
      badge: (
        <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-white/70 group-data-[state=active]:bg-black/20 group-data-[state=active]:text-black">
          {counts.active}
        </span>
      ),
    },
    {
      value: 'upcoming',
      label: t('status.upcoming', { fallback: 'Pripravované' }),
      badge: (
        <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-white/70 group-data-[state=active]:bg-black/20 group-data-[state=active]:text-black">
          {counts.upcoming}
        </span>
      ),
    },
    {
      value: 'finished',
      label: t('status.finished', { fallback: 'Ukončené' }),
      badge: (
        <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold text-white/70 group-data-[state=active]:bg-black/20 group-data-[state=active]:text-black">
          {counts.finished}
        </span>
      ),
    },
  ];

  const renderCompetitionGrid = (comps: Competition[], compact: boolean = false) => (
    <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {comps.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} compact={compact} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] pb-24 text-white md:pb-8">
      <h1 className="mb-6 text-center text-xl font-medium text-white md:text-3xl">
        {t('welcome', { username: user?.username ?? 'User' })}
      </h1>

      <main className="mx-auto max-w-7xl">
        <MissingTipsSummary />

        <CustomTabs items={tabItems} defaultValue="active" className="mb-4">
          {data?.competitions?.length > 0 ? (
            <div className="mt-6 mb-10 md:mb-16 lg:mb-20">
              {renderCompetitionGrid(data?.competitions, false)}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-12 text-center shadow-xl backdrop-blur-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <Trophy className="h-8 w-8 text-white/40" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg font-medium text-white">{t('empty_state_title')}</h3>
              <p className="max-w-md text-sm text-slate-400">{t('empty_state_desc')}</p>
            </div>
          )}
        </CustomTabs>
      </main>
    </div>
  );
}
