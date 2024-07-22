'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import { OrganizationDto } from '@/app/api.types';
import OrganizationEditTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationEditTab';
import OrganizationInvitationsTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationInvitationsTab';
import MarkdownRenderer from '@/app/dashboard/models/[modelId]/components/MarkdownRenderer';
import OrganizationAssociatedModelsTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationAssociatedModelsTab';

interface OrganizationTabsProps {
  organization: OrganizationDto;
}

export default function OrganizationTabs({
  organization,
}: OrganizationTabsProps) {
  return (
    <Tabs
      aria-label="Tabs"
      classNames={{
        base: 'w-full',
        tabList:
          'gap-8 w-full bg-transparent dark:bg-transparent rounded-none border-b-1 p-0 w-full',
        cursor:
          'w-full rounded-none bg-transparent dark:bg-transparent group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-indigo-800 dark:group-data-[selected=true]:border-b-2 dark:group-data-[selected=true]:border-white shadow-none dark:text-white',
        tab: 'max-w-fit px-0 h-12 rounded-none border-none box-shadow-none',
        tabContent:
          'rounded-none border-none box-shadow-none group-data-[selected=true]:text-indigo-600',
      }}
    >
      <Tab key="description" title="Description">
        <MarkdownRenderer>{organization.description}</MarkdownRenderer>
      </Tab>
      <Tab key="models" title="Associated models">
        <OrganizationAssociatedModelsTab organization={organization} />
      </Tab>
      {organization.canEdit && (
        <Tab key="invitations" title="Invitations">
          <OrganizationInvitationsTab organization={organization} />
        </Tab>
      )}
      {organization.canEdit && (
        <Tab key="edit" title="Edit">
          <OrganizationEditTab organization={organization} />
        </Tab>
      )}
    </Tabs>
  );
}
