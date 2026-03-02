'use client';

import React from 'react';
import { Turnstile as MarsiTurnstile, type TurnstileProps } from '@marsidev/react-turnstile';

interface CustomTurnstileProps extends Omit<TurnstileProps, 'siteKey'> {
  siteKey?: string;
}

export const Turnstile: React.FC<CustomTurnstileProps> = ({ siteKey, ...props }) => {
  const { onSuccess } = props;
  const isEnabled =
    process.env.NEXT_PUBLIC_ENABLE_TURNSTILE !== 'false' &&
    process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== 'true';

  React.useEffect(() => {
    if (!isEnabled && onSuccess) {
      onSuccess('mock-token');
    }
  }, [isEnabled, onSuccess]);

  if (!isEnabled) {
    return null;
  }

  const finalSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!finalSiteKey) {
    console.warn('Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined');
    return null;
  }

  return (
    <div className="my-4 flex justify-center">
      <MarsiTurnstile siteKey={finalSiteKey} {...props} />
    </div>
  );
};
