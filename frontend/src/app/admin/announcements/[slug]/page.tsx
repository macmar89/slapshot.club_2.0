'use client';

import { use } from 'react';
import { AdminAnnouncementDetailView } from '@/features/admin/announcements/views/admin-announcement-detail-view';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdminAnnouncementDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  
  return <AdminAnnouncementDetailView slug={slug} />;
}
