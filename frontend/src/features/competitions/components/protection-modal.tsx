'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { handleJoinCompetition } from '../competitions.api';
import { toast } from 'sonner';
import { CompetitionPublicInfo } from '../competitions.types';
import { useState } from 'react';
import { HockeyLoader } from '@/components/ui/hockey-loader';

interface ProtectionModalProps {
  competition: CompetitionPublicInfo;
}

export function ProtectionModal({ competition }: ProtectionModalProps) {
  const router = useRouter();
  const t = useTranslations('Arena.join_modal');
  const [isJoining, setIsJoining] = useState(false);

  const { id, name, isRegistrationOpen } = competition;

  const handleConfirmJoin = async () => {
    setIsJoining(true);
    try {
      const res = await handleJoinCompetition(id);
      if (res.success) {
        toast.success(t('success_join') || 'Successfully joined!');
        router.refresh();
      } else {
        toast.error(res.error || t('error_generic'));
      }
    } catch (error) {
      toast.error(t('error_generic'));
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#eab308]">
            {isRegistrationOpen ? t('title') : t('registration_closed_title') || 'Registration Closed'}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {isRegistrationOpen
              ? t('description', { competitionName: name })
              : t('registration_closed_description', { competitionName: name }) ||
                `Registration for ${name} is currently closed.`}
          </DialogDescription>
        </DialogHeader>

        {isJoining ? (
          <div className="flex h-32 items-center justify-center">
            <HockeyLoader />
          </div>
        ) : (
          <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              asChild
              className="text-white/60 hover:bg-white/5 hover:text-white"
            >
              <Link href="/arena">
                {t('back_to_arena') || 'Back to Arena'}
              </Link>
            </Button>
            {isRegistrationOpen && (
              <Button color="gold" onClick={handleConfirmJoin}>
                {t('confirm')}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
