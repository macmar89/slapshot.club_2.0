import { announcementsRepository } from '../../repositories/announcements.repository.js';
import { logActivity, type AuditCtx } from '../audit.service.js';
import type { CreateAnnouncementBodyInput } from '../../shared/constants/schema/admin/announcements.schema.js';
import { AppError } from '../../utils/appError.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { logger } from '../../utils/logger.js';
import { ERR } from '../../utils/errorMessages.js';

export const createAnnouncement = async (
  input: CreateAnnouncementBodyInput,
  auditCtx: AuditCtx,
) => {
  // Map 'cz' to 'cs' for database
  const mappedLocales: Record<string, { title: string; excerpt: string; content: string }> = {
    sk: input.locales.sk,
    cs: input.locales.cz,
    en: input.locales.en,
  };

  const announcement = await announcementsRepository.createAnnouncement({
    slug: input.slug,
    type: input.type,
    isPublished: input.isPublished,
    locales: mappedLocales,
  });

  if (!announcement) {
    throw new AppError(ERR.ADMIN.ANNOUNCEMENT_CREATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }

  await logActivity(
    auditCtx,
    'ANNOUNCEMENT_CREATE',
    { type: 'announcement', id: announcement.id },
    { slug: announcement.slug },
  ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_CREATE'));

  return announcement;
};
