import { announcementsRepository } from '../../repositories/announcements.repository.js';

export const getAnnouncements = async (
  limit: number,
  offset: number,
  lang: string,
  sort?: { by: string; order: 'asc' | 'desc' },
  filters?: { isPublished?: boolean | undefined; type?: string | undefined },
) => {
  // Map 'cz' to 'cs' for database
  const dbLang = lang === 'cz' ? 'cs' : lang;

  return await announcementsRepository.getAllAnnouncements(
    limit,
    offset,
    dbLang,
    sort || { by: 'publishedAt', order: 'desc' },
    (filters || {}) as any,
  );
};

export const getAnnouncementBySlug = async (slug: string) => {
  return await announcementsRepository.getAnnouncementBySlug(slug);
};

export const getPublicAnnouncementDetail = async (slug: string, lang: string) => {
  const announcement = await announcementsRepository.getAnnouncementBySlug(slug);

  if (!announcement || !announcement.isPublished) {
    return null;
  }

  // Map 'cz' to 'cs' for database
  const dbLang = lang === 'cz' ? 'cs' : lang;
  const localeContent = announcement.locales[dbLang] || announcement.locales.sk;

  return {
    id: announcement.id,
    slug: announcement.slug,
    type: announcement.type,
    publishedAt: announcement.publishedAt,
    isPinned: announcement.isPinned,
    title: localeContent?.title,
    excerpt: localeContent?.excerpt,
    content: localeContent?.content,
  };
};
