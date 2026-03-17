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
    <Container className="py-8">
      <PageHeader title={t('title')} description={t('description')} />

      <CustomTabs items={tabItems} defaultValue="rules" className="w-full">
        <TabsContent value="rules" className="mt-6 border-none bg-transparent p-0">
          <UserManualRules />
        </TabsContent>

        <TabsContent value="groups" className="mt-6 border-none bg-transparent p-0">
          <UserManualGroups />
        </TabsContent>
      </CustomTabs>

      <IceGlassCard className="p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 text-center md:text-left">
            <h1 className="mb-4 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-4xl font-black tracking-tight text-transparent">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/40">{t('description')}</p>
          </header>
        </div>
      </IceGlassCard>
    </Container>
  );
};
