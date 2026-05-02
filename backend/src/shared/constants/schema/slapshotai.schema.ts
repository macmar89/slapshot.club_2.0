import { z } from 'zod';

export const getSlapshotAiStatsSchema = z.object({
  query: z.object({
    date: z.string().datetime({ offset: true }).optional(),
  }),
});

export const getSlapshotAiWeeklyStatsSchema = z.object({
  query: z.object({
    week: z.coerce.number().min(1).max(53).optional(),
    year: z.coerce.number().min(2020).max(2100).optional(),
  }),
});
