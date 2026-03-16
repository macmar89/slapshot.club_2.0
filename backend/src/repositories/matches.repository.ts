import { db } from '../db';
import { matches } from '../db/schema';
import { and, or, eq, ne, gte, sql } from 'drizzle-orm';

export const matchesRepository = {
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
};
