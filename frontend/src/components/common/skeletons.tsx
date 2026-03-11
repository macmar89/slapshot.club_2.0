'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * ListSkeleton - For lists like members or leaderboards.
 * Displays an avatar (circle) and two lines of text side by side.
 */
interface ListSkeletonProps {
  rows?: number;
  className?: string;
}

export const ListSkeleton = ({ rows = 5, className }: ListSkeletonProps) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2 opacity-50" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * CardSkeleton - For dashboard-like cards.
 * Displays a large rectangular block with a smaller text block below.
 */
interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <div className={cn('space-y-4 rounded-xl border border-white/5 bg-white/5 p-6', className)}>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2 opacity-50" />
      </div>
    </div>
  );
};

/**
 * TextSkeleton - For loading text blocks/paragraphs.
 * Displays multiple lines with varying widths.
 */
interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export const TextSkeleton = ({ lines = 3, className }: TextSkeletonProps) => {
  const lineWidths = ['w-full', 'w-[90%]', 'w-[95%]', 'w-[85%]', 'w-[92%]'];

  return (
    <div className={cn('space-y-3', className)}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3 rounded',
            lineWidths[i % lineWidths.length],
            i === lines - 1 && lines > 1 ? 'w-[60%]' : '', // Shorten last line
          )}
        />
      ))}
    </div>
  );
};
