import { db } from '../../db/index.js';
import type {
  GroupMemberRole,
  GroupMemberStatus,
  GroupType,
  JoinGroupInput,
} from '../../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../../repositories/competitions.repository.js';
import { AppError } from '../../utils/appError.js';
import { CompetitionMessages } from '../../shared/constants/messages/competition.messages.js';
import { groupMembers } from '../../db/schema/groups.js';
import type { UserSubscriptionPlan } from '../../types/user.types.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../../config/app.js';
import { GroupMessages } from '../../shared/constants/messages/group.messages.js';
import { groupMembersRepository } from '../../repositories/groupMembers.repository.js';
import { groupRepository } from '../../repositories/groups.repository.js';
import { leaderboardEntriesRepository } from '../../repositories/leaderboardEntries.repository.js';
import { eq, and } from 'drizzle-orm';
import { userRepository } from '../../repositories/user.repository.js';
import { AuthMessages } from '../../shared/constants/messages/auth.messages.js';
import { groupsValidationService } from './groupsValidation.service.js';
import { competitionsValidationService } from '../competitions/competitionsValidation.service.js';
import { calculateGroupCapacity } from './groupsCore.service.js';
import { logger } from '../../utils/logger.js';
import { notify } from '../notifications.service.js';

export const joinGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: JoinGroupInput,
) => {
  const idFromSlug = await competitionRepository.getIdBySlug(body.competitionSlug);

  const competitionId = competitionsValidationService.ensureExists(idFromSlug);

  const isCompetitionMember = await leaderboardEntriesRepository.isMember(competitionId, userId);

  if (!isCompetitionMember) {
    throw new AppError(
      CompetitionMessages.ERRORS.USER_NOT_COMPETITION_MEMBER,
      HttpStatusCode.FORBIDDEN,
    );
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

  groupsValidationService.ensureNotBanned(isGroupMember?.status);
  groupsValidationService.ensureNotRejected(isGroupMember?.status);
  groupsValidationService.ensureNotAlreadyMember(isGroupMember);

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

  if (
    statsJoinedPrivateGroups >= APP_CONFIG.GROUPS.MAX_JOINED_PRIVATE_GROUPS[userSubscriptionPlan]
  ) {
    throw new AppError(GroupMessages.ERRORS.MAX_GROUPS_REACHED, HttpStatusCode.BAD_REQUEST);
  }

  const finalStatus = group.settings?.requireApproval ? 'pending' : 'active';
  const isImmediatelyActive = finalStatus === 'active';

  try {
    await db.transaction(async (tx) => {
      await groupMembersRepository.addMember(userId, group.id, finalStatus, tx);

      if (isImmediatelyActive) {
        await groupRepository.incrementMaxMembers(
          group.id,
          APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST[userSubscriptionPlan],
          tx,
        );
        await groupRepository.incrementMemberCount(group.id, tx);
        await leaderboardEntriesRepository.incrementJoinedPrivateGroupsCount(
          competitionId,
          userId,
          tx,
        );
      } else {
        await groupRepository.incrementPendingMembersCount(group.id, tx);
      }
    });

    logger.info(
      { userId, groupId: group.id, name: group.name },
      `User joined group with status: ${finalStatus}`,
    );
    if (!isImmediatelyActive) {
      const adminIds = await groupMembersRepository.getAdminsByGroupId(group.id);
      await notify({
        userIds: adminIds,
        type: 'GROUP_PENDING',
        payload: { groupId: group.id, groupName: group.name, requestingUserId: userId },
      });
    }

    return {
      group,
      competitionId,
    };
  } catch (error: any) {
    logger.error(
      { error: error.message, userId, groupId: group.id },
      'Failed to join private group',
    );
    throw error;
  }
};

export const getGroupMembers = async (groupId: string, userId: string, search?: string) => {
  const members = await groupMembersRepository.getByGroupId(groupId, userId, search);

  const active = members.filter((m) => m.status === 'active');
  const pending = members.filter((m) => m.status === 'pending');
  const banned = members.filter((m) => m.status === 'banned');
  const invited = members.filter((m) => m.status === 'invited');
  const rejected = members.filter((m) => m.status === 'rejected');

  return {
    active,
    pending,
    banned,
    invited,
    rejected,
    metadata: { myMemberRole: members.find((m) => m.userId === userId)?.memberRole },
  };
};

export const updateMemberStatus = async (
  memberId: string,
  groupId: string,
  status: GroupMemberStatus,
) => {
  const { targetId } = await db.transaction(async (tx) => {
    const [updatedMember] = await tx
      .update(groupMembers)
      .set({ status, joinedAt: status === 'active' ? new Date().toISOString() : null })
      .where(and(eq(groupMembers.id, memberId), eq(groupMembers.groupId, groupId)))
      .returning({ targetId: groupMembers.userId });

    const targetId = updatedMember?.targetId;

    if (!targetId) {
      throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (status === 'active') {
      await handleMemberActivation(tx, targetId, groupId);
    }
    if (status === 'rejected') {
      await handleMemberRejection(tx, memberId, groupId);
    }
    if (status === 'banned') {
      await handleMemberBanned(tx, targetId, groupId);
    }

    return { targetId };
  });

  if (status === 'active') {
    await notify({
      userId: targetId,
      type: 'GROUP_PENDING_ACCEPTED',
      payload: { groupId },
    });
  } else if (status === 'rejected') {
    await notify({
      userId: targetId,
      type: 'GROUP_PENDING_REJECTED',
      payload: { groupId },
    });
  }

  return { targetId };
};

const handleMemberActivation = async (tx: any, targetId: string, groupId: string) => {
  const subscriptionPlan = await userRepository.getSubscriptionPlanById(targetId);

  if (!subscriptionPlan) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const competitionId = await groupRepository.getCompetitionIdByGroupId(groupId);

  await groupRepository.incrementMaxMembers(
    groupId,
    APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST[subscriptionPlan],
    tx,
  );
  await groupRepository.incrementMemberCount(groupId, tx);
  await groupRepository.decrementPendingMembersCount(groupId, tx);
  await leaderboardEntriesRepository.incrementJoinedPrivateGroupsCount(
    competitionId!,
    targetId,
    tx,
  );
};

const handleMemberRejection = async (tx: any, memberId: string, groupId: string) => {
  await groupRepository.decrementPendingMembersCount(groupId, tx);
};

const handleMemberBanned = async (tx: any, memberId: string, groupId: string) => {
  //  odpocitat statsMemberCount - 1
  //  zmenit groupMember status na banned
  //  zmenšiť maxMembers podla plánu targetId
};

export const transferOwnership = async (memberId: string, userId: string, groupId: string) => {
  const targetId = await groupMembersRepository.getUserById(memberId, ['active']);

  if (!targetId) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const targetSubscriptionPlan = await userRepository.getSubscriptionPlanById(targetId);

  if (!targetSubscriptionPlan) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const isEligible = (APP_CONFIG.GROUPS.ELIGIBLE_FOR_OWNERSHIP as readonly string[]).includes(
    targetSubscriptionPlan,
  );

  if (!isEligible) {
    throw new AppError(
      GroupMessages.ERRORS.INSUFFICIENT_PLAN_FOR_OWNERSHIP,
      HttpStatusCode.FORBIDDEN,
    );
  }

  const { newOwnerId } = await db.transaction(async (tx) => {
    const [updatedMember] = await groupMembersRepository.updateMemberRole(
      memberId,
      groupId,
      'owner',
      tx,
    );

    const newOwnerId = updatedMember?.userId;

    await groupRepository.updateGroupOwner(groupId, newOwnerId, tx);
    await groupMembersRepository.updateMemberRoleByUserId(userId, groupId, 'admin', tx);

    return { newOwnerId };
  });
  return { newOwnerId };
};

export const updateMemberRole = async (
  memberId: string,
  groupId: string,
  role: GroupMemberRole,
) => {
  const targetId = await groupMembersRepository.getUserById(memberId, ['active']);

  if (!targetId) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  await groupMembersRepository.updateMemberRole(memberId, groupId, role);

  return { targetId };
};

export const removeMember = async (memberId: string, groupId: string) => {
  const member = await groupMembersRepository.getMemberById(memberId, ['userId', 'status']);

  if (!member) {
    throw new AppError(GroupMessages.ERRORS.MEMBER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  return await db.transaction(async (tx) => {
    if (member.status !== 'active') {
      await groupMembersRepository.removeMember(memberId, groupId, tx);

      if (member.status === 'pending') {
        await groupRepository.decrementPendingMembersCount(groupId, tx);
      }

      return { targetId: member.userId };
    }

    const targetSubscriptionPlan = await userRepository.getSubscriptionPlanById(member.userId);

    if (!targetSubscriptionPlan) {
      throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const competitionId = await groupRepository.getCompetitionIdByGroupId(groupId);

    await groupMembersRepository.removeMember(memberId, groupId, tx);
    await groupRepository.decrementMemberCount(groupId, tx);
    await leaderboardEntriesRepository.decrementJoinedPrivateGroupsCount(
      competitionId!,
      member.userId,
      tx,
    );

    const isEligible = (APP_CONFIG.GROUPS.ELIGIBLE_FOR_OWNERSHIP as readonly string[]).includes(
      targetSubscriptionPlan,
    );
    if (!isEligible) {
      return { targetId: member.userId };
    }

    const groupCapacity = await calculateGroupCapacity(groupId, member.userId);
    await groupRepository.updateGroup(groupId, { maxMembers: groupCapacity }, tx);

    return { targetId: member.userId, groupCapacity };
  });
};

export const activateGroupMember = async (userId: string, memberId: string) => {
  try {
    const member = await groupMembersRepository.getMemberById(memberId, ['groupId', 'userId']);

    if (!member) {
      throw new AppError(GroupMessages.ERRORS.MEMBER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    await db.transaction(async (tx) => {
      await handleMemberActivation(tx, member.userId, member.groupId);
    });

    logger.info({ userId, groupId: member.groupId }, 'User activated in group');
  } catch (error: any) {
    logger.error({ error: error.message, userId, memberId }, 'Failed to activate group member');
    throw error;
  }
};
