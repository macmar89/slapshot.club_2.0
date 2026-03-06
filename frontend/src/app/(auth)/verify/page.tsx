import { VerifyView } from '@/features/auth/views/verify-view';

interface VerifyPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token, email } = await searchParams;

  return <VerifyView token={token || ''} initialEmail={email} />;
}
