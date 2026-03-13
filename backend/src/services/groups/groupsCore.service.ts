import { db } from '../../db/index.js';
import type { CreateGroupInput } from '../../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../../repositories/competitions.repository.js';
import { AppError } from '../../utils/appError.js';
import { CompetitionMessages } from '../../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groupMembers, groups } from '../../db/schema/groups.js';
import type { User, UserSubscriptionPlan } from '../../types/user.types.js';
import { PlayerMessages } from '../../shared/constants/messages/player.messages.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../../config/app.js';
import { GroupMessages } from '../../shared/constants/messages/group.messages.js';
import { groupRepository } from '../../repositories/groups.repository.js';
import { leaderboardEntriesRepository } from '../../repositories/leaderboardEntries.repository.js';
import { eq, and, isNull, ne, desc, sql } from 'drizzle-orm';
import { notDeleted } from '../../db/helpers.js';
import { competitionsValidationService } from '../competitions/competitionsValidation.service.js';
import { groupMembersRepository } from '../../repositories/groupMembers.repository.js';

export const createGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: CreateGroupInput,
) => {
  const idFromSlug = await competitionRepository.getIdBySlug(body.competitionSlug);

  const competitionId = competitionsValidationService.ensureExists(idFromSlug);

  if (!(userSubscriptionPlan === 'pro' || userSubscriptionPlan === 'vip')) {
    throw new AppError(PlayerMessages.ERRORS.USER_NOT_PRO_OR_VIP, HttpStatusCode.FORBIDDEN);
  }

  const leadeboardEntry = await leaderboardEntriesRepository.getStatsByUser(userId, competitionId);

  const { statsJoinedPrivateGroups, statsOwnedPrivateGroups } = leadeboardEntry;

  if (
    statsJoinedPrivateGroups >= APP_CONFIG.GROUPS.MAX_JOINED_PRIVATE_GROUPS[userSubscriptionPlan]
  ) {
    throw new AppError(GroupMessages.ERRORS.MAX_JOINED_GROUPS_REACHED, HttpStatusCode.FORBIDDEN);
  }

  if (
    statsOwnedPrivateGroups >= APP_CONFIG.GROUPS.MAX_CREATED_PRIVATE_GROUPS[userSubscriptionPlan]
  ) {
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
          ? APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST.vip
          : APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST.pro,
      statsMembersCount: 1,
      isAliasRequired: body.isAliasRequired ?? false,
    });

    await tx.insert(groupMembers).values({
      groupId,
      userId,
      role: 'owner',
    });

    await leaderboardEntriesRepository.incrementJoinedPrivateGroupsCount(competitionId, userId, tx);
    await leaderboardEntriesRepository.incrementOwnedPrivateGroupsCount(competitionId, userId, tx);
  });

  return { groupId, competitionId };
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

export const getGroupSettings = async (groupId: string) => {
  const result: any = await groupRepository.getSettingsById(groupId);

  const { settings, ...rest } = result;

  return { ...rest, ...settings };
};

export const getUserGroupsByCompetitionSlug = async (user: User, competitionSlug: string) => {
  const idFromSlug = await competitionRepository.getIdBySlug(competitionSlug);

  const competitionId = competitionsValidationService.ensureExists(idFromSlug);

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

  const groupLimits = APP_CONFIG.GROUPS;

  return {
    data: userGroups,
    metadata: {
      canCreateMore: ownedCount < groupLimits.MAX_CREATED_PRIVATE_GROUPS[subscriptionPlan],
      canJoinMore: joinedCount < groupLimits.MAX_JOINED_PRIVATE_GROUPS[subscriptionPlan],
      maxOwned: groupLimits.MAX_CREATED_PRIVATE_GROUPS[subscriptionPlan],
      maxJoined: groupLimits.MAX_JOINED_PRIVATE_GROUPS[subscriptionPlan],
      currentOwned: ownedCount,
      currentJoined: joinedCount,
      isOverLimit:
        ownedCount > groupLimits.MAX_CREATED_PRIVATE_GROUPS[subscriptionPlan] ||
        joinedCount > groupLimits.MAX_JOINED_PRIVATE_GROUPS[subscriptionPlan],
    },
  };
};

export const calculateGroupCapacity = async (groupId: string, userId: string): Promise<number> => {
  const [group, memberSubscriptions] = await Promise.all([
    groupRepository.getById(groupId, ['absoluteMaxCapacity']),
    groupMembersRepository.getMembersWithSubscriptionPlanById(groupId),
  ]);

  const totalBoost = memberSubscriptions
    .filter((ms) => ms.userId !== userId)
    .reduce((acc, ms) => {
      const plan = ms.user.subscriptionPlan as keyof typeof APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST;
      return acc + (APP_CONFIG.GROUPS.MEMBER_CAPACITY_BOOST[plan] ?? 0);
    }, 0);

  return Math.min(totalBoost, group!.absoluteMaxCapacity);
};
