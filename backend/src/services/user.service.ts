import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { feedback } from '../db/schema/feedback.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import { verifyPassword, hashPassword } from '../utils/crypto.js';
import { AuthErrors } from '../shared/constants/errors/auth.errors.js';

export const updateUserPreferredLanguage = async (
  userId: string,
  preferredLanguage: 'sk' | 'en' | 'cs',
) => {
  await db.update(users).set({ preferredLanguage }).where(eq(users.id, userId));
};

export const updateUsername = async (userId: string, username: string) => {
  const existingUser = await db.query.users.findFirst({
    where: (users) => sql`LOWER(${users.username}) = LOWER(${username})`,
  });

  if (existingUser && existingUser.id !== userId) {
    throw new AppError(AuthMessages.ERRORS.USERNAME_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
  }

  await db.update(users).set({ username }).where(eq(users.id, userId));
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(AuthErrors.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const isPasswordValid = await verifyPassword(user.password, oldPassword);

  if (!isPasswordValid) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};

export const requestEmailChange = async (userId: string, message: string) => {
  await db.insert(feedback).values({
    userId,
    type: 'change_user_email_request',
    message,
    status: 'new',
  });
};
