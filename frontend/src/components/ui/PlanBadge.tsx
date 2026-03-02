'use client';

import { cn } from '@/lib/utils';

export type PlanType = 'free' | 'pro' | 'vip';

interface PlanBadgeProps {
  plan: PlanType;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const styles = {
    free: 'bg-white/10 text-white/40 border-white/10',
    pro: 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]',
    vip: 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
  };

  return (
    <span
      className={cn(
        'rounded border px-2 py-0.5 text-[10px] leading-none font-black tracking-wider uppercase italic',
        styles[plan],
        className,
      )}
    >
      {plan}
    </span>
  );
}
