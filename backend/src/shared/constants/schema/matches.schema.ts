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

export const getMatchPredictionSchema = z.object({
  params: z.object({
    matchId: z.string(),
  }),
});

export const getMatchDetailInfoSchema = z.object({
  params: z.object({
    matchId: z.string(),
  }),
});

export const getMatchDetailPredictionsSchema = z.object({
  params: z.object({
    matchId: z.string(),
  }),
  query: z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().optional(),
  }),
});
