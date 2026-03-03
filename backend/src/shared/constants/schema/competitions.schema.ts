import { z } from 'zod';

export const joinCompetitionSchema = z.object({
  body: z.object({
    competitionId: z.string().length(24),
  }),
});

export const competitionParamsSchema = z.object({
  slug: z.string().min(1).toLowerCase(),
});

export const getMyCompetitionStatsSchema = z.object({
  params: competitionParamsSchema,
});
