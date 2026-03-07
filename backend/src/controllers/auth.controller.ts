import { catchAsync } from '../utils/catchAsync.js';
import { type Request, type Response } from 'express';
import { AppError } from '../utils/appError.js';
import {
  createSession,
  logoutUser,
  loginUser,
  rotateRefreshToken,
  getUserProfile,
  checkAvailability,
  registerUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from '../services/auth.service.js';
import { AuthErrors } from '../shared/constants/errors/auth.errors.js';
import {
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from '../shared/constants/schema/auth.schema.js';
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_CLEAR_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from '../utils/cookie.util.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { generateAccessToken } from '../utils/jwt.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import { logActivity } from '../services/audit.service.js';
import type { AvailabilityCheckType } from '../types/global.js';
import { emailQueue } from '../queues/email.queue.js';

export const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData = LoginSchema.parse(req.body);

  const { user } = await loginUser(validatedData, req);

  const userAgent = req.headers['user-agent'] || 'unknown';
  const refreshToken = await createSession(user.id, userAgent);

  if (!refreshToken) {
    throw new AppError(AuthErrors.SESSION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    verifiedAt: !!user.isVerified,
  });

  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

  res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  await logActivity(
    req,
    'LOGIN_SUCCESS',
    { type: 'auth', id: user.id },
    { method: 'password' },
    { userId: user.id },
  );

  res.status(HttpStatus.CREATED).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const refreshTokenHandler = catchAsync(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refresh_token;

  if (!oldRefreshToken) {
    throw new AppError(AuthErrors.MISSING_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  const { accessToken, newRefreshToken, user } = await rotateRefreshToken(oldRefreshToken);

  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

  res.cookie('refresh_token', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    const userId = await logoutUser(refreshToken);

    if (userId) {
      await logActivity(req, 'LOGOUT', { type: 'auth', id: userId }, null, { userId });
    }
  }

  res.clearCookie('access_token', CLEAR_COOKIE_OPTIONS);

  res.clearCookie('refresh_token', REFRESH_TOKEN_CLEAR_OPTIONS);

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.LOGOUT_SUCCESS,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const { user } = await getUserProfile(req.user!.id);

  res.status(HttpStatus.OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const registerHandler = catchAsync(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  const userAgent = req.headers['user-agent'] || 'unknown';
  const refreshToken = await createSession(user.id, userAgent);

  if (!refreshToken) {
    throw new AppError(AuthErrors.SESSION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    verifiedAt: !!user.isVerified,
  });

  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

  res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  await logActivity(
    req,
    'REGISTER_SUCCESS',
    { type: 'auth', id: user.id },
    { method: 'password' },
    { userId: user.id },
  );

  const locale = req.cookies.NEXT_LOCALE || req.body.preferredLanguage || 'sk';

  await emailQueue.add('verification-email', {
    type: 'verification-email',
    data: {
      user: {
        username: user.username,
        email: user.email,
        preferredLanguage: req.body.preferredLanguage,
      },
      token: user.verificationToken,
      locale,
    },
  });

  res.status(HttpStatus.CREATED).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionActiveUntil: user.subscriptionActiveUntil,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
      },
    },
  });
});

export const checkAvailabilityHandler = catchAsync(async (req: Request, res: Response) => {
  const { type, value } = req.query;

  const isAvailable = await checkAvailability(type as AvailabilityCheckType, value as string);

  res.status(HttpStatus.OK).json({
    status: 'success',
    data: {
      available: isAvailable,
    },
  });
});

export const verifyEmailHandler = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  const user = await verifyEmail(token);

  const userAgent = req.headers['user-agent'] || 'unknown';
  const refreshToken = await createSession(user.id, userAgent);

  if (!refreshToken) {
    throw new AppError(AuthErrors.SESSION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    verifiedAt: !!user.verifiedAt,
  });

  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  await logActivity(
    req,
    'EMAIL_VERIFIED',
    { type: 'auth', id: user.id },
    { method: 'token' },
    { userId: user.id },
  );

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.VERIFY_SUCCESS,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        isVerified: true,
      },
    },
  });
});

export const resendVerificationHandler = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const { username, email: userEmail, token, preferredLanguage } = await resendVerification(email);

  const locale = req.cookies.NEXT_LOCALE || preferredLanguage || 'sk';

  await emailQueue.add('verification-email', {
    type: 'verification-email',
    data: {
      user: {
        username,
        email: userEmail,
        preferredLanguage,
      },
      token,
      locale,
    },
  });

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.VERIFICATION_SENT,
  });
});

export const forgotPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const { email } = ForgotPasswordSchema.parse(req.body);

  const { token, user } = await forgotPassword(email);

  const locale = req.cookies.NEXT_LOCALE || user.preferredLanguage || 'sk';

  await emailQueue.add('forgot-password-email', {
    type: 'forgot-password-email',
    data: {
      user: {
        username: user.username,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
      },
      token,
      locale,
    },
  });

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.FORGOT_PASSWORD_SUCCESS,
  });
});

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const validatedData = ResetPasswordSchema.parse(req.body);

  const user = await resetPassword(validatedData);

  const userAgent = req.headers['user-agent'] || 'unknown';
  const refreshToken = await createSession(user.id, userAgent);

  if (!refreshToken) {
    throw new AppError(AuthErrors.SESSION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    verifiedAt: !!user.verifiedAt,
  });

  res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  await logActivity(
    req,
    'PASSWORD_CHANGE',
    { type: 'auth', id: user.id },
    { method: 'token' },
    { userId: user.id },
  );

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.RESET_PASSWORD_SUCCESS,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        isVerified: !!user.verifiedAt,
      },
    },
  });
});
