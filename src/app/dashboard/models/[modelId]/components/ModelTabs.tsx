'use client';

import { useParams, usePathname } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/tabs';
import { ModelDto } from '@/app/api.types';
import FeaturesTab from '@/app/dashboard/models/[modelId]/components/tabs/FeaturesTab';
import PredictTab from '@/app/dashboard/models/[modelId]/components/tabs/PredictTab';
import ModelEditTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelEditTab';
import MarkdownRenderer from '@/app/dashboard/models/[modelId]/components/MarkdownRenderer';
import ModelAdminTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelAdminTab';

interface ModelTabsProps {
  model: ModelDto;
}

export default function ModelTabs({ model }: ModelTabsProps) {
  const pathname = usePathname();
  const params = useParams<{ tabName: string }>();

  const pathnameWithoutTab = pathname.substring(0, pathname.lastIndexOf('/'));

  return (
    <Tabs
      aria-label="Tabs"
      disabledKeys={['discussion']}
      classNames={{
        base: 'w-full',
        tabList:
          'gap-8 w-full bg-transparent dark:bg-transparent rounded-none border-b-1 p-0 w-full',
        cursor:
          'w-full rounded-none bg-transparent dark:bg-transparent group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-indigo-800 dark:group-data-[selected=true]:border-b-2 dark:group-data-[selected=true]:border-white shadow-none dark:text-white',
        tab: 'max-w-fit px-0 h-12 rounded-none border-none box-shadow-none',
        tabContent:
          'rounded-none border-none box-shadow-none group-data-[selected=true]:text-indigo-600 dark:group-data-[selected=true]:text-white',
      }}
      selectedKey={params.tabName}
      defaultSelectedKey="description"
    >
      <Tab
        key="description"
        title="Description"
        href={`${pathnameWithoutTab}/description`}
      >
        <MarkdownRenderer>{model.description}</MarkdownRenderer>
      </Tab>
      <Tab
        key="features"
        title="Features"
        href={`${pathnameWithoutTab}/features`}
      >
        <FeaturesTab model={model} />
      </Tab>
      <Tab key="predict" title="Predict" href={`${pathnameWithoutTab}/predict`}>
        <PredictTab model={model} />
      </Tab>
      {model.canEdit && (
        <Tab key="edit" title="Edit" href={`${pathnameWithoutTab}/edit`}>
          <ModelEditTab model={model} />
        </Tab>
      )}
      {model.isAdmin && (
        <Tab key="admin" title="Admin" href={`${pathnameWithoutTab}/admin`}>
          <ModelAdminTab model={model} />
        </Tab>
      )}
      <Tab
        key="discussion"
        title="Discussion"
        href={`${pathnameWithoutTab}/discussion`}
      >
        Not implemented yet
      </Tab>
    </Tabs>
  );
}
