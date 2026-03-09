import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import { createGroup, joinGroup } from '../services/group.service.js';
import type { UserSubscriptionPlan } from '../types/user';
import { HttpStatus } from '../utils/httpStatusCodes';
import { GroupMessages } from '../shared/constants/messages/group.messages';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  await createGroup(userId, userSubscriptionPlan, req.body);

  res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', data: { message: GroupMessages.GROUP_CREATED } });
});

export const joinGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const dev = await joinGroup(userId, userSubscriptionPlan, req.body);

  return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', data: GroupMessages.JOIN_GROUP_SUCCESS, dev });
});
