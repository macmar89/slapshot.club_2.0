import useSWR, { useSWRConfig } from 'swr';
import { GroupDetailSettings } from '../group.types';
import { API_ROUTES } from '@/lib/api-routes';
import { ListSkeleton } from '@/components/common/skeletons';
import { useTranslations } from 'next-intl';
import { DataLoader } from '@/components/common/data-loader';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Shield, UserPlus, Lock, Key } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import React from 'react';
import { patchUpdateGroupSettings, deleteGroup } from '../groups.api';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/routing';

interface GroupDetailSettingsTabProps {
  groupSlug: string;
}

export const GroupDetailSettingsTab = ({ groupSlug }: GroupDetailSettingsTabProps) => {
  const t = useTranslations('Groups');
  const { copy } = useCopyToClipboard();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { data, isLoading, error } = useSWR<GroupDetailSettings>(
    API_ROUTES.GROUPS.DETAIL.SETTINGS(groupSlug),
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleToggle = async (key: keyof GroupDetailSettings, value: boolean) => {
    setIsSaving(true);
    const res = await patchUpdateGroupSettings(groupSlug, { [key]: value });

    if (res.success) {
      toast.success(t('group_updated_success'));
      mutate(API_ROUTES.GROUPS.DETAIL.SETTINGS(groupSlug));
    } else {
      toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(t('delete_confirm_desc') || 'Are you sure you want to delete this group?')) return;

    setIsDeleting(true);
    const res = await deleteGroup(groupSlug);

    if (res.success) {
      toast.success(t('league_deleted'));
      router.push('/arena');
    } else {
      toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
      setIsDeleting(false);
    }
  };

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<ListSkeleton rows={8} />}
      notFound={<div>No settings found</div>}
    >
      {(data) => {
        return (
          <div className="flex flex-col gap-6">
            <IceGlassCard
              className="space-y-0 overflow-hidden border-white/10 p-0 shadow-xl"
              backdropBlur="lg"
            >
              <div className="grid grid-cols-1 items-center gap-4 border-b border-white/10 bg-white/[0.02] p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3">
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

                {/* Capacity */}
                <div className="flex flex-col gap-2">
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
                <div className="flex justify-start lg:justify-end">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || isSaving}
                    className="shadow-destructive/20 h-9 shrink-0 cursor-pointer gap-2 px-4 shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isDeleting ? t('deleting_league') : t('delete_league_action')}</span>
                  </Button>
                </div>
              </div>

              {/* Settings Rows */}
              <div className="divide-y divide-white/10">
                {/* Require Approval */}
                <div className="flex items-center justify-between p-4 md:px-6 md:py-5">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-sm font-semibold text-white md:text-base">
                        {t('require_approval')}
                      </Label>
                      <p className="text-xs text-white/40 md:text-sm">
                        {t('require_approval_desc') || 'New members must be approved by you.'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={data.requireApproval}
                    onCheckedChange={(val) => handleToggle('requireApproval', val)}
                    disabled={isSaving}
                  />
                </div>

                {/* Allow Member Invites */}
                <div className="flex items-center justify-between p-4 md:px-6 md:py-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-sm font-semibold text-white md:text-base">
                        {t('allow_member_invites')}
                      </Label>
                      <p className="text-xs text-white/40 md:text-sm">
                        {t('allow_invites_desc') || 'Members can see and share the invite code.'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={data.allowMemberInvites}
                    onCheckedChange={(val) => handleToggle('allowMemberInvites', val)}
                    disabled={isSaving}
                  />
                </div>

                {/* Lock Group */}
                <div className="flex items-center justify-between p-4 md:px-6 md:py-5">
                  <div className="flex gap-4">
                    <div className="bg-warning/10 text-warning flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-sm font-semibold text-white md:text-base">
                        {t('lock_group_title') || 'Lock Group'}
                      </Label>
                      <p className="text-xs text-white/40 md:text-sm">
                        {t('lock_group_desc') || 'Prevent new members from joining entirely.'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={data.isLocked}
                    onCheckedChange={(val) => handleToggle('isLocked', val)}
                    disabled={isSaving}
                  />
                </div>

                {/* Alias Requirement */}
                <div className="flex items-center justify-between p-4 md:px-6 md:py-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <Key className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-sm font-semibold text-white md:text-base">
                        {t('require_alias') || 'Require Alias'}
                      </Label>
                      <p className="text-xs text-white/40 md:text-sm">
                        {t('require_alias_desc') ||
                          'Members must provide a nickname/alias upon joining.'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={data.isAliasRequired}
                    onCheckedChange={(val) => handleToggle('isAliasRequired', val)}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </IceGlassCard>
          </div>
        );
      }}
    </DataLoader>
  );
};
