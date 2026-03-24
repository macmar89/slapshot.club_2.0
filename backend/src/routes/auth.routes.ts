import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  RegisterHandlerSchema,
  VerifyEmailHandlerSchema,
  ResendVerificationHandlerSchema,
  ForgotPasswordHandlerSchema,
  ResetPasswordHandlerSchema,
} from '../shared/constants/schema/auth.schema.js';
import { verifyTurnstile } from '../middleware/turnstile.middleware.js';

const router = Router();

router.get('/check-availability', authController.checkAvailabilityHandler);
router.post('/login', verifyTurnstile, authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.getMe);
router.post('/refresh', authController.refreshTokenHandler);
router.post(
  '/register',
  verifyTurnstile,
  validate(RegisterHandlerSchema),
  authController.registerHandler,
);
router.post(
  '/verify-email',
  validate(VerifyEmailHandlerSchema),
  authController.verifyEmailHandler,
);
router.post(
  '/resend-verification',
  verifyTurnstile,
  validate(ResendVerificationHandlerSchema),
  authController.resendVerificationHandler,
);
router.post(
  '/forgot-password',
  verifyTurnstile,
  validate(ForgotPasswordHandlerSchema),
  authController.forgotPasswordHandler,
);
router.post(
  '/reset-password',
  validate(ResetPasswordHandlerSchema),
  authController.resetPasswordHandler,
);

export default router;
