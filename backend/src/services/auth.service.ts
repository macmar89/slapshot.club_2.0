import crypto from 'crypto';
import type { Request } from 'express';
import { db } from '../db/index.js';
import { refreshTokens } from '../db/schema/auth.js';
import { and, eq, sql } from 'drizzle-orm';
import { AppError } from '../utils/appError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { type LoginInput, type RegisterInput } from '../shared/constants/schema/auth.schema.js';
import { AuthErrors } from '../shared/constants/errors/auth.errors.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { activeOnly } from '../db/helpers.js';
import { logActivity } from './audit.service.js';
import { generateRandomToken, verifyPassword } from '../utils/crypto.js';
import { users } from '../db/schema/users.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import type { AvailabilityCheckType } from '../types/global.js';
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
    throw new AppError(AuthMessages.ERRORS.USERNAME_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }

  if (!emailAvailable) {
    throw new AppError(AuthMessages.ERRORS.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
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
        preferredLanguage: (data.preferredLanguage as 'sk' | 'en' | 'cz') ?? 'sk',
        verificationToken: generateRandomToken(),
      })
      .returning();

    if (!user)
      throw new AppError(AuthErrors.USER_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);

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

    throw new AppError(AuthErrors.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
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

    throw new AppError(AuthErrors.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
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
    throw new AppError(AuthErrors.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(eq(users.id, dbToken.userId), activeOnly(users, eq(users.isActive, true))),
    columns: {
      id: true,
      username: true,
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
    },
  });

  if (!user) throw new AppError(AuthErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

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
      throw new AppError(AuthErrors.SESSION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
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
      role: true,
      subscriptionPlan: true,
      subscriptionActiveUntil: true,
      verifiedAt: true,
      referralCode: true,
    },
  });

  if (!user) {
    throw new AppError(AuthErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
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
    throw new AppError(errorKey, HttpStatus.CONFLICT);
  }
  return true;
};
