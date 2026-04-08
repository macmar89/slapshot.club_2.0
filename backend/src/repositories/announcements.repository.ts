import { db } from '../db/index.js';
import { and, eq, sql, asc, desc } from 'drizzle-orm';
import { announcements, announcementsLocales } from '../db/schema/index.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { announcementTypes } from '../shared/constants/schema/admin/announcements.schema.js';
import { ERR } from '../utils/errorMessages.js';
import { logger } from '../utils/logger.js';

export const announcementsRepository = {
  async createAnnouncement(data: {
    slug: string;
    type: (typeof announcementTypes)[number];
    isPublished?: boolean;
    locales: Record<string, { title: string; excerpt: string; content: string }>;
  }) {
    return await db.transaction(async (tx) => {
      const [announcement] = await tx
        .insert(announcements)
        .values({
          slug: data.slug,
          type: data.type,
          isPublished: data.isPublished,
          publishedAt: data.isPublished ? new Date().toISOString() : null,
        })
        .returning();

      if (!announcement) {
        throw new AppError(
          ERR.ADMIN.ANNOUNCEMENT_CREATION_FAILED,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      const localeEntries = Object.entries(data.locales).map(([locale, content]) => {
        const dbLocale = locale === 'cz' ? 'cs' : locale;
        return {
          parentId: announcement.id,
          locale: dbLocale as any,
          title: content.title,
          excerpt: content.excerpt,
          content: content.content,
        };
      });

      await tx.insert(announcementsLocales).values(localeEntries);

      return announcement;
    });
  },
  async getAllAnnouncements(
    limit: number,
    offset: number,
    lang: string,
    sort: { by: string; order: 'asc' | 'desc' },
    filters: { isPublished?: boolean; type?: string },
  ) {
    const whereConditions = [];

    if (filters?.isPublished !== undefined) {
      const isPublished = (filters.isPublished as any) === 'true' || filters.isPublished === true;
      logger.info({ isPublished }, 'isPublished');
      whereConditions.push(eq(announcements.isPublished, isPublished));
    }
    if (filters?.type) {
      whereConditions.push(eq(announcements.type, filters.type as any));
    }

    const sortOrderFn = sort?.order === 'asc' ? asc : desc;
    const orderByParams = [];

    if (sort?.by === 'publishedAt') {
      orderByParams.push(sortOrderFn(announcements.publishedAt));
    } else if (sort?.by === 'type') {
      orderByParams.push(sortOrderFn(announcements.type));
    } else {
      orderByParams.push(sortOrderFn(announcements.createdAt));
    }

    const data = await db
      .select({
        id: announcements.id,
        slug: announcements.slug,
        isPublished: announcements.isPublished,
        publishedAt: announcements.publishedAt,
        type: announcements.type,
        createdAt: announcements.createdAt,
        title: announcementsLocales.title,
      })
      .from(announcements)
      .leftJoin(
        announcementsLocales,
        and(
          eq(announcements.id, announcementsLocales.parentId),
          eq(announcementsLocales.locale, lang as any),
        ),
      )
      .where(and(...whereConditions))
      .limit(limit)
      .offset(offset)
      .orderBy(...orderByParams);

    const [totalCountQuery] = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements)
      .where(and(...whereConditions));

    return {
      announcements: data,
      totalCount: Number(totalCountQuery?.count ?? 0),
    };
  },

  async getAnnouncementBySlug(slug: string) {
    const [announcement] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.slug, slug))
      .limit(1);

    if (!announcement) {
      throw new AppError(ERR.ADMIN.ANNOUNCEMENT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const locales = await db
      .select()
      .from(announcementsLocales)
      .where(eq(announcementsLocales.parentId, announcement.id));

    // Map locales back to the format the frontend expects (sk, cz, en)
    const localesMap: any = {};
    locales.forEach((l) => {
      const localeKey = l.locale === 'cs' ? 'cz' : l.locale;
      localesMap[localeKey] = {
        title: l.title,
        excerpt: l.excerpt,
        content: l.content,
      };
    });

    return {
      ...announcement,
      locales: localesMap,
    };
  },

  async updateAnnouncement(
    slug: string,
    data: {
      slug: string;
      type: string;
      isPublished: boolean;
      locales: Record<string, { title: string; excerpt: string; content: string }>;
    },
  ) {
    return await db.transaction(async (tx) => {
      const [announcement] = await tx
        .update(announcements)
        .set({
          slug: data.slug,
          type: data.type as any,
          isPublished: data.isPublished,
          publishedAt: data.isPublished ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(announcements.slug, slug))
        .returning();

      if (!announcement) {
        throw new AppError(ERR.ADMIN.ANNOUNCEMENT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
      }

      for (const [locale, content] of Object.entries(data.locales)) {
        const dbLocale = locale === 'cz' ? 'cs' : locale;
        await tx
          .update(announcementsLocales)
          .set({
            title: content.title,
            excerpt: content.excerpt,
            content: content.content,
          })
          .where(
            and(
              eq(announcementsLocales.parentId, announcement.id),
              eq(announcementsLocales.locale, dbLocale as any),
            ),
          );
      }

      return announcement;
    });
  },
  async deleteAnnouncement(slug: string) {
    return await db.transaction(async (tx) => {
      const [announcement] = await tx
        .delete(announcements)
        .where(eq(announcements.slug, slug))
        .returning();

      if (!announcement) {
        throw new AppError(ERR.ADMIN.ANNOUNCEMENT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
      }

      return announcement;
    });
  },
};
