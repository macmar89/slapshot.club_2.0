import { db } from '../db/index.js';
import type {
  CreateGroupInput,
  GroupMemberStatus,
  GroupType,
  JoinGroupInput,
} from '../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../repositories/competitions.repository.js';
import { AppError } from '../utils/appError.js';
import { CompetitionMessages } from '../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groupMembers, groups } from '../db/schema/groups.js';
import type { User, UserSubscriptionPlan } from '../types/user.types.js';
import { PlayerMessages } from '../shared/constants/messages/player.messages.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../config/app.js';
import { GroupMessages } from '../shared/constants/messages/group.messages.js';
import { groupMembersRepository } from '../repositories/groupMembers.repository.js';
import { groupRepository } from '../repositories/groups.repository.js';
import { leaderboardEntriesRepository } from '../repositories/leaderboardEntries.repository.js';
import { eq, and, isNull, ne, desc, sql } from 'drizzle-orm';
import { notDeleted } from '../db/helpers.js';
import { userRepository } from '../repositories/user.repository.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';

export const createGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: CreateGroupInput,
) => {
  const competitionId = await competitionRepository.getIdBySlug(body.competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  if (!(userSubscriptionPlan === 'pro' || userSubscriptionPlan === 'vip')) {
    throw new AppError(PlayerMessages.ERRORS.USER_NOT_PRO_OR_VIP, HttpStatusCode.FORBIDDEN);
  }

  const leadeboardEntry = await leaderboardEntriesRepository.getStatsByUser(userId, competitionId);

  const { statsJoinedPrivateGroups, statsOwnedPrivateGroups } = leadeboardEntry;

  if (statsJoinedPrivateGroups >= APP_CONFIG.groups.maxJoinedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_JOINED_GROUPS_REACHED, HttpStatusCode.FORBIDDEN);
  }

  if (statsOwnedPrivateGroups >= APP_CONFIG.groups.maxCreatedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_OWNED_GROUPS_REACHED, HttpStatusCode.FORBIDDEN);
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
  const competitionId = await competitionRepository.getIdBySlug(body.competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const groupResult = await db.query.groups.findFirst({
    columns: {
      id: true,
      name: true,
      competitionId: true,
      type: true,
      maxMembers: true,
      statsMembersCount: true,
      statsPendingMembersCount: true,
      absoluteMaxCapacity: true,
      settings: true,
    },
    where: (groups, { eq, and, isNull }) =>
      and(
        eq(groups.code, body.code),
        eq(groups.competitionId, competitionId),
        isNull(groups.deletedAt),
      ),
  });

  if (!groupResult)
    throw new AppError(GroupMessages.ERRORS.GROUP_NOT_FOUND, HttpStatusCode.NOT_FOUND);

  const isGroupMember = await db.query.groupMembers.findFirst({
    columns: { status: true },
    where: (groupMembers, { eq, and }) =>
      and(eq(groupMembers.groupId, groupResult.id), eq(groupMembers.userId, userId)),
  });

  if (isGroupMember?.status === 'banned') {
    throw new AppError(GroupMessages.ERRORS.GROUP_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  if (isGroupMember) {
    throw new AppError(GroupMessages.ERRORS.USER_ALREADY_JOINED, HttpStatusCode.CONFLICT);
  }

  if (
    groupResult?.maxMembers <= groupResult?.statsMembersCount &&
    (userSubscriptionPlan === 'free' || userSubscriptionPlan === 'starter')
  ) {
    throw new AppError(GroupMessages.ERRORS.GROUP_FULL, HttpStatusCode.BAD_REQUEST);
  }

  if (groupResult?.absoluteMaxCapacity <= groupResult?.statsMembersCount) {
    throw new AppError(GroupMessages.ERRORS.GROUP_FULL, HttpStatusCode.BAD_REQUEST);
  }

  if (
    groupResult?.absoluteMaxCapacity <=
    groupResult?.statsPendingMembersCount + groupResult?.statsMembersCount
  ) {
    throw new AppError(GroupMessages.ERRORS.GROUP_FULL, HttpStatusCode.BAD_REQUEST);
  }

  if (groupResult.settings?.isLocked) {
    throw new AppError(GroupMessages.ERRORS.GROUP_LOCKED, HttpStatusCode.FORBIDDEN);
  }

  switch (groupResult.type) {
    case 'private':
      return await joinPrivateGroup(
        userId,
        userSubscriptionPlan,
        {
          id: groupResult.id,
          name: groupResult.name,
          type: groupResult.type,
          settings: groupResult.settings,
        },
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
  group: {
    id: string;
    name: string;
    type: GroupType;
    settings: { isLocked: boolean; allowMemberInvites: boolean; requireApproval: boolean };
  },
  competitionId: string,
) => {
  const leadeboardEntry = await leaderboardEntriesRepository.getStatsByUser(userId, competitionId);

  const { statsJoinedPrivateGroups } = leadeboardEntry;

  if (statsJoinedPrivateGroups >= APP_CONFIG.groups.maxJoinedPrivateGroups[userSubscriptionPlan]) {
    throw new AppError(GroupMessages.ERRORS.MAX_GROUPS_REACHED);
  }

  const finalStatus = group.settings?.requireApproval ? 'pending' : 'active';
  const isImmediatelyActive = finalStatus === 'active';

  await db.transaction(async (tx) => {
    await groupMembersRepository.addMember(userId, group.id, finalStatus, tx);

    if (isImmediatelyActive) {
      await groupRepository.incrementMaxMembers(
        group.id,
        APP_CONFIG.groups.memberCapacityBoost[userSubscriptionPlan],
        tx,
      );
      await groupRepository.incrementMemberCount(group.id, tx);
    }

    if (!isImmediatelyActive) {
      await groupRepository.incrementPendingMembersCount(group.id, tx);
    }

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

export const getUserGroupsByCompetitionSlug = async (user: User, competitionSlug: string) => {
  const competitionId = await competitionRepository.getIdBySlug(competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const { id: userId, subscriptionPlan } = user;

  const userGroups = await db
    .select({
      id: groups.id,
      name: groups.name,
      slug: groups.slug,
      code: groups.code,
      type: groups.type,
      role: groupMembers.role,
      maxMembers: groups.maxMembers,
      memberCount: groups.statsMembersCount,
      status: groups.status,
      warningExpiresAt: groups.warningExpiresAt,
      groupMemberStatus: groupMembers.status,
      pendingMembersCount: groups.statsPendingMembersCount,
      createdAt: groups.createdAt,
    })
    .from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(
      and(
        eq(groups.competitionId, competitionId),
        eq(groups.type, 'private'),
        eq(groupMembers.userId, userId),
        ne(groupMembers.status, 'banned'),
        isNull(groups.deletedAt),
      ),
    )
    .orderBy(
      sql`CASE 
        WHEN ${groupMembers.role} = 'owner' THEN 1 
        WHEN ${groupMembers.role} = 'admin' THEN 2 
        ELSE 3 
      END`,
      desc(groups.createdAt),
    );

  const ownedCount = userGroups.filter((g) => g.role === 'owner').length ?? 0;
  const joinedCount = userGroups.filter((g) => g.role !== 'owner').length ?? 0;

  const groupLimits = APP_CONFIG.groups;

  return {
    data: userGroups,
    metadata: {
      canCreateMore: ownedCount < groupLimits.maxCreatedPrivateGroups[subscriptionPlan],
      canJoinMore: joinedCount < groupLimits.maxJoinedPrivateGroups[subscriptionPlan],
      maxOwned: groupLimits.maxCreatedPrivateGroups[subscriptionPlan],
      maxJoined: groupLimits.maxJoinedPrivateGroups[subscriptionPlan],
      currentOwned: ownedCount,
      currentJoined: joinedCount,
      isOverLimit:
        ownedCount > groupLimits.maxCreatedPrivateGroups[subscriptionPlan] ||
        joinedCount > groupLimits.maxJoinedPrivateGroups[subscriptionPlan],
    },
  };
};

export const getGroupDetail = async (userId: string, slug: string) => {
  const group = await db.query.groups.findFirst({
    columns: {
      id: true,
      name: true,
      code: true,
      type: true,
      maxMembers: true,
      statsMembersCount: true,
      statsPendingMembersCount: true,
      absoluteMaxCapacity: true,
      status: true,
      warningExpiresAt: true,
      createdAt: true,
    },
    with: {
      members: {
        columns: {
          role: true,
        },
        where: (groupMembers, { eq }) => eq(groupMembers.userId, userId),
      },
    },
    where: (groups, { eq, and }) => and(eq(groups.slug, slug), notDeleted(groups)),
  });

  if (!group) {
    throw new AppError(GroupMessages.ERRORS.GROUP_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  return {
    id: group.id,
    name: group.name,
    code: group.code,
    type: group.type,
    maxMembers: group.maxMembers,
    statsMembersCount: group.statsMembersCount,
    statsPendingMembersCount: group.statsPendingMembersCount,
    absoluteMaxCapacity: group.absoluteMaxCapacity,
    status: group.status,
    warningExpiresAt: group.warningExpiresAt,
    currentUserRole: group.members[0]?.role,
    createdAt: group.createdAt,
  };
};

export const getGroupMembers = async (groupId: string, userId: string, search?: string) => {
  const members = await groupMembersRepository.getByGroupId(groupId, userId, search);

  const active = members.filter((m) => m.status === 'active');
  const pending = members.filter((m) => m.status === 'pending');
  const banned = members.filter((m) => m.status === 'banned');
  const invited = members.filter((m) => m.status === 'invited');
  const rejected = members.filter((m) => m.status === 'rejected');

  return { active, pending, banned, invited, rejected };
};

export const getGroupSettings = async (groupId: string) => {
  const result: any = await groupRepository.getSettingsById(groupId);

  const { settings, ...rest } = result;

  return { ...rest, ...settings };
};

export const updateMemberStatus = async (
  memberId: string,
  groupId: string,
  status: GroupMemberStatus,
) => {
  const { targetId } = await db.transaction(async (tx) => {
    const [updatedMember] = await tx
      .update(groupMembers)
      .set({
        alias: 'Pinokio',
      })
      // .set({ status, joinedAt: status === 'active' ? new Date().toString() : null })
      .where(and(eq(groupMembers.id, memberId), eq(groupMembers.groupId, groupId)))
      .returning({ targetId: groupMembers.userId });

    console.log(updatedMember);
    const targetId = updatedMember?.targetId;

    if (!targetId) {
      throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (status === 'active') {
      await handleMemberActivation(tx, targetId, groupId);
    }
    if (status === 'rejected') {
      await handleMemberRejection(tx, targetId, groupId);
    }
    if (status === 'banned') {
      await handleMemberBanned(tx, targetId, groupId);
    }

    return { targetId };
  });
  return { targetId };
};

async function handleMemberActivation(tx: any, targetId: string, groupId: string) {
  const subscriptionPlan = await userRepository.getSubscriptionPlanById(targetId);

  if (!subscriptionPlan) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  //  zdvihnut maxMembers podla planu targetId
  //  zdvihnut statsMemberCount + 1
  //  odpocitat statsPendingMemberCount
  //  zmenit groupMember status na active
  // await groupRepository.incrementMemberCount(groupId, tx);
}

async function handleMemberRejection(tx: any, memberId: string, groupId: string) {
  //  odpocitat statsPendingMemberCount
  //  zmenit groupMember status na rejected
}

async function handleMemberBanned(tx: any, memberId: string, groupId: string) {
  //  odpocitat statsMemberCount - 1
  //  zmenit groupMember status na banned
  //  zmenšiť maxMembers podla plánu targetId
}
