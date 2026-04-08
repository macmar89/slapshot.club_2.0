'use client';

import { useTranslations } from 'next-intl';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

export const UserManualRules = () => {
  const t = useTranslations('UserManual');

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
          <span className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold">
            01
          </span>
          {t('scoring_title')}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <IceGlassCard className="border-primary/20 bg-primary/5 hover:border-primary/40 p-6 transition-colors">
            <h3 className="text-primary/80 mb-3 font-bold">{t('exact_score')}</h3>
            <p className="text-primary text-3xl font-black drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
              {t('points', { count: 5 })}
            </p>
          </IceGlassCard>
          <IceGlassCard className="border-blue-500/20 bg-blue-500/5 p-6 transition-colors hover:border-blue-500/40">
            <h3 className="mb-3 font-bold text-blue-400">{t('correct_diff')}</h3>
            <p className="text-3xl font-black text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {t('points', { count: 3 })}
            </p>
          </IceGlassCard>
          <IceGlassCard className="border-green-500/20 bg-green-500/5 p-6 transition-colors hover:border-green-500/40">
            <h3 className="mb-3 font-bold text-green-400">{t('winner_only')}</h3>
            <p className="text-3xl font-black text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              {t('points', { count: 2 })}
            </p>
          </IceGlassCard>
        </div>
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
          <span className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold">
            02
          </span>
          {t('general_rules_title')}
        </h2>
        <div className="grid gap-3">
          {Object.keys(t.raw('rules_list')).map((key) => (
            <IceGlassCard
              key={key}
              className="border-white/5 p-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                <span className="leading-relaxed font-medium text-white/80">
                  {t(`rules_list.${key}`)}
                </span>
              </div>
            </IceGlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};
