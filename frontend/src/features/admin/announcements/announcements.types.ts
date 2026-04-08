export const announcementTypes = [
  'FEATURE',
  'LEAGUE',
  'IMPORTANT',
  'MAINTENANCE',
  'EVENT',
  'BUGFIX',
  'GENERAL',
] as const;

export type AnnouncementType = (typeof announcementTypes)[number];

export interface AnnouncementLocaleContent {
  title: string;
  excerpt: string;
  content: string;
}

export interface AnnouncementFormValues {
  slug: string;
  type: AnnouncementType;
  locales: {
    sk: AnnouncementLocaleContent;
    cz: AnnouncementLocaleContent;
    en: AnnouncementLocaleContent;
  };
  isPublished?: boolean;
  publishedAt?: string | null;
}

export interface AdminAnnouncementDto {
  id: string;
  slug: string;
  title: string;
  type: AnnouncementType;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface AnnouncementsListResponse {
  data: AdminAnnouncementDto[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}
