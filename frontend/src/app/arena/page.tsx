import { ArenaView } from '@/features/arena/components/ArenaView';
import { handleGetActiveCompetitionsServer } from '@/features/competitions/competitions.server';

export default async function ArenaPage() {
  const competitions = await handleGetActiveCompetitionsServer();

  return <ArenaView initialCompetitions={competitions.data || []} />;
}
