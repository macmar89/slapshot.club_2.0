import { AdminFeedbackDetailView } from '@/features/admin/feedback/views/admin-feedback-detail-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback Detail | Admin',
};

export default function AdminFeedbackDetailPage() {
  return <AdminFeedbackDetailView />;
}
