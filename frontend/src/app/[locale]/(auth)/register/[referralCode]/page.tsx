import { RegisterView } from '@/features/auth/views/register-view';

export default async function RegisterReferralPage({
  params,
}: {
  params: Promise<{ referralCode: string }>;
}) {
  const { referralCode } = await params;

  return <RegisterView referralCode={referralCode} />;
}
