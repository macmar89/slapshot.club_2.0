import { z } from 'zod';

export const feedbackStatuses = ['new', 'in-progress', 'resolved', 'ignored'] as const;
export type FeedbackStatus = (typeof feedbackStatuses)[number];

export const feedbackTypes = [
  'bug',
  'idea',
  'change_user_email_request',
  'custom_country_request',
  'other',
] as const;
export type FeedbackType = (typeof feedbackTypes)[number];

export interface AdminFeedbackDto {
  id: string;
  type: FeedbackType;
  message: string;
  pageUrl: string | null;
  read: boolean;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  username: string | null;
  userEmail: string | null;
}

export interface FeedbackListResponse {
  data: AdminFeedbackDto[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}
