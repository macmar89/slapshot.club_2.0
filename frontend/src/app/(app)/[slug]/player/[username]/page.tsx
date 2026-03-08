import { CompetitionPlayerDetailView } from '@/features/competitions/player/views/competition-player-detail-view';
import { serverFetch } from '@/lib/api-server';

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const { slug, username } = await params;
  const res = await serverFetch('/auth/me');
  const data = await res.json();
  const currentUser = data?.data?.user;

  return (
    <CompetitionPlayerDetailView
      username={username}
      competitionSlug={slug}
      currentUser={currentUser.user}
    />
  );
}
