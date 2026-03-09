'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { toast } from 'sonner';
import { Plus, X, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postCreatePrivateGroup } from '../groups.api';
import { useAppParams } from '@/hooks/use-app-params';
import { useAuthStore } from '@/store/use-auth-store';

export function CreateLeagueForm() {
  const t = useTranslations('Leagues');
  const router = useRouter();

  const { slug } = useAppParams(['slug']);
  const subscriptionPlan = useAuthStore((state) => state.user?.subscriptionPlan);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const isFree = subscriptionPlan === 'free';

  const handleSubmit = async (e: React.FormEvent) => {
    if (isFree) return;
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await postCreatePrivateGroup(slug!, name);

      if (res.success) {
        toast.success(t('league_created') || 'Liga úspešne vytvorená');
        setIsOpen(false);
        setName('');
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(t('error_generic') || 'Nastala chyba');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} color="warning" className="gap-2">
        <Plus className="h-5 w-5" />
        {t('create_button')}
      </Button>
    );
  }

  // Enhanced modal using fixed positioning and IceGlassCard
  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-300">
      <div
        className={`w-full ${isFree ? 'max-w-md' : 'max-w-lg'} animate-in zoom-in-95 relative duration-300`}
      >
        <IceGlassCard className="overflow-hidden border-white/10 p-0" backdropBlur="lg">
          <div
            className={`${isFree ? 'p-8 sm:p-12' : 'p-8 sm:p-10'} relative flex min-h-[420px] flex-col`}
          >
            {/* Header - Always at the top */}
            <div className="relative z-30 mb-8 flex items-center justify-between">
              {!isFree ? (
                <h2 className="font-display text-2xl font-black tracking-tight text-white uppercase italic">
                  {t('create_modal.title')}
                </h2>
              ) : (
                <div />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/30 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Form Content - Centered if paid */}
            <div
              className={`flex flex-1 flex-col ${!isFree ? 'justify-center' : ''} relative z-10`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 block text-xs font-black tracking-widest text-white/40 uppercase">
                    {t('create_modal.name_label')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('create_modal.name_placeholder')}
                    className="focus:border-warning/50 focus:ring-warning/50 font-display w-full rounded-lg border border-white/10 bg-black/40 p-4 text-lg text-white transition-all placeholder:text-white/10 focus:ring-1 focus:outline-none"
                    required
                    disabled={isFree}
                    minLength={3}
                    maxLength={30}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold tracking-widest text-white/40 uppercase hover:text-white"
                  >
                    {t('create_modal.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isFree}
                    color="warning"
                    className="px-8 font-black tracking-widest uppercase"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t('create_modal.creating') : t('create_modal.submit')}
                  </Button>
                </div>
              </form>
            </div>

            {/* Premium Restriction Overlay */}
            {isFree && (
              <div className="animate-in fade-in absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center duration-700">
                <div className="absolute inset-0 bg-black/85 backdrop-blur-[32px] sm:backdrop-blur-[45px]" />

                <div className="relative z-30 mx-auto flex max-w-[280px] flex-col items-center">
                  <div className="relative mb-8 transform-gpu">
                    <div className="bg-warning/20 absolute -inset-12 animate-pulse rounded-full blur-[60px]" />
                    <div className="border-warning/40 relative rounded-full border bg-black/60 p-5 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                      <Lock className="text-warning h-10 w-10" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl leading-tight font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
                    {t('create_modal.premium_title')}
                  </h3>

                  <p className="mb-10 text-sm leading-relaxed font-bold tracking-tight text-white/60 uppercase">
                    {t('create_modal.premium_description')}
                  </p>

                  <Link href={'/account'} className="w-full">
                    <Button
                      color="warning"
                      className="w-full transform py-7 text-xs font-black tracking-[0.2em] uppercase shadow-[0_4px_20px_rgba(234,179,8,0.3)] transition-all hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(234,179,8,0.5)] active:scale-[0.97]"
                    >
                      {t('create_modal.upgrade_button')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </IceGlassCard>
      </div>
    </div>
  );
}
