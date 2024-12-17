'use client';

import { useParams, usePathname } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/tabs';
import { ModelDto } from '@/app/api.types';
import ModelFeaturesTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelFeaturesTab';
import ModelPredictTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelPredictTab';
import ModelEditTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelEditTab';
import MarkdownRenderer from '@/app/dashboard/models/[modelId]/components/MarkdownRenderer';
import ModelAdminTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelAdminTab';
import {
  AdjustmentsVerticalIcon,
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import ModelMetricsTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelMetricsTab';
import ModelChatTab from '@/app/dashboard/models/[modelId]/components/tabs/ModelChatTab';

interface ModelTabsProps {
  model: ModelDto;
}

export default function ModelTabs({ model }: ModelTabsProps) {
  const pathname = usePathname();
  const params = useParams<{ tabName: string; datasetId?: string }>();

  const pathnameWithoutTab = pathname.substring(
    0,
    pathname.lastIndexOf(`/${params.tabName}`),
  );

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
      isDisabled={model.archived && !model.canEdit}
      selectedKey={params.tabName}
      defaultSelectedKey="description"
      className="mt-2.5"
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
        <MarkdownRenderer>{model.description}</MarkdownRenderer>
      </Tab>
      <Tab
        key="features"
        title={
          <div className="flex items-center space-x-1">
            <AdjustmentsVerticalIcon className="size-5" />
            <span>Features</span>
          </div>
        }
        href={`${pathnameWithoutTab}/features`}
      >
        <ModelFeaturesTab model={model} />
      </Tab>
      {model.type === 'DOCKER_LLM' && (
        <Tab
          key="chat"
          title={
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftEllipsisIcon className="size-5" />
              <span>Chat</span>
            </div>
          }
          href={`${pathnameWithoutTab}/chat`}
        >
          <ModelChatTab model={model} datasetId={params.datasetId} />
        </Tab>
      )}
      {model.type !== 'DOCKER_LLM' && (
        <Tab
          key="predict"
          title={
            <div className="flex items-center space-x-1">
              <RocketLaunchIcon className="size-5" />
              <span>Predict</span>
            </div>
          }
          href={`${pathnameWithoutTab}/predict`}
        >
          <ModelPredictTab model={model} />
        </Tab>
      )}
      <Tab
        key="metrics"
        title={
          <div className="flex items-center space-x-1">
            <ChartBarIcon className="size-5" />
            <span>Metrics</span>
          </div>
        }
        href={`${pathnameWithoutTab}/metrics`}
      >
        <ModelMetricsTab model={model} />
      </Tab>
      {model.canEdit && (
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
          <ModelEditTab model={model} />
        </Tab>
      )}
      {model.isAdmin && (
        <Tab
          key="admin"
          title={
            <div className="flex items-center space-x-1">
              <ShieldCheckIcon className="size-5" />
              <span>Admin</span>
            </div>
          }
          href={`${pathnameWithoutTab}/admin`}
        >
          <ModelAdminTab model={model} />
        </Tab>
      )}
      <Tab
        key="discussion"
        title={
          <div className="flex items-center space-x-1">
            <ChatBubbleLeftRightIcon className="size-5" />
            <span>Discussion</span>
          </div>
        }
        href={`${pathnameWithoutTab}/discussion`}
      >
        Not implemented yet
      </Tab>
    </Tabs>
  );
}
