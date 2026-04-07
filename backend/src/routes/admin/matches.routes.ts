import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { getAllMatchesSchema, getMatchDetailSchema, updateMatchSchema } from '../../shared/constants/schema/admin/matches.schema.js';
import {
  getAllMatchesHandler,
  getMatchDetailHandler,
  updateMatchHandler,
  evaluateMatchHandler,
  revertMatchEvaluationHandler,
  recalculateMatchHandler,
} from '../../controllers/admin/matches.controller.js';
import { paginate } from '../../middlewares/pagination.middleware.js';
import { getCompetitionsLookupHandler, getTeamsLookupHandler } from '../../controllers/admin/matches.controller.js';

const router = Router();

router.get('/', validate(getAllMatchesSchema), paginate(), getAllMatchesHandler);
router.get('/competitions/lookup', getCompetitionsLookupHandler);
router.get('/teams/lookup', getTeamsLookupHandler);
router.get('/:id', validate(getMatchDetailSchema), getMatchDetailHandler);
router.patch('/:id', validate(updateMatchSchema), updateMatchHandler);
router.post('/:id/evaluate', validate(getMatchDetailSchema), evaluateMatchHandler);
router.post('/:id/revert-evaluation', validate(getMatchDetailSchema), revertMatchEvaluationHandler);
router.post('/:id/recalculate', validate(getMatchDetailSchema), recalculateMatchHandler);

export default router;
