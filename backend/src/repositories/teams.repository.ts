import { teams } from '../db/schema/index.js';
import { db } from '../db/index.js';

export const teamsRepository = {
  async getApiLookup() {
    return db.select({ id: teams.id, apiHockeyId: teams.apiHockeyId }).from(teams);
  },

  async getAdminLookup(locale: string = 'sk', competitionId?: string) {
    return await db.query.teams.findMany({
      columns: {
        id: true,
      },
      where: (table, { eq }) => (competitionId ? eq(table.id, 'TODO_JOIN_IF_NEEDED') : undefined), // Simplified for now
      with: {
        locales: {
          columns: { name: true, locale: true },
          where: (table, { eq }) => eq(table.locale, locale as any),
        },
      },
      orderBy: (table, { asc }) => [asc(table.id)],
    });
  },
};
