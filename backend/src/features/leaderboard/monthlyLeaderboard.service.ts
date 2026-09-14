import { subDays } from 'date-fns';
import { APP_CONFIG } from '../../config/app.js';
import { db } from '../../db/index.js';
import { logger } from '../../utils/logger.js';
import * as monthlyLeaderboardRepository from './monthlyLeaderboard.repository.js';
import { formatPeriodKey, getPeriodFromDate } from './monthlyLeaderboard.period.js';
import type { MonthlyPeriod } from './monthlyLeaderboard.types.js';

export const MONTHLY_PERIOD_CLOSING_GRACE_DAYS = 2;

export const refreshMonthlyRankings = async (competitionId: string, period: MonthlyPeriod) => {
  const startTime = Date.now();
  const periodKey = formatPeriodKey(period);

  const existingPeriod = await monthlyLeaderboardRepository.findPeriod(competitionId, period);

  if (existingPeriod?.status === 'closed') {
    logger.info(
      { competitionId, period: periodKey },
      '[MONTHLY RANKING] Period is closed, skipping recalculation',
    );
    return;
  }

  const [stats, totalPlayedMatches] = await Promise.all([
    monthlyLeaderboardRepository.getEvaluatedStatsForPeriod(competitionId, period),
    monthlyLeaderboardRepository.countRankedMatchesInPeriod(competitionId, period),
  ]);

  await db.transaction(async (tx) => {
    await monthlyLeaderboardRepository.upsertEntries(competitionId, period, stats, tx);

    await monthlyLeaderboardRepository.resetEntriesOutsideStats(
      competitionId,
      period,
      stats.map((entry) => entry.userId),
      tx,
    );

    await monthlyLeaderboardRepository.applyRanks(competitionId, period, tx);

    await monthlyLeaderboardRepository.upsertPeriodTotals(
      competitionId,
      period,
      {
        totalParticipants: stats.length,
        totalPlayedMatches,
        totalPossiblePoints: totalPlayedMatches * APP_CONFIG.POINTS.EXACT,
      },
      tx,
    );
  });

  logger.info(
    {
      competitionId,
      period: periodKey,
      participants: stats.length,
      totalPlayedMatches,
      durationMs: Date.now() - startTime,
    },
    '[MONTHLY RANKING] Refreshed monthly rankings',
  );
};

export const refreshMonthlyRankingsForMatchDate = async (
  competitionId: string,
  matchDate: string | Date,
) => refreshMonthlyRankings(competitionId, getPeriodFromDate(matchDate));

export const closeFinishedMonthlyPeriods = async () => {
  const boundary = getPeriodFromDate(subDays(new Date(), MONTHLY_PERIOD_CLOSING_GRACE_DAYS));
  const closablePeriods = await monthlyLeaderboardRepository.findClosablePeriods(boundary);

  if (closablePeriods.length === 0) {
    logger.info(
      { boundary: formatPeriodKey(boundary) },
      '[MONTHLY RANKING] No monthly periods ready to close',
    );
    return;
  }

  const failedPeriods: string[] = [];

  for (const row of closablePeriods) {
    const period: MonthlyPeriod = { periodYear: row.periodYear, periodMonth: row.periodMonth };
    const periodKey = formatPeriodKey(period);

    try {
      await refreshMonthlyRankings(row.competitionId, period);

      const winnerUserId = await monthlyLeaderboardRepository.findPeriodWinnerUserId(
        row.competitionId,
        period,
      );

      const closed = await monthlyLeaderboardRepository.closePeriod(
        row.competitionId,
        period,
        winnerUserId,
      );

      logger.info(
        { competitionId: row.competitionId, period: periodKey, winnerUserId, closed },
        closed
          ? '[MONTHLY RANKING] Closed monthly period'
          : '[MONTHLY RANKING] Monthly period was already closed',
      );
    } catch (error: any) {
      failedPeriods.push(`${row.competitionId}:${periodKey}`);
      logger.error(
        { competitionId: row.competitionId, period: periodKey, error: error.message },
        '[MONTHLY RANKING] Failed to close monthly period',
      );
    }
  }

  if (failedPeriods.length > 0) {
    throw new Error(`Failed to close monthly periods: ${failedPeriods.join(', ')}`);
  }
};
