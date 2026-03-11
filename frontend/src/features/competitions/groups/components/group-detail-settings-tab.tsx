import useSWR from 'swr';
import { GroupDetailSettings } from '../group.types';
import { API_ROUTES } from '@/lib/api-routes';
import { ListSkeleton } from '@/components/common/skeletons';
import { useTranslations } from 'next-intl';
import { DataLoader } from '@/components/common/data-loader';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

interface GroupDetailSettingsTabProps {
  groupSlug: string;
}

export const GroupDetailSettingsTab = ({ groupSlug }: GroupDetailSettingsTabProps) => {
  const t = useTranslations('Groups');
  const { copy } = useCopyToClipboard();

  const { data, isLoading, error } = useSWR<GroupDetailSettings>(
    API_ROUTES.GROUPS.DETAIL.SETTINGS(groupSlug),
  );

  // Placeholder for state and functions not provided in the original snippet but implied by usage
  const isDeleting = false; // Assuming this is managed elsewhere
  const setIsDeleteOpen = (isOpen: boolean) => {
    /* no-op */
  }; // Assuming this is managed elsewhere

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<ListSkeleton rows={8} />}
      notFound={<div>No members found</div>}
    >
      {(data) => {
        return (
          <IceGlassCard
            className="space-y-0 overflow-hidden border-white/10 p-0 shadow-xl"
            backdropBlur="lg"
          >
            {' '}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 bg-white/[0.02] p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3">
              {/* Invite Code */}
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase md:text-xs">
                  {t('invite_code')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-warning font-mono text-lg font-bold tracking-wider md:text-2xl">
                    {data.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 cursor-pointer text-white/40 hover:text-white md:h-8 md:w-8"
                    onClick={() => copy(data.code || '')}
                  >
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>

              {/* Capacity - Hidden on mobile */}
              <div className="hidden flex-col gap-2 md:flex">
                <span className="text-xs font-bold tracking-wider text-white/40 uppercase">
                  {t('capacity')}
                </span>
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <span>{data.statsMembersCount}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-white/40">{data.maxMembers}</span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="flex justify-end md:justify-start lg:justify-end">
                <Button
                  variant="outline"
                  color="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                  disabled={isDeleting}
                  className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 h-8 shrink-0 cursor-pointer gap-2 px-3 text-xs"
                >
                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">
                    {isDeleting ? t('deleting_league') : t('delete_league_action')}
                  </span>
                  <span className="sm:hidden">{t('delete_league_short')}</span>
                </Button>
              </div>
            </div>
          </IceGlassCard>
        );
      }}
    </DataLoader>
  );
};
