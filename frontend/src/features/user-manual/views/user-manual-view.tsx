'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { CustomTabs, TabItem } from '@/components/common/custom-tabs';
import { TabsContent } from '@/components/ui/tabs';
import { UserManualRules } from '../components/user-manual-rules';
import { UserManualGroups } from '../components/user-manual-groups';
import { FileText, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

export const UserManualView = () => {
  const t = useTranslations('UserManual');

  const tabItems: TabItem[] = [
    {
      value: 'rules',
      label: t('tabs_rules'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'groups',
      label: t('tabs_groups'),
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <Container>
      <PageHeader
        title={t('title')}
        description={t('description')}
        hideDescriptionOnMobile
        className="mb-4 sm:mb-6"
      />

      <CustomTabs items={tabItems} defaultValue="rules" className="w-full">
        <TabsContent value="rules" className="mt-4 border-none bg-transparent p-0 sm:mt-6">
          <UserManualRules />
        </TabsContent>

        <TabsContent value="groups" className="mt-4 border-none bg-transparent p-0 sm:mt-6">
          <UserManualGroups />
        </TabsContent>
      </CustomTabs>
    </Container>
  );
};
