import { z } from 'zod';

export const MatchStatusEnum = z.enum(['scheduled', 'live', 'finished', 'cancelled']);

export const MatchStageTypeEnum = z.enum([
  'regular_season',
  'group_phase',
  'playoffs',
  'pre_season',
  'relegation',
  'promotion',
]);

export const MatchResultEndingTypeEnum = z.enum(['regular', 'ot', 'so']);

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

export const updateMatchBodySchema = z.object({
  status: MatchStatusEnum.optional(),
  stageType: MatchStageTypeEnum.optional(),
  resultHomeScore: z.number().int().min(0).optional(),
  resultAwayScore: z.number().int().min(0).optional(),
  resultEndingType: MatchResultEndingTypeEnum.optional(),
  apiHockeyId: z.string().optional(),
  apiHockeyStatus: z.string().optional(),
  isChecked: z.boolean().optional(),
});

export const updateMatchSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: updateMatchBodySchema,
});

export type UpdateMatchBodyInput = z.infer<typeof updateMatchBodySchema>;
