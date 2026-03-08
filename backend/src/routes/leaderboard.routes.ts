import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getLeaderboardSchema,
  getMyCompetitionStatsSchema,
} from '../shared/constants/schema/competitions.schema.js';

const router = Router({ mergeParams: true });

router.get(
  '/me',
  validate(getMyCompetitionStatsSchema),
  leaderboardController.getMyCompetitionStatsHandler,
);

router.get('/', validate(getLeaderboardSchema), leaderboardController.getLeaderboardHandler);

export default router;
