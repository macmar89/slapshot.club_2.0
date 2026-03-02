import { ArenaView } from '@/features/arena/components/ArenaView';
import { handleGetActiveCompetitionsServer } from '@/features/competitions/competitions.api';

export default async function ArenaPage() {
  const competitions = await handleGetActiveCompetitionsServer();

  return <ArenaView initialCompetitions={competitions.competitions} />;
}
