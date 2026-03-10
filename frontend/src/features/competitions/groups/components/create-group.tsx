'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Plus, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from 'radix-ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { postCreatePrivateGroup } from '@/features/competitions/groups/groups.api';
import { useAppParams } from '@/hooks/use-app-params';
import { useAuthStore } from '@/store/use-auth-store';
import { useState } from 'react';
import {
  createGroupFormSchema,
  type CreateGroupFormValues,
} from '@/features/competitions/groups/groups.schema';

export function CreateGroupForm() {
  const t = useTranslations('Groups');
  const router = useRouter();

  const { slug } = useAppParams(['slug']);
  const subscriptionPlan = useAuthStore((state) => state.user?.subscriptionPlan);

  const [open, setOpen] = useState(false);

  const isFree = subscriptionPlan === 'free' || !subscriptionPlan;

  const schema = createGroupFormSchema(t);

  // Maps backend error message keys → translation keys
  const BACKEND_ERROR_KEYS: Record<string, string> = {
    competition_not_found: 'errors.competition_not_found',
    user_not_pro_or_vip: 'errors.user_not_pro_or_vip',
    max_joined_groups_reached: 'errors.max_joined_groups_reached',
    max_owned_groups_reached: 'errors.max_owned_groups_reached',
    max_groups_reached: 'errors.max_groups_reached',
    group_not_found: 'errors.group_not_found',
    user_already_joined: 'errors.user_already_joined',
  };

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: CreateGroupFormValues) => {
    if (isFree) return;

    const res = await postCreatePrivateGroup(slug!, values.name);

    if (res.success) {
      toast.success(t('group_created'));
      form.reset();
      setOpen(false);
      router.refresh();
    } else {
      const errorKey = res.error && BACKEND_ERROR_KEYS[res.error];
      toast.error(errorKey ? t(errorKey as Parameters<typeof t>[0]) : t('errors.unexpected'));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button color="warning" className="gap-2">
          <Plus className="h-5 w-5" />
          {t('create_button')}
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={!isFree} className="overflow-hidden p-0 sm:max-w-md">
        <div className="relative flex min-h-[420px] flex-col p-8 sm:p-10">
          {/* Header */}
          {isFree ? (
            <VisuallyHidden.Root>
              <DialogTitle>{t('create_modal.title')}</DialogTitle>
              <DialogDescription>{t('create_modal.premium_description')}</DialogDescription>
            </VisuallyHidden.Root>
          ) : (
            <DialogHeader className="relative z-30 mb-8">
              <DialogTitle className="font-display text-2xl font-black tracking-tight text-white uppercase italic">
                {t('create_modal.title')}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t('create_modal.premium_description')}
              </DialogDescription>
            </DialogHeader>
          )}

          {/* Form */}
          <div className={`relative z-10 flex flex-1 flex-col ${!isFree ? 'justify-center' : ''}`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1 text-xs font-black tracking-widest text-white/40 uppercase">
                        {t('create_modal.name_label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('create_modal.name_placeholder')}
                          disabled={isFree || isLoading}
                          className="focus:border-warning/50 focus:ring-warning/50 font-display h-auto rounded-lg border border-white/10 bg-black/40 p-4 text-lg text-white transition-all placeholder:text-white/10 focus:ring-1 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Actions */}
                <div className="flex justify-end gap-4 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
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
            </Form>
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
      </DialogContent>
    </Dialog>
  );
}
