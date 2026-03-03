import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { API_ROUTES } from '@/lib/api-routes';
import { Trophy } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/useAuthStore';
import { UserCompetitionStats } from '../dashboard.types';
import { WinRate } from '@/components/common/win-rate';

export function UserHeroCard() {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations('Dashboard.hero');
  const locale = useLocale();

  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useSWR<UserCompetitionStats>(
    API_ROUTES.COMPETITIONS.LEADERBOARD.ME(slug),
  );

  if (isLoading || !data) {
    return (
      <Skeleton className="flex h-[160px] animate-pulse flex-col justify-center p-4 md:p-8 lg:col-span-8" />
    );
  }

  const registrationDate = new Date(data.createdAt).toLocaleDateString(
    locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US',
    {
      month: 'short',
      year: 'numeric',
    },
  );

  return (
    <IceGlassCard
      className="group overflow-hidden lg:col-span-4"
      contentClassName="flex flex-col"
      withGradient
    >
      <div className="relative p-6">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
          <Trophy className="h-24 w-24 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-tr from-yellow-500 to-yellow-200 text-xl font-black text-black">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xl leading-none font-black text-white uppercase">
                {user?.username}
              </div>
              <div className="mt-1 text-[9px] font-medium tracking-tight text-white/50 uppercase">
                {t('member_since', { date: registrationDate })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="mb-1 text-center text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('rank')}
              </div>
              <div className="text-center text-2xl font-black text-white italic">
                #{data?.currentRank || '--'}
              </div>
            </div>
            <div>
              <div className="mb-1 text-center text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('points')}
              </div>
              <div className="text-center text-2xl font-black text-amber-400 italic">
                {data?.totalPoints || 0}
              </div>
            </div>
            <div>
              <div className="mb-1 text-center text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('win_rate')}
              </div>
              <WinRate rate={data?.winRate} className="text-center text-2xl" />
            </div>
            <div>
              <div className="mb-1 text-center text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('avg_points')}
              </div>
              <div className="text-center text-2xl font-black text-white/60 italic">
                {data?.pointsPerGame}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overlay/Card Style */}
      <div className="mt-auto grid grid-cols-4 divide-x divide-white/5 border-t border-white/5 bg-black/40 p-4 text-center">
        <div>
          <div className="mb-0.5 text-[8px] font-bold text-white/30 uppercase">
            {t('stats.tips')}
          </div>
          <div className="text-sm font-black text-white">{data?.totalMatches || 0}</div>
        </div>
        <div>
          <div className="mb-0.5 text-[8px] font-bold text-white/30 uppercase">
            {t('stats.exact')}
          </div>
          <div className="text-sm font-black text-green-500">{data?.exactGuesses || 0}</div>
        </div>
        <div>
          <div className="mb-0.5 text-[8px] font-bold text-white/30 uppercase">
            {t('stats.diff')}
          </div>
          <div className="text-sm font-black text-yellow-500">{data?.correctDiffs || 0}</div>
        </div>
        <div>
          <div className="mb-0.5 text-[8px] font-bold text-white/30 uppercase">
            {t('stats.winner')}
          </div>
          <div className="text-sm font-black text-blue-500">{data?.correctTrends || 0}</div>
        </div>
      </div>
    </IceGlassCard>
  );
}
