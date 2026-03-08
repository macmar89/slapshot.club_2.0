import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { calculateRate, roundTo } from '../utils/math';

export const getLeaderboard = async (slug: string, userId: string) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const entries = await db.query.leaderboardEntries.findMany({
    columns: {
      id: true,
      userId: true,
      currentRank: true,
      totalPoints: true,
      totalMatches: true,
      exactGuesses: true,
      correctTrends: true,
      correctDiffs: true,
      wrongGuesses: true,
    },
    where: (leaderboardEntries) => eq(leaderboardEntries.competitionId, competition.id),
    with: {
      user: {
        columns: {
          username: true,
        },
      },
    },
    orderBy: (leaderboardEntries, { asc }) => [asc(leaderboardEntries.currentRank)],
  });

  return entries.map((entry) => {
    return {
      id: entry.id,
      userId: entry.userId,
      username: entry.user.username,
      isCurrentUser: entry.userId === userId,
      currentRank: entry.currentRank,
      totalPoints: entry.totalPoints,
      totalPredictions: entry.totalMatches,
      exactGuesses: entry.exactGuesses,
      correctTrends: entry.correctTrends,
      correctDiffs: entry.correctDiffs,
      wrongGuesses: entry.wrongGuesses,
    };
  });
};

export const getMemberStatsBySlug = async (userId: string, slug: string) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    columns: {
      totalPoints: true,
      totalMatches: true,
      currentRank: true,
      exactGuesses: true,
      correctTrends: true,
      correctDiffs: true,
      wrongGuesses: true,
      createdAt: true,
    },
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.competitionId, competition.id),
      ),
  });

  if (!leaderboardEntry) {
    throw new Error(CompetitionErrors.USER_NOT_MEMBER_OF_COMPETITION);
  }

  const points = leaderboardEntry.totalPoints || 0;
  const games = leaderboardEntry.totalMatches || 0;

  const totalCorrect =
    (leaderboardEntry.exactGuesses || 0) +
    (leaderboardEntry.correctTrends || 0) +
    (leaderboardEntry.correctDiffs || 0);

  return {
    ...leaderboardEntry,
    winRate: calculateRate(totalCorrect, games),
    pointsPerGame: roundTo(points / (games || 1), 2),
    totalCorrect,
  };
};
