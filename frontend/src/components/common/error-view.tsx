'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AlertTriangle, ArrowLeft, ShieldAlert, Hammer, RefreshCcw } from 'lucide-react';
import { useAppParams } from '@/hooks/use-app-params';

interface ErrorViewProps {
  status?: number;
  onRetry?: () => void;
}

export const ErrorView = ({ status, onRetry }: ErrorViewProps) => {
  const t = useTranslations('Errors');
  const router = useRouter();
  const { slug } = useAppParams(['slug']);

  const getErrorContent = () => {
    switch (status) {
      case 403:
        return {
          key: '403',
          icon: <ShieldAlert className="text-warning h-8 w-8 animate-pulse" />,
          buttonIcon: <ArrowLeft className="h-4 w-4" />,
          action: () => router.push(`/${slug}/arena`),
        };
      case 404:
        return {
          key: '404',
          icon: <AlertTriangle className="text-warning h-8 w-8 animate-pulse" />,
          buttonIcon: <ArrowLeft className="h-4 w-4" />,
          action: () => router.push(`/${slug}/arena`),
        };
      case 500:
        return {
          key: '500',
          icon: <Hammer className="text-destructive h-8 w-8 animate-bounce" />,
          buttonIcon: <RefreshCcw className="h-4 w-4" />,
          action: onRetry || (() => window.location.reload()),
        };
      default:
        return {
          key: 'generic',
          icon: <AlertTriangle className="text-destructive h-8 w-8 animate-pulse" />,
          buttonIcon: <ArrowLeft className="h-4 w-4" />,
          action: () => router.push('/'),
        };
    }
  };

  const { key, icon, buttonIcon, action } = getErrorContent();

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <IceGlassCard className="flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="from-warning/20 border-warning/30 flex h-16 w-16 items-center justify-center rounded-full border bg-gradient-to-br to-black shadow-[0_0_20px_rgba(250,204,21,0.1)]">
          {icon}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-white uppercase italic md:text-2xl">
            {t(`${key}.title`)}
          </h2>
          <p className="text-sm leading-relaxed font-medium text-white/50">
            {t(`${key}.description`)}
          </p>
        </div>

        <Button
          onClick={action}
          variant="outline"
          className="group hover:bg-warning hover:border-warning mt-2 w-full gap-2 transition-all duration-300 hover:text-black"
        >
          <span className="transition-transform group-hover:-translate-x-1">{buttonIcon}</span>
          {t(`${key}.button`)}
        </Button>
      </IceGlassCard>
    </div>
  );
};
