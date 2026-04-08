import { z } from 'zod';
import { announcementTypes } from './announcements.types';

export const localeContentSchema = z.object({
  title: z.string().min(3, 'title_min'),
  excerpt: z.string().max(500, 'excerpt_max'),
  content: z.string().min(10, 'content_min'),
});

export const announcementFormSchema = z.object({
  slug: z
    .string()
    .min(3, 'slug_min')
    .regex(/^[a-z0-9-]+$/, 'slug_format'),
  type: z.enum(announcementTypes),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  locales: z.object({
    sk: localeContentSchema,
    cz: localeContentSchema,
    en: localeContentSchema,
  }),
});
