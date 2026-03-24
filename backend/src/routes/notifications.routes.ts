import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getNotificationsSchema,
  markAsReadSchema,
} from '../shared/constants/schema/notifications.schema.js';
import { IS_DEVELOPMENT } from '../config/env.js';

const router = Router();

router.get('/', validate(getNotificationsSchema), notificationsController.getNotificationsHandler);
router.patch('/read/all', notificationsController.markAllAsReadHandler);
router.patch('/read/:id', validate(markAsReadSchema), notificationsController.markAsReadHandler);
router.get('/unread-count', notificationsController.getUnreadNotificationsCountHandler);

if (IS_DEVELOPMENT) {
  router.post('/', notificationsController.createNotificationHandler);
}

export default router;
