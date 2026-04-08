import { z } from 'zod';

export const feedbackStatusEnum = z.enum(['new', 'in-progress', 'resolved', 'ignored']);

export const listFeedbackFilterSchema = z
  .object({
    status: feedbackStatusEnum.optional(),
    read: z
      .preprocess((val) => {
        if (val === undefined || val === null) return undefined;
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        return undefined;
      }, z.boolean().optional())
      .optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .optional();

export const listFeedbackQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    filters: listFeedbackFilterSchema,
    sort: z
      .object({
        by: z.enum(['createdAt']).default('createdAt'),
        order: z.enum(['asc', 'desc']).default('desc'),
      })
      .default({ by: 'createdAt', order: 'desc' }),
  }),
});

export const feedbackParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateFeedbackStatusBodySchema = z.object({
  status: feedbackStatusEnum,
});

export const updateFeedbackStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: updateFeedbackStatusBodySchema,
});

export type ListFeedbackQueryInput = z.infer<typeof listFeedbackQuerySchema>['query'];
export type UpdateFeedbackStatusInput = z.infer<typeof updateFeedbackStatusBodySchema>;
