import { Router } from 'express';
import * as announcementsController from '../controllers/announcements.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getAllAnnouncementsSchema,
  getAnnouncementBySlugSchema,
} from '../shared/constants/schema/admin/announcements.schema.js';
import { paginate } from '../middlewares/pagination.middleware.js';

const router = Router();

router.get(
  '/',
  validate(getAllAnnouncementsSchema),
  paginate(),
  announcementsController.getAnnouncementsHandler,
);
router.get(
  '/:slug',
  validate(getAnnouncementBySlugSchema),
  announcementsController.getAnnouncementBySlugHandler,
);

export default router;
