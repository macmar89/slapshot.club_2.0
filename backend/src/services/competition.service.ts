import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import type { AppLocale } from '../types/global';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { competitions, leaderboardEntries } from '../db/schema';

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

  return (
    competitions.map((competition) => ({
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
    })) ?? []
  );
};

export const joinCompetition = async (userId: string, competitionId: string) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
      seasonYear: true,
      isRegistrationOpen: true,
    },
    where: (competitions, { eq }) => eq(competitions.id, competitionId),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.competitionId, competitionId),
      ),
  });

  if (leaderboardEntry) {
    throw new Error(CompetitionErrors.USER_ALREADY_JOINED_COMPETITION);
  }

  if (!competition.isRegistrationOpen) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_OPEN_FOR_REGISTRATION);
  }

  await db.transaction(async (tx) => {
    await tx.insert(leaderboardEntries).values({
      userId,
      competitionId,
      seasonYear: competition.seasonYear,
      totalPoints: 0,
      currentRank: 0,
    });

    await tx
      .update(competitions)
      .set({
        totalParticipants: sql`${competitions.totalParticipants} + 1`,
      })
      .where(eq(competitions.id, competitionId));
  });

  return competition;
};

export const findPublicCompetitionName = async (slug: string, locale: AppLocale) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    with: {
      locales: {
        columns: {
          name: true,
        },
        where: (locales, { eq }) => eq(locales.locale, locale as AppLocale),
        limit: 1,
      },
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  return { name: competition?.locales[0]?.name ?? null };
};
