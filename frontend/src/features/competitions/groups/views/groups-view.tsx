import { PageHeader } from '@/components/layout/page-header';
import { useAuthStore } from '@/store/use-auth-store';
import { useTranslations } from 'next-intl';

export const GroupsView = () => {
  const t = useTranslations('Groups');
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title={
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2">{t('title')}</span>
          </div>
        }
        description={t('description')}
        hideDescriptionOnMobile
      >
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
          <div className="flex w-full items-center gap-4 sm:w-auto">
            <CreateLeagueForm userPlan={user?.subscriptionPlan} />
            {/* <div className="md:hidden">
              <JoinLeagueModal />
            </div> */}
          </div>
        </div>
      </PageHeader>
    </div>
  );
};
