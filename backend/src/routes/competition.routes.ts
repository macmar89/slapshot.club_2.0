import { Router } from 'express';
import * as competitionController from '../controllers/competition.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { joinCompetitionSchema } from '../shared/constants/schema/competitions.schema.js';

const router = Router();

router.get('/', competitionController.getCompetitionsHandler);
router.post('/join', validate(joinCompetitionSchema), competitionController.joinCompetitionHandler);

export default router;
