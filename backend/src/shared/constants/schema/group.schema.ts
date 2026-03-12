import { z } from 'zod';

const groupType = ['private', 'vip', 'business', 'pub', 'partner'] as const;
const groupMemberStatus = ['active', 'pending', 'banned', 'rejected', 'invited'] as const;
const groupMemberRole = ['owner', 'admin', 'member'] as const;

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

export const updateMemberStatusBodySchema = z
  .object({
    status: z.enum(groupMemberStatus),
  })
  .strict();

export const updateMemberStatusSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
    memberId: z.string().min(1),
  }),
  body: updateMemberStatusBodySchema,
});

export const transferOwnershipBodySchema = z
  .object({
    memberId: z.string().min(1),
  })
  .strict();

export const transferOwnershipSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
  body: transferOwnershipBodySchema,
});

export const updateMemberRoleBodySchema = z.object({
  role: z.enum(groupMemberRole),
});

export const updateMemberRoleSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
    memberId: z.string().min(1),
  }),
  body: updateMemberRoleBodySchema,
});

export type GroupType = z.infer<typeof createGroupSchema>['type'];
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;

export type GroupMemberStatus = z.infer<typeof updateMemberStatusBodySchema>['status'];
export type GroupMemberRole = z.infer<typeof updateMemberRoleBodySchema>['role'];
