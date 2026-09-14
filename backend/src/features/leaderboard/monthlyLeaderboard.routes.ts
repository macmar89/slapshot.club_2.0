import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import * as monthlyLeaderboardController from './monthlyLeaderboard.controller.js';
import {
  getGroupMonthlyLeaderboardSchema,
  getMonthlyLeaderboardSchema,
  getMonthlyPeriodsHistorySchema,
} from './monthlyLeaderboard.schema.js';

const monthlyLeaderboardRouter = Router({ mergeParams: true });

monthlyLeaderboardRouter.get(
  '/periods',
  validate(getMonthlyPeriodsHistorySchema),
  monthlyLeaderboardController.getMonthlyPeriodsHistoryHandler,
);

monthlyLeaderboardRouter.get(
  '/',
  validate(getMonthlyLeaderboardSchema),
  monthlyLeaderboardController.getMonthlyLeaderboardHandler,
);

const groupMonthlyLeaderboardRouter = Router({ mergeParams: true });

groupMonthlyLeaderboardRouter.get(
  '/',
  validate(getGroupMonthlyLeaderboardSchema),
  monthlyLeaderboardController.getGroupMonthlyLeaderboardHandler,
);

export { groupMonthlyLeaderboardRouter, monthlyLeaderboardRouter };
