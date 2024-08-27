import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import React from 'react';
import { generateSharedMetadata } from '@/app/shared.metadata';
import ModelsBreadcrumbs from '@/app/dashboard/models/components/ModelsBreadcrumbs';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { errorResponse, handleApiResponse } from '@/app/util/response';

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
      <h2 className="mb-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Your models
      </h2>
      <ModelsTable modelsEndpoint="/api/user/models" />

      <h2 className="my-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Shared with you via your associated organizations
      </h2>
      <ModelsTable
        modelsEndpoint="/api/user/shared-models"
        showSharedOrganizations={true}
        userOrganizations={userOrganizations}
      />
    </div>
  );
}
