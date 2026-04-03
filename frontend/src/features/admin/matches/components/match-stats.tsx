'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { BarChart3 } from 'lucide-react';

interface MatchStatsProps {
  totalPredictionsCount: number;
  stageType: string;
  resultEndingType: string;
  apiHockeyId?: string | null;
  apiHockeyStatus?: string | null;
}

export const MatchStats = ({
  totalPredictionsCount,
  stageType,
  resultEndingType,
  apiHockeyId,
  apiHockeyStatus,
}: MatchStatsProps) => {
  const t = useTranslations('Admin.Matches.detail');

  return (
    <IceGlassCard className="border-white/10 overflow-hidden">
      <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
        <BarChart3 className="h-3.5 w-3.5 text-primary/60" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
          {t('stats_and_api')}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center group">
            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{t('prediction_count')}</span>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-black px-3 py-0.5">
              {totalPredictionsCount}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">{t('stage_type')}</span>
            <span className="text-xs font-bold uppercase tracking-tight text-white/70">{stageType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">{t('ending_type')}</span>
            <Badge variant="secondary" className="text-[9px] uppercase font-black bg-white/5 border-white/10">
              {resultEndingType}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-5 bg-white/[0.01]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">{t('api_hockey_id')}</span>
            <code className="text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {apiHockeyId || '-'}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">{t('api_hockey_status')}</span>
            <Badge variant="outline" className="text-[10px] uppercase font-black border-white/20 text-white/60">
              {apiHockeyStatus || '-'}
            </Badge>
          </div>
        </div>
      </div>
    </IceGlassCard>
  );
};
