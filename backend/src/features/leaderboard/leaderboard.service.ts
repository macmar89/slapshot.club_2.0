import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { predictions, leaderboardEntries } from '../../db/schema/index.js';
import { logger } from '../../utils/logger.js';

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
