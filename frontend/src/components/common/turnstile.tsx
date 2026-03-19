'use client';

import React, { useMemo } from 'react';
import { Turnstile as MarsiTurnstile, type TurnstileProps } from '@marsidev/react-turnstile';
import Script from 'next/script';

interface CustomTurnstileProps extends Omit<TurnstileProps, 'siteKey'> {
  siteKey?: string;
}

export const Turnstile: React.FC<CustomTurnstileProps> = ({ siteKey, ...props }) => {
  const { onSuccess } = props;

  const isEnabled = useMemo(() => process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== 'true', []);

  const finalSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  React.useEffect(() => {
    if (!isEnabled && onSuccess) {
      const timer = setTimeout(() => onSuccess('mock-token'), 100);
      return () => clearTimeout(timer);
    }
  }, [isEnabled, onSuccess]);

  if (!isEnabled) return null;

  if (!finalSiteKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined');
    }
    return null;
  }

  return (
    <div className="my-4 flex justify-center">
      <Script src="https://challenges.cloudflare.com/challenges.js" strategy="afterInteractive" />
      <MarsiTurnstile
        siteKey={finalSiteKey}
        {...props}
        options={{
          execution: 'render',
        }}
      />
    </div>
  );
};
