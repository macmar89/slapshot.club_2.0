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
}
