'use client';

import { useCompetitionStore } from '@/store/use-competition-store';
import { useEffect } from 'react';

export function CompetitionStoreSync({ name }: { name: string }) {
  const setCompetition = useCompetitionStore((s) => s.setCompetition);

  useEffect(() => {
    setCompetition({ name });
  }, [name, setCompetition]);

  return null;
}
