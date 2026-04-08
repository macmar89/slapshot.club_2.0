import { Router } from 'express';
import {
  createAnnouncementHandler,
  getAllAnnouncementsHandler,
  getAnnouncementBySlugHandler,
  updateAnnouncementHandler,
  deleteAnnouncementHandler,
} from '../../controllers/admin/announcements.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAnnouncementSchema,
  getAllAnnouncementsAsAdminSchema,
  getAnnouncementBySlugSchema,
  updateAnnouncementSchema,
} from '../../shared/constants/schema/admin/announcements.schema.js';
import { paginate } from '../../middlewares/pagination.middleware.js';

const router = Router();

router.get('/', validate(getAllAnnouncementsAsAdminSchema), paginate(), getAllAnnouncementsHandler);
router.post('/', validate(createAnnouncementSchema), createAnnouncementHandler);
router.get('/:slug', validate(getAnnouncementBySlugSchema), getAnnouncementBySlugHandler);
router.patch('/:slug', validate(updateAnnouncementSchema), updateAnnouncementHandler);
router.delete('/:slug', validate(getAnnouncementBySlugSchema), deleteAnnouncementHandler);

export default router;
