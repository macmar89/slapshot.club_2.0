import { ArenaView } from '@/features/arena/views/arena-view';
import { getActiveCompetitionsServer, getCompetitionCountsServer } from '@/features/competitions/competitions.server';

export default async function ArenaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const tab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'active';

  const [competitionsResult, countsResult] = await Promise.all([
    getActiveCompetitionsServer(tab),
    getCompetitionCountsServer(),
  ]);

  const competitions = competitionsResult.success ? competitionsResult.data : [];
  const counts = countsResult.success ? countsResult.data : { active: 0, upcoming: 0, finished: 0 };

  return <ArenaView initialCompetitions={competitions} initialCounts={counts} currentTab={tab} />;
}
