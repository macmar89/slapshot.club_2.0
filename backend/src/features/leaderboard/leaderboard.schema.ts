import { z } from 'zod';

const leaderboardParamsSchema = z.object({
  slug: z.string().min(1).toLowerCase(),
});

export const getLeaderboardSchema = z.object({
  params: leaderboardParamsSchema,
});

export const getMyCompetitionStatsSchema = z.object({
  params: leaderboardParamsSchema,
});
