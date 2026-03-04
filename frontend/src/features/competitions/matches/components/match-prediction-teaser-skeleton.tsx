'use client';

import React from 'react';

interface MatchPredictionTeaserSkeletonProps {
  count?: number;
}

export function MatchPredictionTeaserSkeleton({ count = 3 }: MatchPredictionTeaserSkeletonProps) {
  return (
    <div className="pointer-events-none divide-y divide-white/5 opacity-60 select-none">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="h-8 w-8 animate-pulse rounded-full border border-white/20 bg-white/30 blur-[2px] md:h-10 md:w-10" />

            <div className="flex flex-col gap-2">
              {/* Username Skeleton */}
              <div className="h-3 w-24 animate-pulse rounded bg-white/30 blur-[3px]" />
              {/* Date Skeleton */}
              <div className="h-2 w-16 animate-pulse rounded bg-white/20 blur-[2px]" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Score Skeleton */}
            <div className="h-6 w-12 animate-pulse rounded bg-white/30 text-lg font-black italic blur-[4px]" />
            {/* Points Skeleton */}
            <div className="h-5 w-10 animate-pulse rounded bg-white/20 blur-[3px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
