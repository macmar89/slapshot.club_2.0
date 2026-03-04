import { z } from 'zod';

export const getCompetitionMatchesSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    tz: z.string(),
  }),
});

export type GetCompetitionMatchesInput = z.infer<typeof getCompetitionMatchesSchema>['query'];
