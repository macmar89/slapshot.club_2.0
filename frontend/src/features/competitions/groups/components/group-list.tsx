import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { UserGroup, UserGroupsMetadata } from '../group.types';
import { GroupCard } from './group-card';
import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';
import { GroupsSkeleton } from './groups-skeleton';

interface GroupListProps {
  data: UserGroup[] | undefined;
  metadata: UserGroupsMetadata | undefined;
  isLoading: boolean;
}

export const GroupList = ({ data, isLoading }: GroupListProps) => {
  const t = useTranslations('Groups');
  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <div className="order-1 lg:col-span-8">
      <IceGlassCard className="h-full" backdropBlur="lg">
        <div className="p-6 sm:p-8">
          {isLoading ? (
            <GroupsSkeleton />
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <Users className="h-8 w-8 text-white/30" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white/60">{t('empty_state_title')}</p>
                <p className="text-xs text-white/40">{t('no_leagues_hint')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.map((group) => (
                <GroupCard key={group.id} data={group} />
              ))}
            </div>
          )}
        </div>
      </IceGlassCard>
    </div>
  );
};
