import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';
import { generateSharedMetadata } from '@/app/shared.metadata';
import ModelsBreadcrumbs from '@/app/dashboard/models/components/ModelsBreadcrumbs';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { errorResponse, handleApiResponse } from '@/app/util/response';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/tooltip';

export const metadata: Metadata = generateSharedMetadata(
  'Your models',
  'Access all your created models and explore models shared within your organizations on the Jaqpot predictive modeling platform. Manage and utilize models seamlessly in one place',
);

export default async function AdminPage() {
  return (
    <div>
      <div className="mb-5 flex items-center">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
          All models{' '}
        </h2>
        <Tooltip
          content="All models uploaded in the Jaqpot platform"
          closeDelay={0}
        >
          <InformationCircleIcon className="ml-1 size-5 text-gray-400" />
        </Tooltip>
      </div>

      <ModelsTable modelsEndpoint="/api/models" showCreator={true} />
    </div>
  );
}
