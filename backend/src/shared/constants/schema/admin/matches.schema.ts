import { z } from 'zod';

export const MatchStatusEnum = z.enum(['scheduled', 'live', 'finished', 'cancelled']);

export const getAllMatchesFilterSchema = z
  .object({
    status: MatchStatusEnum.optional(),
    competitionId: z.string().length(24).optional(),
    teamId: z.string().length(24).optional(),
    isChecked: z
      .preprocess((val) => {
        if (val === undefined) return undefined;
        return val === 'true' || val === true;
      }, z.boolean().optional())
      .optional(),
    isRanked: z
      .preprocess((val) => {
        if (val === undefined) return undefined;
        return val === 'true' || val === true;
      }, z.boolean().optional())
      .optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .optional();

export const getAllMatchesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    lang: z.string().optional(),
    search: z.string().optional(),
    filters: getAllMatchesFilterSchema,
    sort: z
      .object({
        by: z.string().default('date'),
        order: z.enum(['asc', 'desc']).default('asc'),
      })
      .default({ by: 'date', order: 'asc' }),
  }),
});

export const getMatchDetailSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});
