import { and, asc, desc, eq, gt, inArray, isNotNull, notInArray, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { notDeleted } from '../../db/helpers.js';
import {
  matches,
  monthlyLeaderboardEntries,
  monthlyLeaderboardPeriods,
  predictions,
} from '../../db/schema/index.js';
import { MONTHLY_PERIOD_TIMEZONE } from './monthlyLeaderboard.period.js';
import type {
  DbClient,
  MonthlyEntryStats,
  MonthlyPeriod,
  MonthlyPeriodTotals,
} from './monthlyLeaderboard.types.js';

const periodDateRange = ({ periodYear, periodMonth }: MonthlyPeriod) => {
  const monthStart = sql`make_timestamp(${periodYear}::int, ${periodMonth}::int, 1, 0, 0, 0)`;

  return sql`${matches.date} >= (${monthStart} at time zone ${MONTHLY_PERIOD_TIMEZONE}::text)
    and ${matches.date} < ((${monthStart} + interval '1 month') at time zone ${MONTHLY_PERIOD_TIMEZONE}::text)`;
};

export const getEvaluatedStatsForPeriod = async (
  competitionId: string,
  period: MonthlyPeriod,
  client: DbClient = db,
): Promise<MonthlyEntryStats[]> =>
  client
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
    .innerJoin(matches, eq(matches.id, predictions.matchId))
    .where(
      and(
        eq(predictions.competitionId, competitionId),
        eq(predictions.status, 'evaluated'),
        eq(matches.competitionId, competitionId),
        periodDateRange(period),
      ),
    )
    .groupBy(predictions.userId);

export const countRankedMatchesInPeriod = async (
  competitionId: string,
  period: MonthlyPeriod,
  client: DbClient = db,
): Promise<number> => {
  const [row] = await client
    .select({ total: sql<number>`count(*)::int` })
    .from(matches)
    .where(
      and(
        eq(matches.competitionId, competitionId),
        isNotNull(matches.rankedAt),
        notDeleted(matches),
        periodDateRange(period),
      ),
    );

  return row?.total ?? 0;
};

export const upsertEntries = async (
  competitionId: string,
  period: MonthlyPeriod,
  stats: MonthlyEntryStats[],
  client: DbClient = db,
) => {
  if (stats.length === 0) return;

  await client
    .insert(monthlyLeaderboardEntries)
    .values(
      stats.map((entry) => ({
        ...entry,
        competitionId,
        periodYear: period.periodYear,
        periodMonth: period.periodMonth,
      })),
    )
    .onConflictDoUpdate({
      target: [
        monthlyLeaderboardEntries.userId,
        monthlyLeaderboardEntries.competitionId,
        monthlyLeaderboardEntries.periodYear,
        monthlyLeaderboardEntries.periodMonth,
      ],
      set: {
        totalPoints: sql`excluded.total_points`,
        totalPredictions: sql`excluded.total_predictions`,
        exactGuesses: sql`excluded.exact_guesses`,
        correctTrends: sql`excluded.correct_trends`,
        correctDiffs: sql`excluded.correct_diffs`,
        wrongGuesses: sql`excluded.wrong_guesses`,
        updatedAt: sql`now()`,
      },
    });
};

export const resetEntriesOutsideStats = async (
  competitionId: string,
  period: MonthlyPeriod,
  keptUserIds: string[],
  client: DbClient = db,
) => {
  const conditions = [
    eq(monthlyLeaderboardEntries.competitionId, competitionId),
    eq(monthlyLeaderboardEntries.periodYear, period.periodYear),
    eq(monthlyLeaderboardEntries.periodMonth, period.periodMonth),
    gt(monthlyLeaderboardEntries.totalPredictions, 0),
  ];

  if (keptUserIds.length > 0) {
    conditions.push(notInArray(monthlyLeaderboardEntries.userId, keptUserIds));
  }

  await client
    .update(monthlyLeaderboardEntries)
    .set({
      totalPoints: 0,
      totalPredictions: 0,
      exactGuesses: 0,
      correctTrends: 0,
      correctDiffs: 0,
      wrongGuesses: 0,
      updatedAt: sql`now()`,
    })
    .where(and(...conditions));
};

export const applyRanks = async (
  competitionId: string,
  period: MonthlyPeriod,
  client: DbClient = db,
) => {
  await client.execute(sql`
    WITH ranked_players AS (
      SELECT
        id,
        ROW_NUMBER() OVER (
          ORDER BY total_points DESC, exact_guesses DESC, correct_diffs DESC, correct_trends DESC, created_at ASC
        ) as new_rank
      FROM monthly_leaderboard_entries
      WHERE competition_id = ${competitionId}
        AND period_year = ${period.periodYear}
        AND period_month = ${period.periodMonth}
        AND deleted_at IS NULL
    )
    UPDATE monthly_leaderboard_entries
    SET
      previous_rank = current_rank,
      current_rank = ranked_players.new_rank,
      rank_change = CASE
        WHEN current_rank = 0 THEN 0
        ELSE current_rank - ranked_players.new_rank
      END,
      updated_at = NOW()
    FROM ranked_players
    WHERE monthly_leaderboard_entries.id = ranked_players.id;
  `);
};

export const findPeriod = async (
  competitionId: string,
  period: MonthlyPeriod,
  client: DbClient = db,
) => {
  const [row] = await client
    .select()
    .from(monthlyLeaderboardPeriods)
    .where(
      and(
        eq(monthlyLeaderboardPeriods.competitionId, competitionId),
        eq(monthlyLeaderboardPeriods.periodYear, period.periodYear),
        eq(monthlyLeaderboardPeriods.periodMonth, period.periodMonth),
      ),
    )
    .limit(1);

  return row ?? null;
};

export const upsertPeriodTotals = async (
  competitionId: string,
  period: MonthlyPeriod,
  totals: MonthlyPeriodTotals,
  client: DbClient = db,
) => {
  await client
    .insert(monthlyLeaderboardPeriods)
    .values({
      competitionId,
      periodYear: period.periodYear,
      periodMonth: period.periodMonth,
      ...totals,
      lastRecalculatedAt: sql`now()`,
    })
    .onConflictDoUpdate({
      target: [
        monthlyLeaderboardPeriods.competitionId,
        monthlyLeaderboardPeriods.periodYear,
        monthlyLeaderboardPeriods.periodMonth,
      ],
      set: {
        totalParticipants: sql`excluded.total_participants`,
        totalPlayedMatches: sql`excluded.total_played_matches`,
        totalPossiblePoints: sql`excluded.total_possible_points`,
        lastRecalculatedAt: sql`now()`,
        updatedAt: sql`now()`,
      },
    });
};

export const findClosablePeriods = async (before: MonthlyPeriod, client: DbClient = db) =>
  client
    .select({
      competitionId: monthlyLeaderboardPeriods.competitionId,
      periodYear: monthlyLeaderboardPeriods.periodYear,
      periodMonth: monthlyLeaderboardPeriods.periodMonth,
    })
    .from(monthlyLeaderboardPeriods)
    .where(
      and(
        eq(monthlyLeaderboardPeriods.status, 'open'),
        notDeleted(monthlyLeaderboardPeriods),
        sql`(${monthlyLeaderboardPeriods.periodYear} * 12 + ${monthlyLeaderboardPeriods.periodMonth}) < ${before.periodYear * 12 + before.periodMonth}`,
      ),
    )
    .orderBy(asc(monthlyLeaderboardPeriods.periodYear), asc(monthlyLeaderboardPeriods.periodMonth));

export const findPeriodWinnerUserId = async (
  competitionId: string,
  period: MonthlyPeriod,
  client: DbClient = db,
): Promise<string | null> => {
  const [row] = await client
    .select({ userId: monthlyLeaderboardEntries.userId })
    .from(monthlyLeaderboardEntries)
    .where(
      and(
        eq(monthlyLeaderboardEntries.competitionId, competitionId),
        eq(monthlyLeaderboardEntries.periodYear, period.periodYear),
        eq(monthlyLeaderboardEntries.periodMonth, period.periodMonth),
        eq(monthlyLeaderboardEntries.currentRank, 1),
        gt(monthlyLeaderboardEntries.totalPredictions, 0),
        notDeleted(monthlyLeaderboardEntries),
      ),
    )
    .limit(1);

  return row?.userId ?? null;
};

export const closePeriod = async (
  competitionId: string,
  period: MonthlyPeriod,
  winnerUserId: string | null,
  client: DbClient = db,
): Promise<boolean> => {
  const closed = await client
    .update(monthlyLeaderboardPeriods)
    .set({
      status: 'closed',
      winnerUserId,
      closedAt: sql`now()`,
      updatedAt: sql`now()`,
    })
    .where(
      and(
        eq(monthlyLeaderboardPeriods.competitionId, competitionId),
        eq(monthlyLeaderboardPeriods.periodYear, period.periodYear),
        eq(monthlyLeaderboardPeriods.periodMonth, period.periodMonth),
        eq(monthlyLeaderboardPeriods.status, 'open'),
      ),
    )
    .returning({ id: monthlyLeaderboardPeriods.id });

  return closed.length > 0;
};

export const findEntriesForPeriod = async (
  competitionId: string,
  period: MonthlyPeriod,
  userIds?: string[],
) =>
  db.query.monthlyLeaderboardEntries.findMany({
    columns: {
      id: true,
      userId: true,
      currentRank: true,
      previousRank: true,
      rankChange: true,
      totalPoints: true,
      totalPredictions: true,
      exactGuesses: true,
      correctTrends: true,
      correctDiffs: true,
      wrongGuesses: true,
    },
    where: and(
      eq(monthlyLeaderboardEntries.competitionId, competitionId),
      eq(monthlyLeaderboardEntries.periodYear, period.periodYear),
      eq(monthlyLeaderboardEntries.periodMonth, period.periodMonth),
      notDeleted(monthlyLeaderboardEntries),
      ...(userIds ? [inArray(monthlyLeaderboardEntries.userId, userIds)] : []),
    ),
    with: {
      user: {
        columns: { username: true },
      },
    },
    orderBy: [
      asc(sql`case when ${monthlyLeaderboardEntries.currentRank} = 0 then 1 else 0 end`),
      asc(monthlyLeaderboardEntries.currentRank),
    ],
  });

export const findPeriodsHistory = async (competitionId: string, limit: number) =>
  db.query.monthlyLeaderboardPeriods.findMany({
    columns: {
      id: true,
      periodYear: true,
      periodMonth: true,
      status: true,
      totalParticipants: true,
      totalPlayedMatches: true,
      totalPossiblePoints: true,
      winnerUserId: true,
      lastRecalculatedAt: true,
      closedAt: true,
    },
    where: and(
      eq(monthlyLeaderboardPeriods.competitionId, competitionId),
      notDeleted(monthlyLeaderboardPeriods),
    ),
    with: {
      winner: {
        columns: { username: true },
      },
    },
    orderBy: [
      desc(monthlyLeaderboardPeriods.periodYear),
      desc(monthlyLeaderboardPeriods.periodMonth),
    ],
    limit,
  });
