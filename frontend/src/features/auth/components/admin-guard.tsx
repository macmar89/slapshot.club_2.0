'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { AccessDenied } from '@/components/common/access-denied';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defer the state setting to avoid the "Avoid calling setState() directly within an effect" warning
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
