'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Smartphone } from 'lucide-react';

export const OrientationLock: React.FC = () => {
  const t = useTranslations('PWA.orientation_lock');
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
      setIsMobile(isMobileDevice);
      setIsLandscape(window.innerWidth > window.innerHeight && isMobileDevice);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isLandscape || !isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-xl transition-all duration-300">
      <div className="flex max-w-xs flex-col items-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-800 bg-slate-900 shadow-2xl">
            <Smartphone className="animate-bounce-horizontal h-10 w-10 rotate-90 text-blue-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-space text-2xl font-bold tracking-tight text-white uppercase">
            {t('title')}
          </h2>
          <p className="font-sora text-slate-400">{t('message')}</p>
        </div>

        <div className="flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-medium text-slate-500">
          Slapshot Club 🏒
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-horizontal {
          0%,
          100% {
            transform: rotate(90-deg) translateX(0);
          }
          50% {
            transform: rotate(90-deg) translateX(10px);
          }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
