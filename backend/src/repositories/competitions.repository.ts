import { db } from '../db/index.js';

export const competitionRepository = {
  async getIdBySlug(slug: string): Promise<string | null> {
    const result = await db.query.competitions.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.slug, slug),
    });
    return result?.id ?? null;
  },
  async getActive() {
    return await db.query.competitions.findMany({
      columns: {
        id: true,
        apiHockeyId: true,
        slug: true,
      },
      where: (table, { and, eq, isNotNull }) =>
        and(eq(table.status, 'active'), isNotNull(table.apiHockeyId)),
    });
  },
};
