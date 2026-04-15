import { feedbackRepository, type FeedbackStatus, type FeedbackFilters } from '../../repositories/feedback.repository.js';

export const listFeedback = async (
  limit: number,
  offset: number,
  filters: FeedbackFilters = {},
) => {
  return feedbackRepository.listFeedback(limit, offset, filters);
};

export const getFeedback = async (id: string) => {
  return feedbackRepository.getFeedbackById(id);
};

export const getFeedbackAndMarkRead = async (id: string) => {
  const item = await feedbackRepository.getFeedbackById(id);
  if (!item.read) {
    await feedbackRepository.markAsRead(id);
  }
  return { ...item, read: true };
};

export const updateFeedbackStatus = async (id: string, status: FeedbackStatus) => {
  return feedbackRepository.updateStatus(id, status);
};

export const getUnreadCount = async () => {
  return feedbackRepository.getUnreadCount();
};
