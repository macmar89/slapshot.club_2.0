import { RegisterView } from '@/features/auth/views/register-view';
import { cookies } from 'next/headers';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return <RegisterView referralCode={ref} />;
}
