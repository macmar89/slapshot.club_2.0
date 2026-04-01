'use client';

import { useStandalone } from '@/hooks/use-standalone';
import { MobileTabNav } from '@/components/layout/mobile-tab-nav';

interface PwaOnlyNavProps {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
}

export const PwaOnlyNav = ({ leftChildren, rightChildren }: PwaOnlyNavProps) => {
  const isStandalone = useStandalone();

  if (!isStandalone) return null;

  return <MobileTabNav leftChildren={leftChildren} rightChildren={rightChildren} />;
};
