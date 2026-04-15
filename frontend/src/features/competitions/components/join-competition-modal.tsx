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
import { useRouter } from '@/i18n/routing';
import { handleJoinCompetition } from '../competitions.api';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

import { Competition } from '../competitions.types';

interface JoinCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition;
}

export function JoinCompetitionModal({ isOpen, onClose, competition }: JoinCompetitionModalProps) {
  const router = useRouter();
  const t = useTranslations('Arena.join_modal');
  const { mutate } = useSWRConfig();

  const { id, slug, name } = competition;

  const handleConfirmJoin = async () => {
    try {
      const res = await handleJoinCompetition(id);
      if (res.success) {
        onClose();
        // Mutate competitions list and counts
        mutate((key: string) => typeof key === 'string' && key.startsWith(API_ROUTES.COMPETITIONS.ALL));
        mutate(API_ROUTES.COMPETITIONS.COUNTS);
        
        router.push(`${slug}/dashboard`);
      } else {
        toast.error(res.error || t('error_generic'));
      }
    } catch (error) {
      toast.error(t('error_generic'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#eab308]">{t('title')}</DialogTitle>
          <DialogDescription className="text-white/60">
            {t('description', { competitionName: name })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white/60 hover:bg-white/5 hover:text-white"
          >
            {t('cancel')}
          </Button>
          <Button color="gold" onClick={handleConfirmJoin}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
