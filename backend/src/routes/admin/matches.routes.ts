import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { getAllMatchesSchema, getMatchDetailSchema, updateMatchSchema, syncMatchesSchema, recalculatePlayoffsSchema } from '../../shared/constants/schema/admin/matches.schema.js';
import {
  getAllMatchesHandler,
  getMatchDetailHandler,
  updateMatchHandler,
  evaluateMatchHandler,
  revertMatchEvaluationHandler,
  recalculateMatchHandler,
  syncMatchesHandler,
  recalculatePlayoffSeriesHandler,
} from '../../controllers/admin/matches.controller.js';
import { paginate } from '../../middlewares/pagination.middleware.js';
import { getCompetitionsLookupHandler, getTeamsLookupHandler } from '../../controllers/admin/matches.controller.js';

const router = Router();

router.get('/', validate(getAllMatchesSchema), paginate(), getAllMatchesHandler);
router.post('/sync', validate(syncMatchesSchema), syncMatchesHandler);
router.post('/playoffs/recalculate', validate(recalculatePlayoffsSchema), recalculatePlayoffSeriesHandler);
router.get('/competitions/lookup', getCompetitionsLookupHandler);
router.get('/teams/lookup', getTeamsLookupHandler);
router.get('/:id', validate(getMatchDetailSchema), getMatchDetailHandler);
router.patch('/:id', validate(updateMatchSchema), updateMatchHandler);
router.post('/:id/evaluate', validate(getMatchDetailSchema), evaluateMatchHandler);
router.post('/:id/revert-evaluation', validate(getMatchDetailSchema), revertMatchEvaluationHandler);
router.post('/:id/recalculate', validate(getMatchDetailSchema), recalculateMatchHandler);

export default router;
