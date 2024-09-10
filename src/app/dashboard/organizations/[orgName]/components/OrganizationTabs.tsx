'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import { OrganizationDto } from '@/app/api.types';
import OrganizationEditTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationEditTab';
import OrganizationPeopleTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationPeopleTab';
import MarkdownRenderer from '@/app/dashboard/models/[modelId]/components/MarkdownRenderer';
import {
  ArrowsRightLeftIcon,
  PencilSquareIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useParams, usePathname } from 'next/navigation';
import OrganizationSharedTab from '@/app/dashboard/organizations/[orgName]/components/tabs/OrganizationSharedTab';

interface OrganizationTabsProps {
  organization: OrganizationDto;
}

export default function OrganizationTabs({
  organization,
}: OrganizationTabsProps) {
  const pathname = usePathname();
  const params = useParams<{ orgTabName: string }>();
  const pathnameWithoutTab = pathname.substring(0, pathname.lastIndexOf('/'));

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
      selectedKey={params.orgTabName}
    >
      <Tab
        key="description"
        title={
          <div className="flex items-center space-x-1">
            <InformationCircleIcon className="size-5" />
            <span>Description</span>
          </div>
        }
        href={`${pathnameWithoutTab}/description`}
      >
        <MarkdownRenderer>{organization.description}</MarkdownRenderer>
      </Tab>
      <Tab
        key="people"
        title={
          <div className="flex items-center space-x-1">
            <UsersIcon className="size-5" />
            <span>People</span>
          </div>
        }
        href={`${pathnameWithoutTab}/people`}
      >
        <OrganizationPeopleTab organization={organization} />
      </Tab>
      {(organization.canEdit || organization.isMember) && (
        <Tab
          key="shared"
          title={
            <div className="flex items-center space-x-1">
              <ArrowsRightLeftIcon className="size-5" />
              <span>Shared</span>
            </div>
          }
          href={`${pathnameWithoutTab}/shared`}
        >
          <OrganizationSharedTab organization={organization} />
        </Tab>
      )}
      {organization.canEdit && (
        <Tab
          key="edit"
          title={
            <div className="flex items-center space-x-1">
              <PencilSquareIcon className="size-5" />
              <span>Edit</span>
            </div>
          }
          href={`${pathnameWithoutTab}/edit`}
        >
          <OrganizationEditTab organization={organization} />
        </Tab>
      )}
    </Tabs>
  );
}
