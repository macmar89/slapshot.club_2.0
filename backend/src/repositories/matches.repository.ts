import { db } from '../db/index.js';
import { matches } from '../db/schema/index.js';
import { eq, sql, or } from 'drizzle-orm';

export const matchesRepository = {
  async getAdminMatches(limit: number, offset: number, sort: any, filters: any) {
    const { and, eq, gte, lte, isNotNull, isNull, asc, desc } = await import('drizzle-orm');
    const whereConditions = [];

    if (filters?.dateFrom) {
      whereConditions.push(gte(matches.date, filters.dateFrom));
    }
    if (filters?.dateTo) {
      whereConditions.push(lte(matches.date, filters.dateTo));
    }
    if (filters?.status) {
      whereConditions.push(eq(matches.status, filters.status));
    }
    if (filters?.competitionId) {
      whereConditions.push(eq(matches.competitionId, filters.competitionId));
    }
    if (filters?.isChecked !== undefined) {
      whereConditions.push(eq(matches.isChecked, filters.isChecked));
    }
    if (filters?.teamId) {
      whereConditions.push(
        or(eq(matches.homeTeamId, filters.teamId), eq(matches.awayTeamId, filters.teamId)),
      );
    }
    if (filters?.isRanked !== undefined) {
      if (filters.isRanked) {
        whereConditions.push(isNotNull(matches.rankedAt));
      } else {
        whereConditions.push(isNull(matches.rankedAt));
      }
    }

    const orderByParams = [];
    const sortOrderFn = sort?.order === 'asc' ? asc : desc;
    if (sort?.by === 'date') {
      orderByParams.push(sortOrderFn(matches.date));
    } else {
      orderByParams.push(desc(matches.date));
    }

    const data = await db.query.matches.findMany({
      limit,
      offset,
      where: and(...whereConditions),
      orderBy: orderByParams,
      with: {
        competition: {
          with: { locales: true },
        },
        homeTeam: {
          with: { locales: true },
        },
        awayTeam: {
          with: { locales: true },
        },
      },
    });

    const totalCountQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(matches)
      .where(and(...whereConditions));

    return {
      data,
      totalCount: Number(totalCountQuery[0]?.count ?? 0),
    };
  },

  async getPotentialLiveMatches() {
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

    return await db.query.matches.findMany({
      where: (table, { or, and, eq, ne, gte }) =>
        or(
          eq(table.status, 'live'),
          and(
            ne(table.status, 'finished'),
            ne(table.status, 'cancelled'),
            gte(table.date, fourHoursAgo.toISOString()),
            sql`${table.date} <= now()`,
          ),
        ),
      with: {
        competition: true,
      },
    });
  },

  async updateMatch(id: string, data: Partial<typeof matches.$inferInsert>) {
    return await db.update(matches).set(data).where(eq(matches.id, id));
  },

  async getAdminMatchDetail(id: string) {
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, id),
      columns: {
        id: true,
        date: true,
        status: true,
        resultHomeScore: true,
        resultAwayScore: true,
        resultEndingType: true,
        stageType: true,
        isChecked: true,
        checkedAt: true,
        checkedBy: true,
        rankedAt: true,
        apiHockeyId: true,
        apiHockeyStatus: true,
      },
      with: {
        competition: {
          columns: { id: true },
          with: { locales: true },
        },
        homeTeam: {
          columns: { id: true },
          with: {
            locales: true,
            logo: {
              columns: { url: true },
            },
          },
        },
        awayTeam: {
          columns: { id: true },
          with: {
            locales: true,
            logo: {
              columns: { url: true },
            },
          },
        },
        checkedBy: {
          columns: {
            id: true,
            username: true,
          },
        },
      },
    });


    if (!match) return null;

    const [predictionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sql`predictions`) // Use sql string since predictions might not be imported or I can import it
      .where(sql`match_id = ${id}`);

    return {
      ...match,
      predictionCount: Number(predictionCount?.count ?? 0),
    };
  },
};
