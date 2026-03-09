'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useTranslations } from 'next-intl';
import { CreateGroupForm } from '../components/create-group-form';

export const GroupsView = () => {
  const t = useTranslations('Groups');

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
            <CreateGroupForm />
            {/* <div className="md:hidden">
              <JoinLeagueModal />
            </div> */}
          </div>
        </div>
      </PageHeader>
    </div>
  );
};
