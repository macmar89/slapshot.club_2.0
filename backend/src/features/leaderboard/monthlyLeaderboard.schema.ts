import { z } from 'zod';

const periodQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export const getMonthlyLeaderboardSchema = z.object({
  params: z.object({
    slug: z.string().min(1).toLowerCase(),
  }),
  query: periodQuerySchema,
});

export const getGroupMonthlyLeaderboardSchema = z.object({
  params: z.object({
    slug: z.string().min(1).toLowerCase(),
  }),
  query: periodQuerySchema,
});

export const getMonthlyPeriodsHistorySchema = z.object({
  params: z.object({
    slug: z.string().min(1).toLowerCase(),
  }),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(60).optional(),
  }),
});
