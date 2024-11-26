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

async function fetchUserOrganizations() {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(`${process.env.API_URL}/v1/user/organizations`, {
    headers: {
      Authorization: `Bearer ${session!.token}`,
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
  });

  return handleApiResponse(res);
}

export default async function ModelsPage() {
  const res = await fetchUserOrganizations();
  const apiResponse = await res.json();
  let userOrganizations = [];
  if (apiResponse.success) {
    userOrganizations = apiResponse.data;
  }

  return (
    <div>
      <ModelsBreadcrumbs />
      <div className="mb-5 flex items-center">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
          Your models{' '}
        </h2>
        <Tooltip content="Models created by you" closeDelay={0}>
          <InformationCircleIcon className="ml-1 size-5 text-gray-400" />
        </Tooltip>
      </div>

      <ModelsTable modelsEndpoint="/api/user/models" />

      <div className="my-5 flex items-center">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
          Shared via your associated organizations
        </h2>
        <Tooltip
          content="These models are privately shared with the organizations you are a member of. Only members of the specified organizations can access these models."
          closeDelay={0}
        >
          <InformationCircleIcon className="ml-1 size-5 text-gray-400" />
        </Tooltip>
      </div>
      <ModelsTable
        modelsEndpoint="/api/user/shared-models"
        showSharedOrganizations={true}
        userOrganizations={userOrganizations}
      />

      <div className="my-5 flex items-center">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
          Your archived models
        </h2>
        <Tooltip
          content="These models will be deleted 30 days after they have been archived."
          closeDelay={0}
        >
          <InformationCircleIcon className="ml-1 size-5 text-gray-400" />
        </Tooltip>
      </div>
      <ModelsTable modelsEndpoint="/api/user/archived" />
    </div>
  );
}
