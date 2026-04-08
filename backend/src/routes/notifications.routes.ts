import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getNotificationsSchema,
  markAsReadSchema,
  getUnreadCountSchema,
  markAnnouncementAsReadSchema,
} from '../shared/constants/schema/notifications.schema.js';
import { IS_DEVELOPMENT } from '../config/env.js';

const router = Router();

router.get('/stream', notificationsController.getNotificationsStreamHandler);
router.get('/', validate(getNotificationsSchema), notificationsController.getNotificationsHandler);
router.patch('/read/all', notificationsController.markAllAsReadHandler);
router.patch('/read/:id', validate(markAsReadSchema), notificationsController.markAsReadHandler);
router.patch(
  '/read/announcement/:slug',
  validate(markAnnouncementAsReadSchema),
  notificationsController.markAnnouncementReadHandler,
);
router.get(
  '/unread-count',
  validate(getUnreadCountSchema),
  notificationsController.getUnreadNotificationsCountHandler,
);

if (IS_DEVELOPMENT) {
  router.post('/', notificationsController.createNotificationHandler);
}

export default router;
