'use client';

import { usePathname } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/tabs';
import { ModelDto } from '@/app/api.types';
import FeaturesTab from '@/app/dashboard/models/components/tabs/FeaturesTab';

interface ModelTabsProps {
  model: ModelDto;
}

// TODO when https://github.com/nextui-org/nextui/issues/2934 is fixed
// add navigation
export default function ModelTabs({ model }: ModelTabsProps) {
  const pathname = usePathname();

  return (
    <Tabs
      aria-label="Tabs"
      disabledKeys={['discussion']}
      classNames={{
        tabList: 'gap-8 w-full bg-transparent rounded-none border-b-1 p-0',
        cursor:
          'w-full rounded-none bg-transparent group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-indigo-800 shadow-none',
        tab: 'max-w-fit px-0 h-12 rounded-none border-none box-shadow-none',
        tabContent:
          'rounded-none border-none box-shadow-none group-data-[selected=true]:text-indigo-600',
      }}
    >
      <Tab key="description" title="Description">
        {model.description}
      </Tab>
      <Tab key="features" title="Features">
        <FeaturesTab model={model} />
      </Tab>
      <Tab key="discussion" title="Discussion">
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </Tab>
    </Tabs>
  );
}
