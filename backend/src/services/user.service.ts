import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';

export const updateUserPreferredLanguage = async (
  userId: string,
  preferredLanguage: 'sk' | 'en' | 'cs',
) => {
  await db.update(users).set({ preferredLanguage }).where(eq(users.id, userId));
};
