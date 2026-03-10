import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { UserGroup, UserGroupsMetadata } from '../group.types';
import { GroupCard } from './group-card';

interface GroupListProps {
  data: UserGroup[] | undefined;
  metadata: UserGroupsMetadata | undefined;
  isLoading: boolean;
}

export const GroupList = ({ data, isLoading }: GroupListProps) => {
  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-4">
      {/* Left Side: Leagues List */}
      <div className="order-1 lg:col-span-3">
        <IceGlassCard className="h-full" backdropBlur="lg">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.map((group) => (
                <GroupCard key={group.id} data={group} />
              ))}
            </div>
          </div>
        </IceGlassCard>
      </div>
    </div>
  );
};
