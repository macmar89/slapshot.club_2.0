import { Router } from 'express';
import * as matchesController from '../controllers/matches.controller.js';

const router = Router();

router.get('/test-sync', matchesController.testSyncMatchesHandler);

export default router;
