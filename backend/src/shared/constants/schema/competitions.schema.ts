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

export const getLeaderboardSchema = z.object({
  params: competitionParamsSchema,
});

export const getPlayerPredictionsSchema = z.object({
  query: z.object({
    limit: z.string().optional(),
    cursorDate: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const syncStandingsSchema = z.object({
  params: z.object({
    competitionId: z.string().length(24),
  }),
});
