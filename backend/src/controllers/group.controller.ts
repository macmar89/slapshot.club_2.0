import { catchAsync } from '../utils/catchAsync';
import type { Request, Response } from 'express';
import { createGroup } from '../services/group.service.js';

export const createGroupHandler = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const data = await createGroup(user, req.body);

  res.status(201).json({ status: 'success', data });
});
