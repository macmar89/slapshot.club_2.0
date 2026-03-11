import { z } from 'zod';

const groupType = ['private', 'vip', 'business', 'pub', 'partner'] as const;

export const createGroupSchema = z
  .object({
    name: z.string().min(3).max(100),
    competitionSlug: z.string().min(3).max(100),
    type: z.enum(groupType),
    isAliasRequired: z.boolean().default(false).optional(),
  })
  .strict();

export const createGroupHandlerSchema = z.object({
  body: createGroupSchema,
});

export const joinGroupSchema = z
  .object({
    code: z.string(),
    competitionSlug: z.string(),
  })
  .strict();

export const joinGroupHandlerSchema = z.object({
  body: joinGroupSchema,
});

export const getUserGroupsByCompetitionSlugSchema = z.object({
  params: z.object({
    competitionSlug: z.string(),
  }),
});

export const getGroupDetailSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

export const getGroupMembersSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
  query: z.object({
    search: z.string().optional(),
  }),
});

export type GroupType = z.infer<typeof createGroupSchema>['type'];
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;
