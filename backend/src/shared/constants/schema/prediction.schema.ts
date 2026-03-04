import { z } from 'zod';

export const createPredictionSchema = z.object({
  body: z.object({
    matchId: z.string(),
    homeGoals: z.number().min(0).max(20),
    awayGoals: z.number().min(0).max(20),
  }),
});

export type CreatePredictionInput = z.infer<typeof createPredictionSchema>['body'];
