import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import type { AppLocale } from '../types/global';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { competitions, leaderboardEntries } from '../db/schema';
import { calculateRate, roundTo } from '../utils/math';
import { AppError } from '../utils/appError';
import { AuthMessages } from '../shared/constants/messages/auth.messages';

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
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.competitionId, competitionId),
      ),
  });

  if (leaderboardEntry) {
    throw new AppError(CompetitionErrors.USER_ALREADY_JOINED_COMPETITION);
  }

  if (!competition.isRegistrationOpen) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_OPEN_FOR_REGISTRATION);
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
          description: true,
        },
        where: (locales, { eq }) => eq(locales.locale, locale as AppLocale),
        limit: 1,
      },
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  return {
    name: competition?.locales[0]?.name ?? null,
    description: competition?.locales[0]?.description ?? null,
  };
};

export const getPlayerStats = async (username: string, slug: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(sql`lower(${users.username})`, username.toLowerCase()),
  });

  if (!user) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND);
  }

  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    columns: {
      currentRank: true,
      totalPoints: true,
      totalMatches: true,
      exactGuesses: true,
      correctTrends: true,
      correctDiffs: true,
      wrongGuesses: true,
      currentForm: true,
    },
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, user.id),
        eq(leaderboardEntries.competitionId, competition.id),
      ),
  });

  if (!leaderboardEntry) {
    throw new AppError(CompetitionErrors.USER_NOT_MEMBER_OF_COMPETITION);
  }

  const points = leaderboardEntry.totalPoints || 0;
  const games = leaderboardEntry.totalMatches || 0;

  const totalCorrect =
    (leaderboardEntry.exactGuesses || 0) +
    (leaderboardEntry.correctTrends || 0) +
    (leaderboardEntry.correctDiffs || 0);

  return {
    userId: user.id,
    username: user.username,
    subscriptionPlan: user.subscriptionPlan,
    createdAt: user.createdAt,

    ...leaderboardEntry,

    successRate: calculateRate(totalCorrect, games),
    averagePoints: roundTo(points / (games || 1), 2),
    points,
  };
};

export const getPlayerPredictions = async (
  username: string,
  slug: string,
  viewerId: string,
  viewerPlan: string,
) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) {
    throw new AppError('User not found');
  }

  const isOwner = user.id === viewerId;
  const isLocked = !isOwner && viewerPlan === 'free';

  if (isLocked) {
    return {
      docs: [],
      hasNextPage: false,
      totalDocs: 0,
      isLocked: true,
    };
  }

  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  // Fetch predictions for this user in this competition
  const userPredictions = await db.query.predictions.findMany({
    where: (predictions, { eq, and }) =>
      and(eq(predictions.userId, user.id), eq(predictions.competitionId, competition.id)),
    with: {
      match: {
        with: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
    orderBy: (predictions, { desc }) => [desc(predictions.createdAt)],
    limit: 50, // Simplified for now, can add pagination if needed
  });

  return {
    docs: userPredictions,
    hasNextPage: false,
    totalDocs: userPredictions.length,
    isLocked: false,
  };
};
