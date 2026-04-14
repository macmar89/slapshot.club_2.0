'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MatchInfoTab } from '../components/match-info-tab';
import { MatchPredictionTab } from '../components/match-predictions-tab';
import { BackLink } from '@/components/common/back-link';
import { useAppParams } from '@/hooks/use-app-params';

export const MatchDetailView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = useAppParams(['slug']);

  const t = useTranslations('Dashboard.matches');

  const activeTab = searchParams.get('tab') || 'info';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleTabChange = (value: string) => {
    const queryString = createQueryString('tab', value);
    router.replace(`${pathname}?${queryString}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <BackLink href={`/${slug}/matches`} label={t('back_to_matches')} />
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">{t('info_tab')}</TabsTrigger>
          <TabsTrigger value="predictions">{t('predictions_tab')}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="info" className="p-0">
        <MatchInfoTab />
      </TabsContent>

      <TabsContent value="predictions" className="p-0">
        <MatchPredictionTab />
      </TabsContent>
    </Tabs>
  );
};
