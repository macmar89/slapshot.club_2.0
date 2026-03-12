import React from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { SubscriptionPlan } from '@/features/users/users.types';

interface PlanBadgeProps {
  className?: string;
}

export const PlanBadge = ({ className }: PlanBadgeProps) => {
  const user = useAuthStore((state) => state.user);

  const styles: Record<SubscriptionPlan, string> = {
    free: 'bg-white/10 text-white/40 border-white/10',
    starter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pro: 'bg-warning/20 text-warning border-warning/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]',
    vip: 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
  };

  return (
    <span
      className={cn(
        'rounded border px-2 py-0.5 text-[10px] leading-none font-black tracking-wider uppercase italic',
        styles[user?.subscriptionPlan || 'free'],
        className,
      )}
    >
      {user?.subscriptionPlan}
    </span>
  );
};
