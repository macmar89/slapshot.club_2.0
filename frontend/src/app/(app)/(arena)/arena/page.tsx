import { ArenaView } from '@/features/arena/views/arena-view';
import { getActiveCompetitionsServer } from '@/features/competitions/competitions.server';

export default async function ArenaPage() {
  const result = await getActiveCompetitionsServer();

  const competitions = result.success ? result.data : [];

  return <ArenaView initialCompetitions={competitions} />;
}
