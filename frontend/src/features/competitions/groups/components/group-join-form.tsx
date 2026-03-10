'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postJoinGroup } from '../groups.api';
import { useSWRConfig } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useAppParams } from '@/hooks/use-app-params';

export function GroupJoinForm() {
  const t = useTranslations('Groups');
  const router = useRouter();
  const { slug } = useAppParams(['slug']);

  const { mutate } = useSWRConfig();

  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const KNOWN_ERRORS = [
    'group_not_found',
    'user_already_joined',
    'group_full',
    'group_locked',
    'max_joined_groups_reached',
    'max_owned_groups_reached',
    'max_groups_reached',
  ] as const;

  type KnownError = (typeof KNOWN_ERRORS)[number];

  const getErrorMessage = (errorCode: string | undefined): string => {
    if (errorCode && KNOWN_ERRORS.includes(errorCode as KnownError)) {
      return t(`errors.${errorCode as KnownError}`);
    }
    return t('errors.unexpected');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const res = await postJoinGroup(code, slug);
      if (res.success) {
        toast.success(t('join_request_sent'));
        setCode('');
        await mutate(API_ROUTES.GROUPS.USER_GROUPS_BY_COMPETITION_SLUG(slug));
        router.refresh();
      } else {
        toast.error(getErrorMessage(res.error));
      }
    } catch {
      toast.error(t('errors.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="w-full flex-1">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('join_placeholder')}
          className="rounded-app focus:border-primary/40 focus:ring-primary/40 w-full border border-white/10 bg-black/40 p-3 text-center font-mono text-xs tracking-widest text-white uppercase shadow-inner transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none sm:text-sm"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !code.trim()}
        size="lg"
        className="bg-primary border-primary/50 hover:bg-primary/90 w-full border font-black tracking-widest text-black uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {t('join_button')} <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
