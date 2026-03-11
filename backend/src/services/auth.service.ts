import crypto from 'crypto';
import type { Request } from 'express';
import { db } from '../db/index.js';
import { refreshTokens } from '../db/schema/auth.js';
import { and, eq, sql } from 'drizzle-orm';
import { AppError } from '../utils/appError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import {
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from '../shared/constants/schema/auth.schema.js';
import { AuthErrors } from '../shared/constants/errors/auth.errors.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { activeOnly } from '../db/helpers.js';
import { logActivity } from './audit.service.js';
import { generateRandomToken, verifyPassword } from '../utils/crypto.js';
import { users } from '../db/schema/users.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import type { AvailabilityCheckType } from '../types/global.types.js';
import { hashPassword } from '../utils/crypto.js';
import { generateReferralCode } from '../utils/referralCode.js';
import { getSubscriptionEndDate } from '../utils/date.js';
import { userSettings } from '../db/schema/userSettings.js';
import { subscriptions } from '../db/schema/subscriptions.js';
import { userReferrals } from '../db/schema/userReferrals.js';

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const registerUser = async (data: RegisterInput) => {
  const usernameAvailable = await checkAvailability('username', data.username);
  const emailAvailable = await checkAvailability('email', data.email);

  if (!usernameAvailable) {
    throw new AppError(AuthMessages.ERRORS.USERNAME_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
  }

  if (!emailAvailable) {
    throw new AppError(AuthMessages.ERRORS.EMAIL_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
  }

  return await db.transaction(async (tx) => {
    const hashedPassword = await hashPassword(data.password);

    const defaultPlan: 'free' | 'starter' | 'pro' | 'vip' =
      (process.env.DEFAULT_USER_PLAN as 'free' | 'starter' | 'pro' | 'vip') || 'free';

    const subscriptionEndDate = getSubscriptionEndDate();

    const [user] = await tx
      .insert(users)
      .values({
        username: data.username,
        password: hashedPassword,
        email: data.email,
        role: 'user',
        subscriptionPlan: defaultPlan,
        subscriptionActiveUntil: defaultPlan === 'free' ? null : subscriptionEndDate,
        isActive: true,
        referralCode: generateReferralCode(),
        preferredLanguage: (data.preferredLanguage as 'sk' | 'en' | 'cs') ?? 'sk',
        verificationToken: generateRandomToken(),
      })
      .returning();

    if (!user)
      throw new AppError(AuthErrors.USER_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);

    await tx.insert(subscriptions).values({
      userId: user.id,
      plan: defaultPlan,
      planType: 'seasonal',
      status: 'active',
      activeFrom: new Date().toISOString(),
      activeUntil: subscriptionEndDate,
    });

    await tx.insert(userSettings).values({
      userId: user.id,
      gdprConsent: data.gdprConsent,
      marketingConsent: data.marketingConsent,
      marketingConsentDate: data.marketingConsent ? new Date().toISOString() : null,
    });

    if (data.referralCode) {
      const referrer = await tx.query.users.findFirst({
        columns: {
          id: true,
          totalRegistered: true,
        },
        where: (users, { eq }) => eq(users.referralCode, data.referralCode!),
      });

      if (referrer) {
        await tx
          .update(users)
          .set({
            totalRegistered: (referrer.totalRegistered || 0) + 1,
          })
          .where(eq(users.id, referrer.id));

        await tx.insert(userReferrals).values({
          referrerId: referrer.id,
          referredUserId: user.id,
        });
      }
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionActiveUntil: user.subscriptionActiveUntil,
      isVerified: !!user.verifiedAt,
      referralCode: user.referralCode,
      verificationToken: user.verificationToken,
    };
  });
};

export const loginUser = async (data: LoginInput, req: Request) => {
  const user = await db.query.users.findFirst({
    where: (users, { and, or }) =>
      and(
        or(
          sql`LOWER(${users.email}) = LOWER(${data.identifier})`,
          sql`LOWER(${users.username}) = LOWER(${data.identifier})`,
        ),
        activeOnly(users, eq(users.isActive, true)),
      ),
    columns: {
      id: true,
      username: true,
      email: true,
      role: true,
      password: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
      referralCode: true,
    },
  });

  if (!user) {
    await logActivity(
      req,
      'LOGIN_FAILED',
      { type: 'auth' },
      { attemptedUsername: data.identifier, reason: 'USER_NOT_FOUND' },
    );

    throw new AppError(AuthErrors.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
  }

  const isPasswordValid = await verifyPassword(user.password, data.password);
  if (!isPasswordValid) {
    await logActivity(
      req,
      'LOGIN_FAILED',
      { type: 'auth', id: user?.id },
      { attemptedUsername: data.identifier, reason: 'INVALID_PASSWORD' },
      { userId: user.id },
    );

    throw new AppError(AuthErrors.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
  }

  const { password, verifiedAt, ...userWithoutPassword } = user;

  return {
    user: { ...userWithoutPassword, isVerified: !!verifiedAt },
  };
};

export const rotateRefreshToken = async (tokenString: string) => {
  const hashedToken = hashToken(tokenString);

  const [dbToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, hashedToken));

  if (!dbToken || new Date() > dbToken.expiresAt) {
    throw new AppError(AuthErrors.INVALID_REFRESH_TOKEN, HttpStatusCode.UNAUTHORIZED);
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.id, dbToken.userId), activeOnly(users, eq(users.isActive, true))),
    columns: {
      id: true,
      username: true,
      email: true,
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
      referralCode: true,
    },
  });

  if (!user) throw new AppError(AuthErrors.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);

  const newRefreshTokenString = generateRefreshToken();
  const hashedNewToken = hashToken(newRefreshTokenString);

  await db.transaction(async (tx) => {
    await tx.delete(refreshTokens).where(eq(refreshTokens.id, dbToken.id));

    await tx.insert(refreshTokens).values({
      userId: user.id,
      token: hashedNewToken,
      userAgent: dbToken.userAgent,
      expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MS)),
    });

    await tx
      .update(users)
      .set({ lastActiveAt: new Date().toISOString() })
      .where(eq(users.id, user.id));
  });

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    verifiedAt: !!user.verifiedAt,
  });

  return { accessToken, newRefreshToken: newRefreshTokenString, user };
};

export const createSession = async (userId: string, userAgent: string): Promise<string> => {
  const rawToken = generateRefreshToken();
  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + Number(process.env.COOKIE_REFRESH_MAX_AGE));

  return await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(refreshTokens)
      .values({
        userId,
        token: hashedToken,
        userAgent,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [refreshTokens.userId, refreshTokens.userAgent],
        set: {
          token: hashedToken,
          expiresAt,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    if (!session) {
      throw new AppError(AuthErrors.SESSION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    await tx
      .update(users)
      .set({ lastActiveAt: new Date().toISOString() })
      .where(eq(users.id, userId));

    return rawToken;
  });
};

export const logoutUser = async (rawRefreshToken: string) => {
  const hashedToken = hashToken(rawRefreshToken);

  return await db.transaction(async (tx) => {
    const [deletedToken] = await tx
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, hashedToken))
      .returning({ userId: refreshTokens.userId });

    if (deletedToken) {
      await tx
        .update(users)
        .set({ lastActiveAt: new Date().toISOString() })
        .where(eq(users.id, deletedToken?.userId));
      return deletedToken.userId;
    }

    return null;
  });
};

export const getUserProfile = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.id, userId), activeOnly(users, eq(users.isActive, true))),
    columns: {
      id: true,
      username: true,
      email: true,
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
      referralCode: true,
    },
  });

  if (!user) {
    throw new AppError(AuthErrors.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const { verifiedAt, ...userWithoutVerifiedAt } = user;

  return {
    user: { ...userWithoutVerifiedAt, isVerified: !!verifiedAt },
  };
};

export const checkAvailability = async (type: AvailabilityCheckType, value: string) => {
  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
    },
    where: (users) => sql`LOWER(${users[type]}) = LOWER(${value})`,
  });

  if (existingUser) {
    const errorKey =
      type === 'username'
        ? AuthMessages.ERRORS.USERNAME_ALREADY_EXISTS
        : AuthMessages.ERRORS.EMAIL_ALREADY_EXISTS;
    throw new AppError(errorKey, HttpStatusCode.CONFLICT);
  }
  return true;
};

export const verifyEmail = async (token: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.verificationToken, token),
    columns: {
      id: true,
      username: true,
      email: true,
      verifiedAt: true,
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      referralCode: true,
    },
  });

  if (!user) {
    throw new AppError(AuthMessages.ERRORS.INVALID_TOKEN, HttpStatusCode.BAD_REQUEST);
  }

  if (user.verifiedAt) {
    return user;
  }

  await db
    .update(users)
    .set({
      verifiedAt: new Date().toISOString(),
      verificationToken: null,
    })
    .where(eq(users.id, user.id));

  return user;
};

export const resendVerification = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      id: true,
      username: true,
      email: true,
      verifiedAt: true,
      preferredLanguage: true,
    },
  });

  if (!user) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  if (user.verifiedAt) {
    throw new AppError(AuthMessages.ERRORS.EMAIL_ALREADY_VERIFIED, HttpStatusCode.BAD_REQUEST);
  }

  const newToken = generateRandomToken();

  await db.update(users).set({ verificationToken: newToken }).where(eq(users.id, user.id));

  return {
    username: user.username,
    email: user.email,
    token: newToken,
    preferredLanguage: user.preferredLanguage,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
    columns: {
      id: true,
      username: true,
      email: true,
      preferredLanguage: true,
    },
  });

  if (!user) {
    throw new AppError(AuthMessages.ERRORS.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const token = generateRandomToken();
  const hashedToken = hashToken(token);
  const expiration = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  await db
    .update(users)
    .set({
      resetPasswordToken: hashedToken,
      resetPasswordExpiration: expiration,
    })
    .where(eq(users.id, user.id));

  return {
    token, // We send the raw token to the user via email
    user: {
      username: user.username,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
    },
  };
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const hashedToken = hashToken(data.token);

  const user = await db.query.users.findFirst({
    where: (users, { eq, and, gt }) =>
      and(
        eq(users.resetPasswordToken, hashedToken),
        sql`${users.resetPasswordExpiration} > ${new Date().toISOString()}`,
      ),
    columns: {
      id: true,
      username: true,
      email: true,
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
      referralCode: true,
    },
  });

  if (!user) {
    throw new AppError(AuthMessages.ERRORS.INVALID_TOKEN, HttpStatusCode.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(data.password);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
    })
    .where(eq(users.id, user.id));

  return user;
};
