import { eq, and, not } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { predictions } from '../../db/schema/predictions.js';
import { matches } from '../../db/schema/matches.js';
import { competitions } from '../../db/schema/competitions.js';
import { leaderboardEntries } from '../../db/schema/leaderboardEntries.js';
import { userStats } from '../../db/schema/userStats.js';
import { logger } from '../../utils/logger.js';
import { APP_CONFIG } from '../../config/app.js';
import { type ScoringResult } from '../../types/prediction.types.js';
import { predictionsRepository } from '../../repositories/predictions.repository.js';
import { competitionsQueue } from '../../queues/competitions.queue.js';

export function calculatePoints(
  prediction: { homeGoals: number | null; awayGoals: number | null },
  match: { resultHomeScore: number | null; resultAwayScore: number | null },
): ScoringResult {
  const mHome = match.resultHomeScore;
  const mAway = match.resultAwayScore;

  if (mHome === null || mHome === undefined || mAway === null || mAway === undefined) {
    return { points: 0, isExact: false, isTrend: false, isDiff: false, isWrong: false };
  }

  const pHome = prediction.homeGoals;
  const pAway = prediction.awayGoals;

  if (pHome === null || pHome === undefined || pAway === null || pAway === undefined) {
    return { points: 0, isExact: false, isTrend: false, isDiff: false, isWrong: false };
  }

  if (pHome === mHome && pAway === mAway) {
    return {
      points: APP_CONFIG.POINTS.EXACT,
      isExact: true,
      isTrend: false,
      isDiff: false,
      isWrong: false,
    };
  }

  const pDiff = pHome - pAway;
  const mDiff = mHome - mAway;

  const isTrend =
    (pDiff > 0 && mDiff > 0) || (pDiff < 0 && mDiff < 0) || (pDiff === 0 && mDiff === 0);
  if (isTrend) {
    if (pDiff === mDiff) {
      return {
        points: APP_CONFIG.POINTS.DIFF,
        isExact: false,
        isTrend: false,
        isDiff: true,
        isWrong: false,
      };
    }

    return {
      points: APP_CONFIG.POINTS.TREND,
      isExact: false,
      isTrend: true,
      isWrong: false,
      isDiff: false,
    };
  }

  return {
    points: APP_CONFIG.POINTS.WRONG,
    isExact: false,
    isTrend: false,
    isDiff: false,
    isWrong: true,
  };
}

export async function evaluateMatch(matchId: string) {
  const startTime = Date.now();

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId));

  if (!match || !match.competitionId) {
    logger.error(`[EVALUATE] Match ${matchId} or Competition missing.`);
    return;
  }

  const [competition] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, match.competitionId));

  if (!competition) {
    logger.error(`[EVALUATE] Competition for match ${matchId} missing.`);
    return;
  }

  const allPredictions = await predictionsRepository.getPredictionsByMatchId(matchId);

  logger.info(
    `[EVALUATE] Processing ${allPredictions.length} predictions for ${match.displayTitle}...`,
  );

  const userUpdates = new Map<
    string,
    {
      points: number;
      exact: number;
      trend: number;
      diff: number;
      wrong: number;
      count: number;
    }
  >();

  for (const pred of allPredictions) {
    try {
      const { points, isExact, isTrend, isDiff, isWrong } = calculatePoints(pred, match);

      await db
        .update(predictions)
        .set({
          points,
          isExact,
          isTrend,
          isDiff,
          isWrong,
          status: 'evaluated',
          evaluatedAt: new Date().toISOString(),
        })
        .where(eq(predictions.id, pred.id));

      if (pred.userId) {
        const stats = userUpdates.get(pred.userId) || {
          points: 0,
          exact: 0,
          trend: 0,
          diff: 0,
          wrong: 0,
          count: 0,
        };

        userUpdates.set(pred.userId, {
          points: stats.points + points,
          exact: stats.exact + (isExact ? 1 : 0),
          trend: stats.trend + (isTrend ? 1 : 0),
          diff: stats.diff + (isDiff ? 1 : 0),
          wrong: stats.wrong + (isWrong ? 1 : 0),
          count: stats.count + 1,
        });
      }
    } catch (err: any) {
      logger.error(`[EVALUATE] Error on prediction ${pred.id}: ${err.message}`);
    }
  }

  for (const [userId, stats] of userUpdates.entries()) {
    try {
      const [entry] = await db
        .select()
        .from(leaderboardEntries)
        .where(
          and(
            eq(leaderboardEntries.userId, userId),
            eq(leaderboardEntries.competitionId, competition.id),
            eq(leaderboardEntries.seasonYear, competition.seasonYear),
          ),
        );

      if (entry) {
        await db
          .update(leaderboardEntries)
          .set({
            totalPoints: (entry.totalPoints || 0) + stats.points,
            totalPredictions: (entry.totalPredictions || 0) + stats.count,
            exactGuesses: (entry.exactGuesses || 0) + stats.exact,
            correctTrends: (entry.correctTrends || 0) + stats.trend,
            correctDiffs: (entry.correctDiffs || 0) + stats.diff,
            wrongGuesses: (entry.wrongGuesses || 0) + stats.wrong,
          })
          .where(eq(leaderboardEntries.id, entry.id));
      } else {
        await db.insert(leaderboardEntries).values({
          userId,
          competitionId: competition.id,
          seasonYear: competition.seasonYear,
          totalPoints: stats.points,
          totalPredictions: stats.count,
          exactGuesses: stats.exact,
          correctTrends: stats.trend,
          correctDiffs: stats.diff,
          wrongGuesses: stats.wrong,
          currentRank: 0,
          previousRank: 0,
          rankChange: 0,
        });
      }

      const [uStats] = await db.select().from(userStats).where(eq(userStats.userId, userId));

      if (uStats) {
        await db
          .update(userStats)
          .set({
            totalPredictions: (uStats.totalPredictions || 0) + stats.count,
            lifetimePoints: (uStats.lifetimePoints || 0) + stats.points,
            lifetimePossiblePoints:
              (uStats.lifetimePossiblePoints || 0) + stats.count * APP_CONFIG.POINTS.EXACT,
            lifeTimeExactGuesses: (uStats.lifeTimeExactGuesses || 0) + stats.exact,
            lifeTimeCorrectTrends: (uStats.lifeTimeCorrectTrends || 0) + stats.trend,
            lifeTimeCorrectDiffs: (uStats.lifeTimeCorrectDiffs || 0) + stats.diff,
            lifeTimeWrongGuesses: (uStats.lifeTimeWrongGuesses || 0) + stats.wrong,
          })
          .where(eq(userStats.id, uStats.id));
      } else {
        await db.insert(userStats).values({
          userId,
          totalPredictions: stats.count,
          lifetimePoints: stats.points,
          lifetimePossiblePoints: stats.count * APP_CONFIG.POINTS.EXACT,
          lifeTimeExactGuesses: stats.exact,
          lifeTimeCorrectTrends: stats.trend,
          lifeTimeCorrectDiffs: stats.diff,
          lifeTimeWrongGuesses: stats.wrong,
          currentOvr: 0,
          maxOvrEver: 0,
        });
      }
      logger.info(`[EVALUATE] User ${userId} updated with +${stats.points} points.`);
    } catch (err: any) {
      logger.error(`[EVALUATE] Failed to update user ${userId}: ${err.message}`);
    }
  }

  logger.info(`[EVALUATE] Finished in ${Date.now() - startTime}ms. Queueing rank recalculation.`);

  // 4. Trigger rank recalculation for the competition
  await competitionsQueue.add('recalculateCompetitionRanks', {
    competitionId: competition.id,
  });
}

export async function revertMatchEvaluation(matchId: string) {
  const startTime = Date.now();

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId));

  if (!match) return;

  const allPredictions = await db
    .select()
    .from(predictions)
    .where(and(eq(predictions.matchId, matchId), eq(predictions.status, 'evaluated')));

  logger.info(
    `[REVERT] Reverting ${allPredictions.length} predictions for ${match.displayTitle}...`,
  );

  const [competition] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, match.competitionId));

  if (!competition) return;

  const userReverts = new Map<
    string,
    {
      points: number;
      exact: number;
      trend: number;
      diff: number;
      wrong: number;
      count: number;
    }
  >();

  for (const pred of allPredictions) {
    try {
      const pointsToSubtract = pred.points || 0;
      const revIsExact = pred.isExact;
      const revIsTrend = pred.isTrend;
      const revIsDiff = pred.isDiff;
      const revIsWrong = pred.isWrong;

      await db
        .update(predictions)
        .set({
          points: 0,
          isExact: false,
          isTrend: false,
          isDiff: false,
          isWrong: false,
          status: 'pending',
          evaluatedAt: null,
        })
        .where(eq(predictions.id, pred.id));

      if (pred.userId) {
        const stats = userReverts.get(pred.userId) || {
          points: 0,
          exact: 0,
          trend: 0,
          diff: 0,
          wrong: 0,
          count: 0,
        };

        userReverts.set(pred.userId, {
          points: stats.points + pointsToSubtract,
          exact: stats.exact + (revIsExact ? 1 : 0),
          trend: stats.trend + (revIsTrend ? 1 : 0),
          diff: stats.diff + (revIsDiff ? 1 : 0),
          wrong: stats.wrong + (revIsWrong ? 1 : 0),
          count: stats.count + 1,
        });
      }
    } catch (err: any) {
      logger.error(`[REVERT] Error on prediction ${pred.id}: ${err.message}`);
    }
  }

  for (const [userId, stats] of userReverts.entries()) {
    try {
      const [entry] = await db
        .select()
        .from(leaderboardEntries)
        .where(
          and(
            eq(leaderboardEntries.userId, userId),
            eq(leaderboardEntries.competitionId, competition.id),
            eq(leaderboardEntries.seasonYear, competition.seasonYear),
          ),
        );

      if (entry) {
        await db
          .update(leaderboardEntries)
          .set({
            totalPoints: Math.max(0, (entry.totalPoints || 0) - stats.points),
            totalPredictions: Math.max(0, (entry.totalPredictions || 0) - stats.count),
            exactGuesses: Math.max(0, (entry.exactGuesses || 0) - stats.exact),
            correctTrends: Math.max(0, (entry.correctTrends || 0) - stats.trend),
            correctDiffs: Math.max(0, (entry.correctDiffs || 0) - stats.diff),
            wrongGuesses: Math.max(0, (entry.wrongGuesses || 0) - stats.wrong),
          })
          .where(eq(leaderboardEntries.id, entry.id));
      }

      const [uStats] = await db.select().from(userStats).where(eq(userStats.userId, userId));

      if (uStats) {
        await db
          .update(userStats)
          .set({
            totalPredictions: Math.max(0, (uStats.totalPredictions || 0) - stats.count),
            lifetimePoints: Math.max(0, (uStats.lifetimePoints || 0) - stats.points),
            lifetimePossiblePoints: Math.max(
              0,
              (uStats.lifetimePossiblePoints || 0) - stats.count * APP_CONFIG.POINTS.EXACT,
            ),
            lifeTimeExactGuesses: Math.max(0, (uStats.lifeTimeExactGuesses || 0) - stats.exact),
            lifeTimeCorrectTrends: Math.max(0, (uStats.lifeTimeCorrectTrends || 0) - stats.trend),
            lifeTimeCorrectDiffs: Math.max(0, (uStats.lifeTimeCorrectDiffs || 0) - stats.diff),
            lifeTimeWrongGuesses: Math.max(0, (uStats.lifeTimeWrongGuesses || 0) - stats.wrong),
          })
          .where(eq(userStats.id, uStats.id));
      }
      logger.info(`[REVERT] User ${userId} points removed.`);
    } catch (err: any) {
      logger.error(`[REVERT] Failed to revert user ${userId}: ${err.message}`);
    }
  }

  logger.info(`[REVERT] Finished in ${Date.now() - startTime}ms.`);
}
