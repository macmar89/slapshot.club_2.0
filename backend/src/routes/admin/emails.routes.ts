import { Router } from 'express';
import { sendSeasonStartEmailsHandler } from '../../controllers/admin/emails.controller.js';

const router = Router();

router.post('/season-start', sendSeasonStartEmailsHandler);

export default router;
