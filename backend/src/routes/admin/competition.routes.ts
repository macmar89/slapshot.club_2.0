import { Router } from 'express';
import { syncStandingsHandler } from '../../controllers/admin/competition.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { syncStandingsSchema } from '../../shared/constants/schema/competitions.schema.js';

const router = Router();

router.post('/:competitionId/sync-standings', validate(syncStandingsSchema), syncStandingsHandler);

export default router;
