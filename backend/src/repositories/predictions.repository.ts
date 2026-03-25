import { db } from '../db/index.js';
import { predictions, leaderboardEntries, matches } from '../db/schema/index.js';
import { eq, and, not, gte, lte, sql, inArray, notExists } from 'drizzle-orm';
import { mapMatchToPreview } from '../utils/mappers/matches.mappers.js';
import type { AppLocale } from '../types/global.types.js';

export const predictionsRepository = {
  async getPredictionsByMatchId(matchId: string) {
    return await db.query.predictions.findMany({
      columns: {
        id: true,
        userId: true,
        homeGoals: true,
        awayGoals: true,
        status: true,
      },
      where: and(eq(predictions.matchId, matchId), not(eq(predictions.status, 'evaluated'))),
    });
  },

  async getMissingPredictionsCountByDateRange(userId: string, startDate: string, endDate: string) {
    // 1. Get competition IDs user is in
    const userCompetitions = await db
      .select({ id: leaderboardEntries.competitionId })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId));

    const compIds = userCompetitions.map((c) => c.id);
    if (compIds.length === 0) return [];

    // 2. Count matches without predictions grouped by date
    const startIso = `${startDate}T00:00:00.000Z`;
    const endIso = `${endDate}T23:59:59.999Z`;

    return await db
      .select({
        date: sql<string>`to_char(${matches.date}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(matches)
      .where(
        and(
          inArray(matches.competitionId, compIds),
          gte(matches.date, startIso),
          lte(matches.date, endIso),
          notExists(
            db
              .select()
              .from(predictions)
              .where(and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId))),
          ),
        ),
      )
      .groupBy(sql`to_char(${matches.date}, 'YYYY-MM-DD')`);
  },

  async getMissingPredictionsByDate(
    userId: string,
    date: string,
    locale: AppLocale,
    timezone: string = 'UTC',
  ) {
    const userCompetitions = await db
      .select({ id: leaderboardEntries.competitionId })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId));

    const compIds = userCompetitions.map((c) => c.id);
    if (compIds.length === 0) return [];

    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const result = await db.query.matches.findMany({
      where: and(
        eq(matches.status, 'scheduled'),
        inArray(matches.competitionId, compIds),
        gte(matches.date, startOfDay),
        lte(matches.date, endOfDay),
        notExists(
          db
            .select()
            .from(predictions)
            .where(and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId))),
        ),
      ),
      with: {
        competition: {
          with: {
            locales: {
              where: (l, { eq }) => eq(l.locale, locale),
              limit: 1,
            },
          },
        },
        homeTeam: {
          with: {
            locales: {
              where: (l, { eq }) => eq(l.locale, locale),
              limit: 1,
            },
            logo: true,
          },
        },
        awayTeam: {
          with: {
            locales: {
              where: (l, { eq }) => eq(l.locale, locale),
              limit: 1,
            },
            logo: true,
          },
        },
        predictions: {
          where: eq(predictions.userId, userId),
        },
      },
      orderBy: [matches.date],
    });

    return result.map((match) => mapMatchToPreview(match, userId));
  },

  async getMissingPredictionsCountNext24Hours(userId: string) {
    const userCompetitions = await db
      .select({ id: leaderboardEntries.competitionId })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId));

    const compIds = userCompetitions.map((c) => c.id);
    if (compIds.length === 0) return 0;

    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const result = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(matches)
      .where(
        and(
          eq(matches.status, 'scheduled'),
          inArray(matches.competitionId, compIds),
          gte(matches.date, now),
          lte(matches.date, tomorrow),
          notExists(
            db
              .select()
              .from(predictions)
              .where(and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId))),
          ),
        ),
      );

    return result[0]?.count || 0;
  },
};
