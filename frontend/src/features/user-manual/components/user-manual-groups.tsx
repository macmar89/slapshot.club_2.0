'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Lock,
  Trophy,
  Zap,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export const UserManualGroups = () => {
  const t = useTranslations('UserManual');

  const groupFeatures = [
    {
      icon: Users,
      title: t('groups_features.community.title'),
      description: t('groups_features.community.description'),
    },
    {
      icon: ShieldCheck,
      title: t('groups_features.management.title'),
      description: t('groups_features.management.description'),
    },
    {
      icon: UserPlus,
      title: t('groups_features.codes.title'),
      description: t('groups_features.codes.description'),
    },
    {
      icon: Lock,
      title: t('groups_features.privacy.title'),
      description: t('groups_features.privacy.description'),
    },
  ];

  const plans: {
    id: 'free' | 'starter' | 'pro' | 'vip';
    icon: LucideIcon;
    className: string;
    limits: { create: number; join: number; boost: number };
  }[] = [
    {
      id: 'free',
      icon: Trophy,
      className: 'text-white/40',
      limits: { create: 0, join: 1, boost: 0 },
    },
    {
      id: 'starter',
      icon: Zap,
      className: 'text-blue-400',
      limits: { create: 1, join: 2, boost: 0 },
    },
    {
      id: 'pro',
      icon: Zap,
      className: 'text-primary',
      limits: { create: 2, join: 5, boost: 5 },
    },
    {
      id: 'vip',
      icon: Crown,
      className: 'text-warning',
      limits: { create: 5, join: 10, boost: 10 },
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <IceGlassCard className="flex flex-col p-4 sm:p-8">
        <section className="mb-6">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
            <span className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold">
              01
            </span>
            {t('tabs_groups')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {groupFeatures.map((feature, index) => (
              <IceGlassCard
                key={index}
                className="hover:border-primary/20 group border-white/5 p-6 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="text-primary rounded-xl bg-white/5 p-3 shadow-inner transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
                  </div>
                </div>
              </IceGlassCard>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="mb-2 flex items-center gap-3 text-2xl font-semibold text-white">
              <span className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold">
                02
              </span>
              {t('groups_limits_title')}
            </h2>
            <p className="text-white/60">{t('groups_limits_desc')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <IceGlassCard
                key={plan.id}
                className={`border-white/5 p-5 transition-all duration-300 hover:border-white/10 ${
                  plan.id === 'pro' ? 'border-primary/20 bg-primary/5' : ''
                } ${plan.id === 'vip' ? 'border-warning/20 bg-warning/5' : ''}`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-lg bg-white/5 p-2 ${plan.className}`}>
                    <plan.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-black tracking-tight text-white uppercase italic">
                    {t(`groups_limits.plan_${plan.id}`)}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">{t('groups_limits.create')}</span>
                    <span className="font-bold text-white">
                      {plan.limits.create === 0
                        ? t('groups_limits.none')
                        : t('groups_limits.count', { count: plan.limits.create })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">{t('groups_limits.join')}</span>
                    <span className="font-bold text-white">
                      {t('groups_limits.count', { count: plan.limits.join })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">{t('groups_limits.boost')}</span>
                    <span
                      className={`font-bold ${
                        plan.limits.boost > 0 ? 'text-green-400' : 'text-white/40'
                      }`}
                    >
                      {plan.limits.boost > 0
                        ? t('groups_limits.boost_count', { count: plan.limits.boost })
                        : '—'}
                    </span>
                  </div>
                </div>
              </IceGlassCard>
            ))}
          </div>
        </section>
      </IceGlassCard>
    </div>
  );
};
