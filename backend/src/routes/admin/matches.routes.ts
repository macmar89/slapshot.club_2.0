import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { getAllMatchesSchema } from '../../shared/constants/schema/admin/matches.schema.js';
import { getAllMatchesHandler } from '../../controllers/admin/matches.controller.js';
import { paginate } from '../../middlewares/pagination.middleware.js';
import { getCompetitionsLookupHandler, getTeamsLookupHandler } from '../../controllers/admin/matches.controller.js';

const router = Router();

router.get('/', validate(getAllMatchesSchema), paginate(), getAllMatchesHandler);
router.get('/competitions/lookup', getCompetitionsLookupHandler);
router.get('/teams/lookup', getTeamsLookupHandler);

export default router;
