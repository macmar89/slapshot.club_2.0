import { z } from 'zod';

export const createPredictionSchema = z.object({
  body: z.object({
    matchId: z.string(),
    homeGoals: z.number().min(0).max(20),
    awayGoals: z.number().min(0).max(20),
  }),
});

export const getMissingPredictionsSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timezone: z.string().optional(),
  }),
});

export const getMissingPredictionsCalendarSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
});

export type CreatePredictionInput = z.infer<typeof createPredictionSchema>['body'];
