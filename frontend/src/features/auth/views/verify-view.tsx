'use client';

import { useEffect, useState, useRef } from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { handlePostVerify, handlePostResendVerification } from '@/features/auth/auth.api';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Loader2, CheckCircle2, XCircle, Send } from 'lucide-react';
import { Turnstile } from '@/components/common/turnstile';

import { useAuthStore } from '@/store/use-auth-store';

interface VerifyViewProps {
  token: string;
  initialEmail?: string;
}

export const VerifyView = ({ token, initialEmail }: VerifyViewProps) => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendDone, setResendDone] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [email] = useState<string | null>(initialEmail || null);
  const hasStartedVerification = useRef(false);

  useEffect(() => {
    const performVerification = async () => {
      if (hasStartedVerification.current) return;
      hasStartedVerification.current = true;

      try {
        const res = await handlePostVerify(token);

        if (res.success && res.data?.user) {
          setUser(res.data.user);
          setStatus('success');
        } else {
          console.error('Verification failed:', res.message);
          setStatus('error');
        }
      } catch (err) {
        console.error('Unexpected verification error:', err);
        setStatus('error');
      }
    };

    if (token) {
      performVerification();
    } else {
      setStatus('error');
    }
  }, [token, setUser]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const res = await handlePostResendVerification({ email, turnstileToken });
      if (res.success) {
        setResendDone(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-black p-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-20">
        <div className="bg-gold animate-pulse-slow absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-50 blur-[160px] filter" />
        <div className="bg-gold-dark animate-pulse-slow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-30 blur-[160px] filter delay-700" />
      </div>

      <IceGlassCard className="z-10 w-full max-w-md p-2 sm:p-4" backdropBlur="xl">
        <div className="relative z-10 flex w-full flex-col items-center rounded-2xl border border-white/5 bg-white/5 p-8 text-center shadow-inner sm:p-12">
          <div className="w-full space-y-6">
            <h1 className="text-3xl leading-tight font-black tracking-tighter text-white uppercase italic">
              {t('verify_title')}
            </h1>

            <div className="flex flex-col items-center gap-4 py-4">
              {status === 'loading' && (
                <>
                  <Loader2 className="text-gold h-16 w-16 animate-spin" />
                  <p className="animate-pulse font-medium text-white/60">{t('verifying_roster')}</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <p className="font-medium text-white/80">{t('verify_success')}</p>
                  <Button
                    color="gold"
                    className="mt-4 w-full"
                    onClick={() => router.push('/arena')}
                  >
                    {t('enter_arena')}
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                    <XCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <p className="font-medium text-white/80">{t('verify_error')}</p>

                  {resendDone ? (
                    <div className="bg-gold/10 border-gold/20 text-gold rounded-app animate-in fade-in slide-in-from-bottom-2 w-full border px-4 py-2 text-sm font-medium">
                      {t('verification_sent')}
                    </div>
                  ) : email ? (
                    <>
                      <Turnstile
                        onSuccess={setTurnstileToken}
                        onError={() => console.error('Turnstile error')}
                        onExpire={() => setTurnstileToken('')}
                      />
                      <Button
                        color="gold"
                        variant="ghost"
                        className="border-gold/20 hover:bg-gold/10 w-full border"
                        onClick={handleResend}
                        disabled={isResending}
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('resending')}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t('resend_verification')}
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      color="gold"
                      variant="ghost"
                      className="border-gold/20 hover:bg-gold/10 w-full border"
                      onClick={() => router.push('/register')}
                    >
                      {t('register')}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full border border-white/10 text-white hover:bg-white/5"
                    onClick={() => router.push('/')}
                  >
                    {t('back_to_login')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </IceGlassCard>
    </div>
  );
};
