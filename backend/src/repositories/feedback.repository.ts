import { db } from '../db/index.js';
import { and, eq, gte, lte, sql, desc } from 'drizzle-orm';
import { feedback } from '../db/schema/index.js';
import { users } from '../db/schema/users.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { ERR } from '../utils/errorMessages.js';

export type FeedbackStatus = 'new' | 'in-progress' | 'resolved' | 'ignored';

export type FeedbackFilters = {
  status?: FeedbackStatus;
  read?: boolean;
  dateFrom?: string;
  dateTo?: string;
};

export const feedbackRepository = {
  async listFeedback(limit: number, offset: number, filters: FeedbackFilters = {}) {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(feedback.status, filters.status));
    }

    if (filters.read !== undefined) {
      const readVal =
        (filters.read as unknown) === 'true'
          ? true
          : (filters.read as unknown) === 'false'
            ? false
            : filters.read;
      conditions.push(eq(feedback.read, readVal as boolean));
    }

    if (filters.dateFrom) {
      conditions.push(gte(feedback.createdAt, filters.dateFrom));
    }

    if (filters.dateTo) {
      // include the full end day
      const endOfDay = filters.dateTo.endsWith('T23:59:59')
        ? filters.dateTo
        : `${filters.dateTo.slice(0, 10)}T23:59:59`;
      conditions.push(lte(feedback.createdAt, endOfDay));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: feedback.id,
        type: feedback.type,
        message: feedback.message,
        pageUrl: feedback.pageUrl,
        read: feedback.read,
        status: feedback.status,
        createdAt: feedback.createdAt,
        userId: feedback.userId,
        username: users.username,
        userEmail: users.email,
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.userId, users.id))
      .where(whereClause)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedback)
      .where(whereClause);

    return {
      data,
      totalCount: Number(countResult?.count ?? 0),
    };
  },

  async getFeedbackById(id: string) {
    const [item] = await db
      .select({
        id: feedback.id,
        type: feedback.type,
        message: feedback.message,
        pageUrl: feedback.pageUrl,
        read: feedback.read,
        status: feedback.status,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        userId: feedback.userId,
        username: users.username,
        userEmail: users.email,
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.userId, users.id))
      .where(eq(feedback.id, id))
      .limit(1);

    if (!item) {
      throw new AppError(ERR.ADMIN.FEEDBACK_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return item;
  },

  async markAsRead(id: string) {
    await db
      .update(feedback)
      .set({ read: true, updatedAt: new Date().toISOString() })
      .where(eq(feedback.id, id));
  },

  async updateStatus(id: string, status: FeedbackStatus) {
    const [updated] = await db
      .update(feedback)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(feedback.id, id))
      .returning();

    if (!updated) {
      throw new AppError(ERR.ADMIN.FEEDBACK_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return updated;
  },
};
