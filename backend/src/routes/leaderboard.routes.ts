import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getLeaderboardSchema,
  getMyCompetitionStatsSchema,
} from '../shared/constants/schema/competitions.schema.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(isAuth);

router.get(
  '/me',
  validate(getMyCompetitionStatsSchema),
  leaderboardController.getMyCompetitionStatsHandler,
);

router.get('/', validate(getLeaderboardSchema), leaderboardController.getLeaderboardHandler);

export default router;
