import { db } from '../db';

export const competitionRepository = {
  async getIdBySlug(slug: string): Promise<string | null> {
    const result = await db.query.competitions.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.slug, slug),
    });
    return result?.id ?? null;
  },
};
