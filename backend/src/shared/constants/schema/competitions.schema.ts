import { z } from 'zod';

export const joinCompetitionSchema = z.object({
  body: z.object({
    competitionId: z.string().length(24),
  }),
});
