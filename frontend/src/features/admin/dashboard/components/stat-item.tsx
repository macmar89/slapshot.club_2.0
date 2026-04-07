'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type StatItemProps } from '../types';

export const StatItem = ({ label, value, icon: Icon, color = 'primary' }: StatItemProps) => {
  const colorMap = {
    primary: 'border-primary/20 bg-primary/10 text-primary',
    red: 'border-red-500/20 bg-red-500/10 text-red-500',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
    orange: 'border-orange-500/20 bg-orange-500/10 text-orange-500',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/5">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl border',
            colorMap[color],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="mb-0.5 text-[10px] leading-none font-black tracking-widest text-white/30 uppercase">
            {label}
          </span>
          <span className="text-2xl leading-none font-black text-white italic drop-shadow-md">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};
