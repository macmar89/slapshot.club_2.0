'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { GroupJoinForm } from '@/features/competitions/groups/components/group-join-form';

export function GroupJoinCard({ className }: { className?: string }) {
  const t = useTranslations('Groups');

  return (
    <IceGlassCard className={`border-primary/10 ${className ?? ''}`}>
      <div className="p-6 sm:p-8">
        <h3 className="text-primary font-display mb-3 text-center text-base leading-tight font-black tracking-widest uppercase italic drop-shadow-sm sm:text-lg">
          {t('join_title') || 'Máš pozvánku?'}
        </h3>
        <p className="mx-auto mb-8 max-w-[200px] text-center text-[10px] leading-relaxed font-bold tracking-[0.1em] text-white/50 uppercase sm:text-[11px]">
          {t('join_description') || 'Zadaj kód od kamoša a pridaj sa do partie.'}
        </p>

        <div className="group/form relative">
          <div className="bg-primary/5 pointer-events-none absolute -inset-4 rounded-full opacity-0 blur-2xl transition-opacity group-hover/form:opacity-100" />
          <GroupJoinForm />
        </div>
      </div>
    </IceGlassCard>
  );
}
