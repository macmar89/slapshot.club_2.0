import { db } from '../db/index.js';
import type {
  CreateGroupInput,
  GroupType,
  JoinGroupInput,
} from '../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../repositories/competitions.repository.js';
import { AppError } from '../utils/appError.js';
import { CompetitionMessages } from '../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groupMembers, groups } from '../db/schema/groups.js';
import type { UserSubscriptionPlan } from '../types/user.js';
import { PlayerMessages } from '../shared/constants/messages/player.messages.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../config/app.js';
import { GroupMessages } from '../shared/constants/messages/group.messages.js';
import { groupMembersRepository } from '../repositories/groupMembers.repository.js';
import { groupRepository } from '../repositories/groups.repository.js';
import { leaderboardEntriesRepository } from '../repositories/leaderboardEntries.repository.js';

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

  const leadeboardEntry = await leaderboardEntriesRepository.getStatsByUser(userId, competitionId);

  const { statsJoinedPrivateGroups, statsOwnedPrivateGroups } = leadeboardEntry;

  if (statsJoinedPrivateGroups >= APP_CONFIG.groups.maxJoinedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_JOINED_GROUPS_REACHED, HttpStatus.FORBIDDEN);
  }

  if (statsOwnedPrivateGroups >= APP_CONFIG.groups.maxCreatedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_OWNED_GROUPS_REACHED, HttpStatus.FORBIDDEN);
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
          ? APP_CONFIG.groups.memberCapacityBoost.vip
          : APP_CONFIG.groups.memberCapacityBoost.pro,
      statsMembersCount: 1,
      isAliasRequired: body.isAliasRequired ?? false,
    });

    await tx.insert(groupMembers).values({
      groupId,
      userId,
      role: 'owner',
    });

    await leaderboardEntriesRepository.updateStats(
      userId,
      competitionId,
      'inc',
      { owned: true, joined: true },
      tx,
    );
  });

  return { groupId, competitionId };
};

export const joinGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: JoinGroupInput,
) => {
  const groupResult = await db.query.groups.findFirst({
    columns: { id: true, name: true, competitionId: true, type: true },
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

  const competitionId = groupResult.competitionId;

  switch (groupResult.type) {
    case 'private':
      return await joinPrivateGroup(
        userId,
        userSubscriptionPlan,
        { id: groupResult.id, name: groupResult.name, type: groupResult.type },
        competitionId,
      );
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
  group: { id: string; name: string; type: GroupType },
  competitionId: string,
) => {
  const leadeboardEntry = await leaderboardEntriesRepository.getStatsByUser(userId, competitionId);

  const { statsJoinedPrivateGroups } = leadeboardEntry;

  if (statsJoinedPrivateGroups >= APP_CONFIG.groups.maxJoinedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_GROUPS_REACHED);
  }

  await db.transaction(async (tx) => {
    await groupMembersRepository.addMember(userId, group.id, 'pending', tx);

    await groupRepository.updateGroupStats(
      group.id,
      APP_CONFIG.groups.memberCapacityBoost[userSubscriptionPlan],
      tx,
    );

    await leaderboardEntriesRepository.updateStats(
      userId,
      competitionId,
      'inc',
      { joined: true },
      tx,
    );
  });

  return {
    group,
    competitionId,
  };
};
