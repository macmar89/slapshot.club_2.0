import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  pulse?: 'normal' | 'slow' | 'none';
}

export const Skeleton = ({ className, pulse = 'normal' }: SkeletonProps) => {
  const pulseClasses = {
    normal: 'animate-pulse',
    slow: 'animate-pulse-slow',
    none: '',
  };

  return (
    <div
      className={cn('rounded-md bg-slate-100 dark:bg-slate-800', pulseClasses[pulse], className)}
    />
  );
};
