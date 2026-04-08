import { AnnouncementType } from '../admin/announcements/announcements.types';

export interface PublicAnnouncementDetailDto {
  id: string;
  slug: string;
  type: AnnouncementType;
  publishedAt: string | null;
  title: string;
  excerpt?: string;
  content?: string;
}
