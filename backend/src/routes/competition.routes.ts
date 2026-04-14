import { Router } from 'express';
import * as competitionController from '../controllers/competition.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  joinCompetitionSchema,
  getMyCompetitionStatsSchema,
  getPlayerPredictionsSchema,
} from '../shared/constants/schema/competitions.schema.js';
import { isAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { getCompetitionMatchesSchema } from '../shared/constants/schema/matches.schema.js';
import leaderboardRoutes from './leaderboard.routes.js';

const router = Router();

//  public endpoints
router.get('/public/:slug', optionalAuth, competitionController.getPublicCompetitionNameHandler);

//  protected endpoints
router.use(isAuth);
router.get('/counts', competitionController.getCompetitionCountsHandler);
router.get('/', competitionController.getCompetitionsHandler);
router.post('/join', validate(joinCompetitionSchema), competitionController.joinCompetitionHandler);

router.use('/:slug/leaderboard', leaderboardRoutes);

router.get(
  '/:slug/matches',
  validate(getCompetitionMatchesSchema),
  competitionController.getCompetitionMatchesHandler,
);
router.get(
  '/:slug/matches/upcoming',
  validate(getMyCompetitionStatsSchema),
  competitionController.getUpcomingMatchesHandler,
);
router.get(
  '/:slug/matches/calendar',
  validate(getMyCompetitionStatsSchema),
  competitionController.getCalendarMatchesHandler,
);

router.get('/:slug/player/:username/stats', competitionController.getPlayerStatsHandler);
router.get(
  '/:slug/player/:username/predictions',
  validate(getPlayerPredictionsSchema),
  competitionController.getPlayerPredictionsHandler,
);
router.get('/:slug/teams', competitionController.getCompetitionTeamsHandler);

export default router;
