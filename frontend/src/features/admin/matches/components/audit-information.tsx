'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { ShieldCheck, Activity } from 'lucide-react';

interface AuditInformationProps {
  checkedBy?: string | null;
  checkedAt?: string | null;
  rankedAt?: string | null;
  isRanked: boolean;
}

export const AuditInformation = ({
  checkedBy,
  checkedAt,
  rankedAt,
  isRanked,
}: AuditInformationProps) => {
  const t = useTranslations('Admin.Matches.detail');

  if (!checkedBy && !isRanked) return null;

  return (
    <IceGlassCard className="border-white/10 overflow-hidden">
      <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-primary/60" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
          {t('audit_log')}
        </span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 ring-inset">
        {checkedBy && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {t('checked_by')}
            </span>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xs font-black text-primary">{checkedBy.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white/80">{checkedBy}</span>
                <span className="text-[10px] font-mono text-white/30">
                  {checkedAt ? format(new Date(checkedAt), 'dd.MM.yyyy HH:mm') : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
        {isRanked && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {t('ranked_at')}
            </span>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white/80">{t('already_ranked')}</span>
                <span className="text-[10px] font-mono text-white/30">
                  {rankedAt ? format(new Date(rankedAt), 'dd.MM.yyyy HH:mm') : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </IceGlassCard>
  );
};
