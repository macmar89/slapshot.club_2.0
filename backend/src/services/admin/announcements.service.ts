import { announcementsRepository } from '../../repositories/announcements.repository.js';
import { logActivity, type AuditCtx } from '../audit.service.js';
import {
  getAnnouncements as coreGetAnnouncements,
  getAnnouncementBySlug as coreGetAnnouncementBySlug,
} from '../announcements/announcements.service.js';
import type {
  CreateAnnouncementBodyInput,
  UpdateAnnouncementBodyInput,
} from '../../shared/constants/schema/admin/announcements.schema.js';
import { AppError } from '../../utils/appError.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { logger } from '../../utils/logger.js';
import { ERR } from '../../utils/errorMessages.js';
import { scheduleAnnouncementNotification } from '../../queues/notifications.queue.js';

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
    isPinned: input.isPinned,
    locales: mappedLocales,
  });

  if (!announcement) {
    throw new AppError(
      ERR.ADMIN.ANNOUNCEMENT_CREATION_FAILED,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  await logActivity(
    auditCtx,
    'ANNOUNCEMENT_CREATE',
    { type: 'announcement', id: announcement.id },
    { slug: announcement.slug },
  ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_CREATE'));

  if (announcement.isPublished) {
    await logActivity(
      auditCtx,
      'ANNOUNCEMENT_PUBLISH',
      { type: 'announcement', id: announcement.id },
      { slug: announcement.slug },
    ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_PUBLISH'));

    await scheduleAnnouncementNotification({
      announcementSlug: announcement.slug,
      announcementType: announcement.type,
    }).catch((err) => logger.error({ err }, 'Failed to schedule announcement notification'));
  }

  return announcement;
};

export const getAllAnnouncements = coreGetAnnouncements;
export const getAnnouncementBySlug = coreGetAnnouncementBySlug;

export const updateAnnouncement = async (
  slug: string,
  input: UpdateAnnouncementBodyInput,
  auditCtx: AuditCtx,
) => {
  const mappedLocales: Record<string, { title: string; excerpt: string; content: string }> = {
    sk: input.locales.sk,
    cs: input.locales.cz,
    en: input.locales.en,
  };

  const oldAnnouncement = await announcementsRepository
    .getAnnouncementBySlug(slug)
    .catch(() => null);

  const announcement = await announcementsRepository.updateAnnouncement(slug, {
    slug: input.slug,
    type: input.type,
    isPublished: input.isPublished,
    isPinned: input.isPinned,
    locales: mappedLocales,
  });

  await logActivity(
    auditCtx,
    'ANNOUNCEMENT_UPDATE',
    { type: 'announcement', id: announcement.id },
    { slug: announcement.slug, oldSlug: slug },
  ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_UPDATE'));

  const wasPublished = oldAnnouncement?.isPublished ?? false;
  const isPublished = announcement.isPublished;

  if (!wasPublished && isPublished) {
    await logActivity(
      auditCtx,
      'ANNOUNCEMENT_PUBLISH',
      { type: 'announcement', id: announcement.id },
      { slug: announcement.slug },
    ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_PUBLISH'));

    await scheduleAnnouncementNotification({
      announcementSlug: announcement.slug,
      announcementType: announcement.type,
    }).catch((err) => logger.error({ err }, 'Failed to schedule announcement notification'));
  }

  return announcement;
};

export const deleteAnnouncement = async (slug: string, auditCtx: AuditCtx) => {
  const announcement = await announcementsRepository.deleteAnnouncement(slug);

  await logActivity(
    auditCtx,
    'ANNOUNCEMENT_DELETE',
    { type: 'announcement', id: announcement.id },
    { slug: announcement.slug },
  ).catch((err) => logger.error({ err }, 'Failed to log ANNOUNCEMENT_DELETE'));

  return announcement;
};
