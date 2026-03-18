import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { predictions, leaderboardEntries } from '../db/schema/index.js';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors.js';
import { calculateRate, roundTo } from '../utils/math.js';
import { logger } from '../utils/logger.js';

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
      totalPredictions: true,
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
      totalPredictions: entry.totalPredictions,
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
      totalPredictions: true,
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
  const games = leaderboardEntry.totalPredictions || 0;

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

export const refreshCompetitionRankings = async (competitionId: string) => {
  const startTime = Date.now();

  // 1. Sum up all stats from predictions for this competition
  const stats = await db
    .select({
      userId: predictions.userId,
      totalPoints: sql<number>`sum(${predictions.points})::int`,
      totalPredictions: sql<number>`count(${predictions.id})::int`,
      exactGuesses: sql<number>`count(*) filter (where ${predictions.isExact} = true)::int`,
      correctTrends: sql<number>`count(*) filter (where ${predictions.isTrend} = true)::int`,
      correctDiffs: sql<number>`count(*) filter (where ${predictions.isDiff} = true)::int`,
      wrongGuesses: sql<number>`count(*) filter (where ${predictions.isWrong} = true)::int`,
    })
    .from(predictions)
    .where(and(eq(predictions.competitionId, competitionId), eq(predictions.status, 'evaluated')))
    .groupBy(predictions.userId);

  if (stats.length === 0) return;

  // 2. Update leaderboard entries with new totals
  await db.transaction(async (tx) => {
    for (const userStat of stats) {
      const { userId, ...data } = userStat;

      const existingEntry = await tx.query.leaderboardEntries.findFirst({
        where: and(
          eq(leaderboardEntries.userId, userId),
          eq(leaderboardEntries.competitionId, competitionId),
        ),
      });

      if (existingEntry) {
        await tx
          .update(leaderboardEntries)
          .set(data)
          .where(eq(leaderboardEntries.id, existingEntry.id));
      } else {
        const comp = await tx.query.competitions.findFirst({
          columns: { seasonYear: true },
          where: (c, { eq }) => eq(c.id, competitionId),
        });

        await tx.insert(leaderboardEntries).values({
          userId,
          competitionId,
          seasonYear: comp?.seasonYear || new Date().getFullYear(),
          ...data,
          currentRank: 0,
          previousRank: 0,
          rankChange: 0,
        });
      }
    }

    // 3. Recalculate ranks using a single SQL query for maximum efficiency
    // This updates currentRank, previousRank and rankChange in one go for everyone in the competition
    await tx.execute(sql`
      WITH ranked_players AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (
            ORDER BY total_points DESC, exact_guesses DESC, correct_diffs DESC, correct_trends DESC, created_at ASC
          ) as new_rank
        FROM leaderboard_entries
        WHERE competition_id = ${competitionId}
      )
      UPDATE leaderboard_entries
      SET 
        previous_rank = COALESCE(current_rank, 0),
        current_rank = ranked_players.new_rank,
        rank_change = CASE 
          WHEN COALESCE(current_rank, 0) = 0 THEN 0 
          ELSE COALESCE(current_rank, 0) - ranked_players.new_rank 
        END,
        updated_at = NOW()
      FROM ranked_players
      WHERE leaderboard_entries.id = ranked_players.id;
    `);
  });

  logger.info(
    { competitionId, durationMs: Date.now() - startTime },
    '[RANKING] Refreshed competition rankings',
  );
};
