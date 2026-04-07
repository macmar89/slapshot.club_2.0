import { db } from '../db/index.js';
import { announcements, announcementsLocales } from '../db/schema/index.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { announcementTypes } from '../shared/constants/schema/admin/announcements.schema.js';
import { ERR } from '../utils/errorMessages.js';

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

      const localeEntries = Object.entries(data.locales).map(([locale, content]) => ({
        parentId: announcement.id,
        locale: locale as any,
        title: content.title,
        excerpt: content.excerpt,
        content: content.content,
      }));

      await tx.insert(announcementsLocales).values(localeEntries);

      return announcement;
    });
  },
};
