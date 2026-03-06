'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'use-debounce';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvailabilityInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: 'username' | 'email';
  label: string;
  hint?: string;
  error?: string;
  onAvailabilityChange?: (isAvailable: boolean) => void;
  register: any; // from react-hook-form
}

export function AvailabilityInput({
  type,
  label,
  hint,
  error,
  register,
  className,
  onAvailabilityChange,
  ...props
}: AvailabilityInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounce(inputValue, 500);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'available' | 'taken' | 'rate-limited' | 'error' | 'invalid'
  >('idle');
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const t = useTranslations('Auth.availability');

  const checkAvailability = useCallback(
    async (value: string) => {
      if (!value) {
        setStatus('idle');
        setValidationError(null);
        onAvailabilityChange?.(false);
        return;
      }

      // Validation before API call
      if (type === 'username') {
        if (value.includes(' ')) {
          setStatus('invalid');
          setValidationError(t('validation.no_spaces'));
          onAvailabilityChange?.(false);
          return;
        }

        if (value.length < 4 || value.length > 20) {
          setStatus('invalid');
          setValidationError(
            value.length < 4 ? t('validation.too_short') : t('validation.too_long'),
          );
          onAvailabilityChange?.(false);
          return;
        }

        const usernameRegex = /^[a-zA-Z0-9_.]+$/;
        if (!usernameRegex.test(value)) {
          setStatus('invalid');
          setValidationError(t('validation.invalid_chars'));
          onAvailabilityChange?.(false);
          return;
        }
      }

      if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          // For email we stay in idle until it's valid enough to check
          setStatus('idle');
          setValidationError(null);
          onAvailabilityChange?.(false);
          return;
        }
      }

      setStatus('loading');
      setValidationError(null);
      setApiError(null);

      try {
        const res = await fetch(
          `/api/users/check-availability?type=${type}&value=${encodeURIComponent(value)}`,
        );

        if (res.status === 429) {
          setStatus('rate-limited');
          onAvailabilityChange?.(false);
          return;
        }

        if (!res.ok) throw new Error('Failed to check availability');

        const data = await res.json();
        if (data.available) {
          setStatus('available');
          onAvailabilityChange?.(true);
        } else {
          setStatus('taken');
          onAvailabilityChange?.(false);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        onAvailabilityChange?.(false);
      }
    },
    [type, onAvailabilityChange, t],
  );

  useEffect(() => {
    if (debouncedValue) {
      checkAvailability(debouncedValue);
    } else {
      setStatus('idle');
    }
  }, [debouncedValue, checkAvailability]);

  const { onChange, ...registerRest } = register;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e); // Call react-hook-form's onChange
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={props.id}
          className="ml-1 text-xs font-medium tracking-wider text-white/80 uppercase"
        >
          {label}
        </label>
        <div
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
          aria-live="polite"
        >
          {status === 'loading' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              <span className="text-[10px] font-bold tracking-tighter text-blue-400 uppercase">
                {t('checking')}
              </span>
            </>
          )}
          {status === 'available' && (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-bold tracking-tighter text-emerald-400 uppercase">
                {t('available')}
              </span>
            </>
          )}
          {status === 'invalid' && (
            <>
              <XCircle className="h-3 w-3 text-red-400" />
              <span className="text-[10px] font-bold tracking-tighter text-red-400 uppercase">
                {t('invalid')}
              </span>
            </>
          )}
          {status === 'taken' && (
            <>
              <XCircle className="h-3 w-3 text-red-400" />
              <span className="text-[10px] font-bold tracking-tighter text-red-400 uppercase">
                {t('taken')}
              </span>
            </>
          )}
          {status === 'rate-limited' && (
            <button
              type="button"
              onClick={() => checkAvailability(inputValue)}
              className="flex items-center gap-1.5 rounded px-1 transition-colors hover:bg-white/10"
            >
              <AlertCircle className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] font-bold tracking-tighter text-amber-400 uppercase underline decoration-dotted underline-offset-2">
                {t('cooldown')}
              </span>
            </button>
          )}
          {status === 'idle' && (
            <span className="text-[10px] font-bold tracking-tighter text-white/20 uppercase">
              {t('idle')}
            </span>
          )}
        </div>
      </div>

      <div className="group relative">
        <input
          {...props}
          {...registerRest}
          onChange={handleInputChange}
          className={cn(
            'rounded-app w-full px-4 py-3 transition-all duration-200 outline-none',
            'border border-white/10 bg-white/5 text-white placeholder:text-white/30',
            'focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/30',
            'hover:border-white/20 hover:bg-white/10',
            (error || status === 'taken' || status === 'invalid') &&
              'border-red-500 focus:border-red-500 focus:ring-red-500',
            status === 'available' &&
              'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/50',
            className,
          )}
        />
      </div>

      {error ? (
        <p className="ml-1 text-xs text-red-500">{error}</p>
      ) : status === 'invalid' ? (
        <p className="ml-1 animate-pulse text-[10px] font-bold tracking-tight text-red-400 uppercase">
          {validationError || t('invalid')}
        </p>
      ) : status === 'taken' ? (
        <p className="ml-1 text-xs text-red-500">{t('taken_message', { type })}</p>
      ) : status === 'rate-limited' ? (
        <div className="ml-1 flex items-center justify-between">
          <p className="text-xs font-medium text-amber-500 italic">{t('cooldown_message')}</p>
          <button
            type="button"
            onClick={() => checkAvailability(inputValue)}
            className="text-[10px] font-bold tracking-wider text-white/60 uppercase underline underline-offset-2 hover:text-white"
          >
            {t('retry')}
          </button>
        </div>
      ) : hint ? (
        <p className="ml-1 text-[10px] leading-tight tracking-tight text-white/40 uppercase">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
