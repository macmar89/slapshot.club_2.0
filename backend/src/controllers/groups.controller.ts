import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import {
  getGroupMembers,
  joinGroup,
  removeMember,
  transferOwnership,
  updateMemberRole,
  updateMemberStatus,
} from '../services/groups/groupsMember.service.js';
import type { UserSubscriptionPlan } from '../types/user.types';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { GroupMessages } from '../shared/constants/messages/group.messages';
import { logActivity } from '../services/audit.service';
import { logger } from '../utils/logger';
import {
  createGroup,
  getGroupDetail,
  getGroupSettings,
  getUserGroupsByCompetitionSlug,
} from '../services/groups/groupsCore.service';
import { getGroupLeaderboard } from '../services/groups/groupLeaderboard.service';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId, subscriptionPlan } = req.user!;

  const response = await createGroup(userId, subscriptionPlan, req.body);

  logActivity(
    req,
    'GROUP_CREATE',
    { type: 'group', id: response.groupId },
    {
      userId,
      subscriptionPlan,
      name: req.body.name,
      type: req.body.type,
      competitionId: response.competitionId,
    },
  ).catch((err) => logger.error(err));

  res
    .status(HttpStatusCode.CREATED)
    .json({ status: 'success', data: { message: GroupMessages.GROUP_CREATED } });
});

export const joinGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId, subscriptionPlan } = req.user!;

  const response = await joinGroup(userId, subscriptionPlan, req.body);

  logActivity(
    req,
    'GROUP_JOIN',
    { type: 'group', id: response!.group.id },
    {
      userId,
      subscriptionPlan,
      name: response!.group.name,
      type: response!.group.type,
      competitionId: response!.competitionId,
    },
  ).catch((err) => logger.error(err));

  return res
    .status(HttpStatusCode.CREATED)
    .json({ status: 'success', data: GroupMessages.JOIN_GROUP_SUCCESS });
});

export const getUserGroupsByCompetitionSlugHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user! as typeof req.user & { subscriptionPlan: UserSubscriptionPlan };
    const competitionSlug = req.params.competitionSlug as string;

    const data = await getUserGroupsByCompetitionSlug(user, competitionSlug);

    return res.status(HttpStatusCode.OK).json({ status: 'success', data });
  },
);

export const getGroupLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;

  const response = await getGroupLeaderboard(req.group!.groupId, userId);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});

export const getGroupDetailHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;
  const slug = req.params.slug as string;

  const response = await getGroupDetail(userId, slug);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});

export const getGroupMembersHandler = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;
  const { groupId } = req.group!;
  const search = req.query.search as string;

  const data = await getGroupMembers(groupId, userId, search);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data });
});

export const getGroupSettingsHandler = catchAsync(async (req: Request, res: Response) => {
  const { groupId } = req.group!;

  const data = await getGroupSettings(groupId);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data });
});

export const updateMemberStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { groupId } = req.group!;
  const { status } = req.body;
  const { id: userId } = req.user!;

  const response = await updateMemberStatus(memberId as string, groupId, status);

  logActivity(
    req,
    'GROUP_STATUS_CHANGE',
    { type: 'group', id: groupId },
    {
      actorId: userId,
      targetId: response.targetId,
      action: 'GROUP_STATUS_CHANGE',
      metadata: {
        oldStatus: 'pending',
        newStatus: status,
        memberId: memberId,
      },
    },
  ).catch((err) => logger.error(err));

  return res.status(HttpStatusCode.CREATED).json({ status: 'success' });
});

export const transferOwnershipHandler = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.body;
  const { groupId } = req.group!;
  const { id: userId } = req.user!;

  const response = await transferOwnership(memberId as string, userId, groupId);

  logActivity(
    req,
    'GROUP_OWNERSHIP_TRANSFER',
    { type: 'group', id: groupId },
    {
      actorId: userId,
      metadata: {
        oldOwnerId: userId,
        newOwnerId: response.newOwnerId,
      },
    },
  ).catch((err) => logger.error(err));

  return res.status(HttpStatusCode.CREATED).json({ status: 'success' });
});

export const updateMemberRoleHandler = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { groupId } = req.group!;
  const { role } = req.body;
  const { id: userId } = req.user!;

  const response = await updateMemberRole(memberId as string, groupId, role);

  logActivity(
    req,
    'GROUP_ROLE_CHANGE',
    { type: 'group', id: groupId },
    {
      actorId: userId,
      action: 'GROUP_ROLE_CHANGE',
      metadata: {
        oldRole: 'member',
        newRole: role,
        memberId: response.targetId,
      },
    },
  ).catch((err) => logger.error(err));

  return res.status(HttpStatusCode.CREATED).json({ status: 'success' });
});

export const removeMemberHandler = catchAsync(async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { groupId } = req.group!;
  const { id: userId } = req.user!;

  const response = await removeMember(memberId as string, groupId, userId);

  logActivity(
    req,
    'GROUP_KICK',
    { type: 'group', id: groupId },
    {
      actorId: userId,
      targetId: response.targetId,
      action: 'GROUP_KICK',
      metadata: {
        memberId: memberId,
      },
    },
  ).catch((err) => logger.error(err));

  return res.status(HttpStatusCode.OK).json({ status: 'success', response });
});
