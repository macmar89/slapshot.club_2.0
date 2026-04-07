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

export type CreateAnnouncementBodyInput = z.infer<typeof createAnnouncementBodySchema>;
