import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import * as leaderboardController from './leaderboard.controller.js';
import { getLeaderboardSchema, getMyCompetitionStatsSchema } from './leaderboard.schema.js';

const leaderboardRouter = Router({ mergeParams: true });

leaderboardRouter.get(
  '/me',
  validate(getMyCompetitionStatsSchema),
  leaderboardController.getMyCompetitionStatsHandler,
);

leaderboardRouter.get(
  '/',
  validate(getLeaderboardSchema),
  leaderboardController.getLeaderboardHandler,
);

const groupLeaderboardRouter = Router({ mergeParams: true });

groupLeaderboardRouter.get('/', leaderboardController.getGroupLeaderboardHandler);

export { groupLeaderboardRouter, leaderboardRouter };
