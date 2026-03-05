import { Router } from 'express';
import * as matchesController from '../controllers/matches.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getMatchDetailInfoSchema,
  getMatchDetailPredictionsSchema,
} from '../shared/constants/schema/matches.schema.js';

const router = Router();

router.get('/:matchId', validate(getMatchDetailInfoSchema), matchesController.getMatchInfoHandler);
router.get(
  '/:matchId/predictions',
  validate(getMatchDetailPredictionsSchema),
  matchesController.getMatchPredictionsHandler,
);

export default router;
