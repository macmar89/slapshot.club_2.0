import { z } from 'zod';

export const announcementTypes = [
  'FEATURE',
  'LEAGUE',
  'IMPORTANT',
  'MAINTENANCE',
  'EVENT',
  'BUGFIX',
  'GENERAL',
] as const;

export const announcementsParamsSchema = z.object({
  slug: z.string(),
});

export const createAnnouncementBodySchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug must be in kebab-case and lowercase (a-z, 0-9, -)'),
  type: z.enum(announcementTypes),
  isPublished: z.boolean().default(false),

  locales: z.object({
    sk: z.object({
      title: z.string().min(3),
      excerpt: z.string().max(500),
      content: z.string().min(10),
    }),
    cz: z.object({
      title: z.string().min(3),
      excerpt: z.string().max(500),
      content: z.string().min(10),
    }),
    en: z.object({
      title: z.string().min(3),
      excerpt: z.string().max(500),
      content: z.string().min(10),
    }),
  }),
});

export const createAnnouncementSchema = z.object({
  body: createAnnouncementBodySchema,
});

export const getAllAnnouncementsFilterSchema = z
  .object({
    isPublished: z
      .preprocess((val) => {
        if (val === undefined) return undefined;
        return val === 'true' || val === true;
      }, z.boolean().optional())
      .optional(),
    type: z.enum(announcementTypes).optional(),
  })
  .optional();

export const getAllAnnouncementsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    lang: z.string().optional(),
    filters: getAllAnnouncementsFilterSchema,
    sort: z
      .object({
        by: z.enum(['createdAt', 'publishedAt', 'type']).default('createdAt'),
        order: z.enum(['asc', 'desc']).default('desc'),
      })
      .default({ by: 'createdAt', order: 'desc' }),
  }),
});

export const getAnnouncementBySlugSchema = z.object({
  params: announcementsParamsSchema,
});

export const updateAnnouncementSchema = z.object({
  params: announcementsParamsSchema,
  body: createAnnouncementBodySchema,
});

export type CreateAnnouncementBodyInput = z.infer<typeof createAnnouncementBodySchema>;
export type GetAllAnnouncementsQueryInput = z.infer<typeof getAllAnnouncementsSchema>['query'];
export type UpdateAnnouncementBodyInput = z.infer<typeof createAnnouncementBodySchema>;
