import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  hideDescriptionOnMobile?: boolean;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  hideDescriptionOnMobile,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col justify-between gap-6 md:flex-row md:items-end', className)}>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl leading-none font-black tracking-tighter text-white uppercase italic sm:text-left md:text-5xl">
          <span className="text-primary">{title}</span>
        </h1>
        {description && (
          <p
            className={cn(
              'text-[0.65rem] font-bold tracking-[0.3em] text-white uppercase md:text-xs',
              hideDescriptionOnMobile && 'hidden md:block',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
