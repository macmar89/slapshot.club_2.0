import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  RegisterHandlerSchema,
  VerifyEmailHandlerSchema,
  ResendVerificationHandlerSchema,
} from '../shared/constants/schema/auth.schema.js';

const router = Router();

router.get('/check-availability', authController.checkAvailabilityHandler);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.getMe);
router.post('/refresh', authController.refreshTokenHandler);
router.post('/register', validate(RegisterHandlerSchema), authController.registerHandler);
router.post('/verify-email', validate(VerifyEmailHandlerSchema), authController.verifyEmailHandler);
router.post(
  '/resend-verification',
  validate(ResendVerificationHandlerSchema),
  authController.resendVerificationHandler,
);

export default router;
