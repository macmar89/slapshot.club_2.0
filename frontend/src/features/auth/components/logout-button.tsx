'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { handlePostLogout } from '../auth.api';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const t = useTranslations('Auth');

  const handleLogout = async () => {
    try {
      await handlePostLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (children) {
    return (
      <button onClick={handleLogout} className={className}>
        {children}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      color="destructive"
      size="sm"
      onClick={handleLogout}
      className={cn(
        'border-destructive/20 text-destructive hover:bg-destructive/10 gap-2 border transition-colors',
        className,
      )}
    >
      <LogOut className="h-4 w-4" />
      <span className="inline">{t('logout')}</span>
    </Button>
  );
}
