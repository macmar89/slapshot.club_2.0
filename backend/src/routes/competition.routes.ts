import { Router } from 'express';
import * as competitionController from '../controllers/competition.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { joinCompetitionSchema } from '../shared/constants/schema/competitions.schema.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

//  public endpoints
router.get('/public/:slug', competitionController.getPublicCompetitionNameHandler);

//  protected endpoints
router.use(isAuth);
router.get('/', competitionController.getCompetitionsHandler);
router.post('/join', validate(joinCompetitionSchema), competitionController.joinCompetitionHandler);

export default router;
