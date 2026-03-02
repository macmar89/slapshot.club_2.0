import { eq } from 'drizzle-orm';
import { db } from '../db';
import type { AppLocale } from '../types/global';

export const findAllCompetitions = async (userId: string, locale: AppLocale) => {
  const competitions = await db.query.competitions.findMany({
    columns: {
      id: true,
      slug: true,
      status: true,
      isRegistrationOpen: true,
      totalParticipants: true,
      startDate: true,
    },
    where: (competitions) => eq(competitions.status, 'active'),
    with: {
      locales: {
        columns: {
          name: true,
          description: true,
        },
        where: (locales, { eq }) => eq(locales.locale, locale as AppLocale),
        limit: 1,
      },
      leaderboardEntries: {
        columns: {
          totalPoints: true,
          currentRank: true,
        },
        where: (leaderboardEntries, { eq }) => eq(leaderboardEntries.userId, userId),
        limit: 1,
      },
    },
    orderBy: (competitions, { asc }) => [asc(competitions.sortOrder)],
  });

  return competitions.map((competition) => ({
    id: competition.id,
    slug: competition.slug,
    name: competition.locales[0]?.name || '',
    description: competition.locales[0]?.description || '',
    status: competition.status,
    startDate: competition.startDate,
    isRegistrationOpen: competition.isRegistrationOpen,
    totalParticipants: competition.totalParticipants,
    isJoined: !!competition.leaderboardEntries[0],
    leaderboardEntries: competition.leaderboardEntries[0] ?? {},
  }));
};
