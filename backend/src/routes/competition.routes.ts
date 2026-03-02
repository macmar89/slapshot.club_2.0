import { Router } from 'express';
import * as competitionController from '../controllers/competition.controller.js';

const router = Router();

router.get('/', competitionController.getCompetitions);

export default router;
