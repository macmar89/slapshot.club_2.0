import { Router } from 'express';
import { createAnnouncementHandler } from '../../controllers/admin/announcements.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createAnnouncementSchema } from '../../shared/constants/schema/admin/announcements.schema.js';

const router = Router();

router.post('/', validate(createAnnouncementSchema), createAnnouncementHandler);

export default router;
