import { MatchDetailView } from '@/features/competitions/matches/views/match-detail-view';
import { Suspense } from 'react';

export default function MatchDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchDetailView />
    </Suspense>
  );
}
