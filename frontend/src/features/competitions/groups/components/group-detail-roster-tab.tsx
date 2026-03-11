import { TabsContent } from '@/components/ui/tabs';
import { useAppParams } from '@/hooks/use-app-params';
import { API_ROUTES } from '@/lib/api-routes';
import useSWR from 'swr';
import { GroupMembersResponse } from '@/features/competitions/groups/group.types';
import { DataLoader } from '@/components/common/data-loader';
import { is } from 'date-fns/locale';

interface GroupDetailRosterTabProps {
  groupSlug: string;
}

export const GroupDetailRosterTab = ({ groupSlug }: GroupDetailRosterTabProps) => {
  const { data, isLoading, error } = useSWR<GroupMembersResponse>(
    API_ROUTES.GROUPS.DETAIL.MEMBERS(groupSlug),
  );

  console.log(data);

  return <>Ajph </>;
};

// <DataLoader data={data} isLoading={isLoading} error={error} notFound={} skeleton>
//   {(data) => {
//     return <>Ahoj</>;
//   }}
// </DataLoader>
