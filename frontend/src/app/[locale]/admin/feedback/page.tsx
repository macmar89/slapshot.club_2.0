import { AdminFeedbackView } from '@/features/admin/feedback/views/admin-feedback-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback Management | Admin',
};

export default function AdminFeedbackPage() {
  return <AdminFeedbackView />;
}
