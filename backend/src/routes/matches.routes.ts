import { Router } from 'express';
import * as matchesController from '../controllers/matches.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { getMatchPredictionSchema } from '../shared/constants/schema/matches.schema.js';

const router = Router();

router.get('/:matchId', validate(getMatchPredictionSchema), matchesController.getMatchInfoHandler);
router.get(
  '/:matchId/predictions',
  validate(getMatchPredictionSchema),
  matchesController.getMatchPredictionsHandler,
);

export default router;
