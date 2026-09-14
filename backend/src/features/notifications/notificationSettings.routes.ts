import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import * as notificationSettingsController from './notificationSettings.controller.js';
import { updateNotificationSettingsHandlerSchema } from './notificationSettings.schema.js';

const notificationSettingsRouter = Router();

notificationSettingsRouter.get('/', notificationSettingsController.getNotificationSettingsHandler);

notificationSettingsRouter.patch(
  '/',
  validate(updateNotificationSettingsHandlerSchema),
  notificationSettingsController.updateNotificationSettingsHandler,
);

export { notificationSettingsRouter };
