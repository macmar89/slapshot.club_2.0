import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import {
  createGroup,
  getGroupDetail,
  getGroupMembers,
  getUserGroupsByCompetitionSlug,
  joinGroup,
} from '../services/groups.service.js';
import type { UserSubscriptionPlan } from '../types/user.types';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { GroupMessages } from '../shared/constants/messages/group.messages';
import { logActivity } from '../services/audit.service';
import { logger } from '../utils/logger';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const response = await createGroup(userId, userSubscriptionPlan, req.body);

  logActivity(
    req,
    'GROUP_CREATE',
    { type: 'group', id: response.groupId },
    {
      userId,
      userSubscriptionPlan,
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
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const response = await joinGroup(userId, userSubscriptionPlan, req.body);

  logActivity(
    req,
    'GROUP_JOIN',
    { type: 'group', id: response!.group.id },
    {
      userId,
      userSubscriptionPlan,
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

export const getGroupDetailHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const slug = req.params.slug as string;

  const response = await getGroupDetail(userId, slug);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});

export const getGroupMembersHandler = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.group!.groupId as string;
  const search = req.query.search as string;

  const data = await getGroupMembers(groupId, search);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data });
});
