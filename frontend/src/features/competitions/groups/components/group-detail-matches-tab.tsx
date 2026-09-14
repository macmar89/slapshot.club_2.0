'use client';

import { useTranslations } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import { DateSwitcher } from '@/components/common/date-switcher/date-switcher';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useUserTimezone } from '@/hooks/use-user-config';
import { Match } from '@/features/competitions/matches/matches.types';
import { MatchCard } from '@/features/competitions/matches/components/match-card';
import { MatchesSkeleton } from '@/features/competitions/matches/components/matches-skeleton';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';
import { useRouter, usePathname } from '@/i18n/routing';
import { useAppParams } from '@/hooks/use-app-params';

interface GroupDetailMatchesTabProps {
  groupSlug: string;
}

export const GroupDetailMatchesTab = ({ groupSlug }: GroupDetailMatchesTabProps) => {
  const t = useTranslations('Dashboard.matches');

  const userTimezone = useUserTimezone();
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = useAppParams(['slug']);

  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

  const handleDateChange = (newDate: string) => {
    let resolvedPath = pathname;
    resolvedPath = resolvedPath.replace('[slug]', slug);
    resolvedPath = resolvedPath.replace('[groupSlug]', groupSlug);

    router.push(`${resolvedPath}?tab=matches&date=${newDate}` as any, { scroll: false });
  };

  const { data, mutate, isLoading, error } = useSWR<Match[]>(
    groupSlug ? API_ROUTES.GROUPS.MATCHES.LIST(groupSlug, selectedDate, userTimezone) : null,
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <DataLoader
        data={data}
        isLoading={isLoading}
        error={error}
        skeleton={<MatchesSkeleton />}
        notFound={<ErrorView />}
      >
        {(data) => (
          <div>
            <div className="ms-auto mb-6 flex w-fit items-center gap-2 md:gap-4">
              <DateSwitcher onDateChange={handleDateChange} />
            </div>

            <div className="-mx-1 grid grid-cols-1 gap-3 md:mx-0 md:gap-6 lg:grid-cols-2">
              {data && data?.length > 0 ? (
                data.map((match: Match) => (
                  <MatchCard key={match.id} match={match} refresh={mutate} groupSlug={groupSlug} />
                ))
              ) : (
                <IceGlassCard className="border-dashed border-white/10 bg-white/[0.02] p-12 lg:col-span-2">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <CalendarDays className="h-12 w-12 text-white/10" />
                    <p className="text-sm font-bold tracking-widest text-white/30 uppercase">
                      {t('no_matches_day')}
                    </p>
                  </div>
                </IceGlassCard>
              )}
            </div>
          </div>
        )}
      </DataLoader>
    </div>
  );
};
