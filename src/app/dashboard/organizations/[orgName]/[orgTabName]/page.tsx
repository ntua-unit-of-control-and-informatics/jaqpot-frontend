import { notFound } from 'next/navigation';
import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/app/util/auth';
import OrganizationTabs from '@/app/dashboard/organizations/[orgName]/components/OrganizationTabs';
import OrganizationBreadcrumbs from '@/app/dashboard/organizations/[orgName]/components/OrganizationBreadcrumbs';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import { getModel } from '@/app/dashboard/models/[modelId]/[tabName]/page';
import { Tooltip } from '@nextui-org/tooltip';

export async function generateMetadata({
  params,
}: {
  params: { orgName: string };
}): Promise<Metadata> {
  const organization = await getOrganizationByName(params.orgName);

  return generateSharedMetadata(organization?.name, organization?.description);
}

export default async function Page({
  params,
}: {
  params: { orgName: string };
}) {
  const organization = await getOrganizationByName(params.orgName);
  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <OrganizationBreadcrumbs organization={organization} />
      <div className="rounded-lg">
        <div className="flex items-center py-3 text-3xl font-semibold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
          <BuildingOfficeIcon className="mr-2 size-8" />
          {organization.name}
        </div>
        <div className="flex items-center gap-4 py-3">
          <Tooltip content={'Creator'} closeDelay={0}>
            <div className="flex items-center text-sm text-gray-400">
              <>
                <UserIcon className="mr-2 size-5 text-gray-400" />
                <span>{organization.creator?.username}</span>
              </>
            </div>
          </Tooltip>
        </div>
        <OrganizationTabs organization={organization} />
      </div>
    </div>
  );
}
