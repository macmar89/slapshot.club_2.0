import { TabsContent } from '@/components/ui/tabs';
import { useAppParams } from '@/hooks/use-app-params';
import { API_ROUTES } from '@/lib/api-routes';
import useSWR from 'swr';
import { GroupMembersResponse } from '@/features/competitions/groups/group.types';

export const GroupDetailRosterTab = () => {
  const { groupSlug } = useAppParams(['groupSlug']);

  const { data, isLoading, error } = useSWR<GroupMembersResponse>(
    API_ROUTES.GROUPS.DETAIL.MEMBERS(groupSlug),
  );

  console.log(data);

  return (
    <>
      {/* <LeagueOfficeTab
        league={league}
        members={members}
        currentUser={currentUser}
        waitingList={waitingList}
        onApprove={handleApprove}
        onReject={handleReject}
        onAction={(memberId, action) => {
            setMemberToAction(memberId);
            setActionType(action);
            }}
            onDeleteLeague={handleDeleteLeague}
            isDeleting={isDeleting}
            /> */}
      GroupDetailRosterTab
    </>
  );
};
