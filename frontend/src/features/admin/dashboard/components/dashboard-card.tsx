'use client';

import React from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { type DashboardCardProps } from '../types';

export const DashboardCard = ({ title, icon: Icon, children }: DashboardCardProps) => (
  <IceGlassCard
    className="flex flex-col border-white/10 bg-white/5 shadow-2xl"
    backdropBlur="xl"
    withGradient
  >
    <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-black tracking-widest text-white/80 uppercase italic">{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-1">{children}</div>
  </IceGlassCard>
);
