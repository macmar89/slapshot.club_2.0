import { db } from '../db/index.js';

export const competitionRepository = {
  async getById(id: string, columns?: string[]) {
    const result = await db.query.competitions.findFirst({
      columns: columns
        ? columns.reduce((acc, column) => ({ ...acc, [column]: true }), {})
        : undefined,
      where: (table, { eq }) => eq(table.id, id),
    });

    return result ?? null;
  },

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

  async getNameById(id: string, locale: string = 'sk') {
    const result = await db.query.competitionsLocales.findFirst({
      columns: { name: true },
      where: (table, { and, eq }) =>
        and(eq(table.competitionId, id), eq(table.locale, locale as any)),
    });

    return result?.name ?? null;
  },
};
