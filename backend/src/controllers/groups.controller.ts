import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import { createGroup, joinGroup } from '../services/groups.service.js';
import type { UserSubscriptionPlan } from '../types/user';
import { HttpStatus } from '../utils/httpStatusCodes';
import { GroupMessages } from '../shared/constants/messages/group.messages';
import { logActivity } from '../services/audit.service';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const response = await createGroup(userId, userSubscriptionPlan, req.body);

  await logActivity(
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
  );

  res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', data: { message: GroupMessages.GROUP_CREATED } });
});

export const joinGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const response = await joinGroup(userId, userSubscriptionPlan, req.body);

  await logActivity(
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
  );

  return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', data: GroupMessages.JOIN_GROUP_SUCCESS, response });
});
