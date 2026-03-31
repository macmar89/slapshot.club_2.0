import { Router } from 'express';
import { syncStandingsHandler } from '../../controllers/admin/competition.controller';
import { validate } from '../../middleware/validate.middleware';
import { syncStandingsSchema } from '../../shared/constants/schema/competitions.schema';

const router = Router();

router.post('/:competitionId/sync-standings', validate(syncStandingsSchema), syncStandingsHandler);

export default router;
