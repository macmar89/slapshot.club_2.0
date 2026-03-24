import { predictions, leaderboardEntries, matches, teams, assets } from '../db/schema/index.js';
import { eq, and, not, gte, lte, sql, inArray, notExists } from 'drizzle-orm';

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
    // We use date_trunc or similar to group by day in DB timezone or local?
    // Let's use simple string slicing for the date part YYYY-MM-DD
    return await db
      .select({
        date: sql<string>`active_date`,
        count: sql<number>`count(*)::int`,
      })
      .from(
        db
          .select({
            active_date: sql<string>`substring(${matches.date} from 1 for 10)`.as('active_date'),
          })
          .from(matches)
          .where(
            and(
              inArray(matches.competitionId, compIds),
              gte(matches.date, startDate),
              lte(matches.date, endDate),
              notExists(
                db
                  .select()
                  .from(predictions)
                  .where(and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId))),
              ),
            ),
          )
          .as('subquery'),
      )
      .groupBy(sql`active_date`);
  },

  async getMissingPredictionsByDate(userId: string, date: string, timezone: string = 'UTC') {
    const userCompetitions = await db
      .select({ id: leaderboardEntries.competitionId })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId));

    const compIds = userCompetitions.map((c) => c.id);
    if (compIds.length === 0) return [];

    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    return await db.query.matches.findMany({
      where: and(
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
            locales: true,
          },
        },
        homeTeam: {
          with: {
            locales: true,
            logo: true,
          },
        },
        awayTeam: {
          with: {
            locales: true,
            logo: true,
          },
        },
        predictions: {
          where: eq(predictions.userId, userId),
        },
      },
      orderBy: [matches.date],
    });
  },
};
