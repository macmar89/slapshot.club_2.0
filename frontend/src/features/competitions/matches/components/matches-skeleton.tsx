'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';

function MatchCardSkeleton() {
  return (
    <IceGlassCard backdropBlur="md" className="animate-pulse border-white/5 p-3 md:p-6">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div className="h-6 w-20 rounded-full bg-white/5" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/5" />
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex w-1/3 flex-col items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white/5 md:h-20 md:w-20" />
          <div className="h-3 w-12 rounded bg-white/10" />
          <div className="hidden h-4 w-20 rounded bg-white/5 md:block" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="h-10 w-20 rounded-lg bg-white/5" />
        </div>
        <div className="flex w-1/3 flex-col items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white/5 md:h-20 md:w-20" />
          <div className="h-3 w-12 rounded bg-white/10" />
          <div className="hidden h-4 w-20 rounded bg-white/5 md:block" />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 border-t border-white/5 pt-6 md:flex-row md:items-center">
        <div className="max-w-xs flex-1 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-white/5" />
          <div className="flex justify-between">
            <div className="h-3 w-8 rounded bg-white/5" />
            <div className="h-3 w-12 rounded bg-white/5" />
            <div className="h-3 w-8 rounded bg-white/5" />
          </div>
        </div>
        <div className="ml-auto h-10 w-32 rounded-xl bg-white/5 md:ml-0" />
      </div>
    </IceGlassCard>
  );
}

export function MatchesSkeleton() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-white/10 md:h-12 md:w-64" />
          <div className="h-4 w-32 animate-pulse rounded bg-white/5 md:w-40" />
        </div>

        {/* Day Selector Skeleton */}
        <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="flex min-w-[100px] flex-col items-center gap-2 px-4 md:min-w-[140px] md:px-6">
            <div className="h-3 w-16 rounded bg-white/10" />
            <div className="h-5 w-24 rounded bg-white/5" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/10" />
        </div>
      </div>

      {/* Matches Grid Skeleton */}
      <div className="-mx-1 grid grid-cols-1 gap-3 md:mx-0 md:gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
