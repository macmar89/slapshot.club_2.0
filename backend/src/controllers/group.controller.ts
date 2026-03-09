import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import { createGroup } from '../services/group.service.js';
import type { UserSubscriptionPlan } from '../types/user';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userSubscriptionPlan = req.user!.subscriptionPlan as UserSubscriptionPlan;

  const data = await createGroup(userId, userSubscriptionPlan, req.body);

  res.status(201).json({ status: 'success', data });
});

export const joinGroupHandler = catchAsync(async (req: Request, res: Response) => {});
