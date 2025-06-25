import { Metadata } from 'next';
import ModelsTable from '@/app/dashboard/models/components/ModelsTable';
import UsersTable from '@/app/dashboard/admin/components/UsersTable';
import React from 'react';
import { generateSharedMetadata } from '@/app/shared.metadata';
import ModelsBreadcrumbs from '@/app/dashboard/models/components/ModelsBreadcrumbs';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { errorResponse, handleApiResponse } from '@/app/util/response';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/tooltip';

export const metadata: Metadata = generateSharedMetadata(
  'Admin Dashboard',
  'Administrative dashboard for managing models and users on the Jaqpot predictive modeling platform.',
);

export default async function AdminPage() {
  return (
    <div>
      {/* Models Section */}
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

      <ModelsTable modelsEndpoint="/api/admin/models" showCreator={true} />

      {/* Users Section */}
      <div className="mb-5 mt-10 flex items-center">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
          User Signups
        </h2>
        <Tooltip
          content="All users registered in the Jaqpot platform ordered by signup date"
          closeDelay={0}
        >
          <InformationCircleIcon className="ml-1 size-5 text-gray-400" />
        </Tooltip>
      </div>

      <UsersTable usersEndpoint="/api/admin/users" />
    </div>
  );
}
