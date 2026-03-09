import { db } from '../db/index.js';
import type { CreateGroupInput, JoinGroupInput } from '../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../repositories/competition.repository.js';
import { AppError } from '../utils/appError.js';
import { CompetitionMessages } from '../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groupMembers, groups } from '../db/schema/groups.js';
import type { UserSubscriptionPlan } from '../types/user.js';
import { PlayerMessages } from '../shared/constants/messages/player.messages.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../config/app.js';
import { and, count, eq, ne, sql } from 'drizzle-orm';
import { GroupMessages } from '../shared/constants/messages/group.messages.js';
import { groupMembersRepository } from '../repositories/groupMembers.repository.js';
import { groupRepository } from '../repositories/group.repository.js';

export const createGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: CreateGroupInput,
) => {
  const competitionId = await competitionRepository.getIdBySlug(body.competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  if (!(userSubscriptionPlan === 'pro' || userSubscriptionPlan === 'vip')) {
    throw new AppError(PlayerMessages.ERRORS.USER_NOT_PRO_OR_VIP, HttpStatus.FORBIDDEN);
  }

  const groupId = createId();
  const slugSuffix = groupId.slice(-6);
  const inviteCode = `GROUP-${groupId.slice(3, 9).toUpperCase()}`;

  await db.transaction(async (tx) => {
    await tx.insert(groups).values({
      id: groupId,
      name: body.name,
      slug: generateSlug(body.name, slugSuffix),
      type: body.type,
      ownerId: userId,
      competitionId: competitionId,
      code: inviteCode,
      creditCost: 0,
      maxMembers:
        userSubscriptionPlan === 'vip'
          ? APP_CONFIG.groups.maxMembers.vip
          : APP_CONFIG.groups.maxMembers.pro,
      statsMembersCount: 1,
    });

    await tx.insert(groupMembers).values({
      groupId,
      userId,
    });
  });
};

export const joinGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: JoinGroupInput,
) => {
  const groupResult = await db.query.groups.findFirst({
    columns: { id: true, type: true },
    where: (groups, { eq }) => eq(groups.code, body.code),
  });

  if (!groupResult) throw new AppError(GroupMessages.ERRORS.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND);

  const isGroupMember = await db.query.groupMembers.findFirst({
    columns: { id: true },
    where: (groupMembers, { eq, and }) =>
      and(eq(groupMembers.groupId, groupResult.id), eq(groupMembers.userId, userId)),
  });

  if (isGroupMember) {
    throw new AppError(GroupMessages.ERRORS.USER_ALREADY_JOINED, HttpStatus.CONFLICT);
  }

  switch (groupResult.type) {
    case 'private':
      return await joinPrivateGroup(userId, userSubscriptionPlan, groupResult.id);
    // case 'business':
    //   return await joinBusinessGroup(userId, plan, group);
    // case 'vip':
    //   return await joinVipGroup(userId, plan, group);
    // default:
    //   return await joinStandardGroup(userId, plan, group);
  }
};

export const joinPrivateGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  groupId: string,
) => {
  const isFreeUser = userSubscriptionPlan === 'free' || userSubscriptionPlan === 'starter';
  const isProUser = userSubscriptionPlan === 'pro';

  const [groupMemberhipsCountResult] = await db
    .select({ count: count() })
    .from(groupMembers)
    .where(eq(groupMembers.userId, userId));

  const groupMemberhipsCount = groupMemberhipsCountResult
    ? Number(groupMemberhipsCountResult?.count)
    : 0;

  if (isFreeUser && groupMemberhipsCount >= APP_CONFIG.groups.maxJoinedGroups.free) {
    throw new AppError(GroupMessages.ERRORS.MAX_GROUPS_REACHED);
  }

  if (isProUser && groupMemberhipsCount >= APP_CONFIG.groups.maxJoinedGroups.pro) {
    throw new AppError(GroupMessages.ERRORS.MAX_GROUPS_REACHED);
  }

  const increaseMaxMembersMap: Record<UserSubscriptionPlan, number> = {
    free: APP_CONFIG.groups.maxMembers.free,
    starter: APP_CONFIG.groups.maxMembers.starter,
    pro: APP_CONFIG.groups.maxMembers.pro,
    vip: APP_CONFIG.groups.maxMembers.vip,
  };

  return await db.transaction(async (tx) => {
    await groupMembersRepository.addMember(userId, groupId, 'pending', tx);
    await groupRepository.updateGroupStats(
      groupId,
      increaseMaxMembersMap[userSubscriptionPlan],
      tx,
    );
  });
};
