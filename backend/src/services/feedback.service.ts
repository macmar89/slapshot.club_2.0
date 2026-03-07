import { db } from '../db/index.js';
import { feedback } from '../db/schema/feedback.js';

export const createFeedback = async (data: {
  type: 'bug' | 'idea' | 'other';
  message: string;
  userId: string;
  pageUrl?: string | undefined;
}) => {
  const [newFeedback] = await db
    .insert(feedback)
    .values({
      type: data.type,
      message: data.message,
      pageUrl: data.pageUrl,
      userId: data.userId,
    })
    .returning();

  return newFeedback;
};
