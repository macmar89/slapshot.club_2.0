'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps extends ButtonProps {
  label?: React.ReactNode;
  fallbackPath?: string;
}

export function BackButton({
  className,
  label,
  onClick,
  fallbackPath,
  children,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }

    // Default behavior
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackPath) {
      router.push(fallbackPath);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        'hover:text-warning flex h-auto cursor-pointer items-center gap-2 self-start p-0 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-transparent',
        className,
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {label || children || 'Späť'}
    </Button>
  );
}
