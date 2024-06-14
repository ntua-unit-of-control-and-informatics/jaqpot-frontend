import { notFound } from 'next/navigation';
import { ModelDto, OrganizationDto } from '@/app/api.types';
import { auth } from '@/auth';
import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { isAuthenticated } from '@/app/util/auth';
import OrganizationTabs from '@/app/dashboard/organizations/[orgName]/components/OrganizationTabs';
import OrganizationBreadcrumbs from '@/app/dashboard/organizations/[orgName]/components/OrganizationBreadcrumbs';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';

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
      <div className="max-w-4xl mx-auto rounded-lg">
        <div className="flex text-3xl font-semibold py-3 items-center leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
          <BuildingOfficeIcon className="size-8 mr-2" />
          {organization.name}
        </div>
        <OrganizationTabs organization={organization} />
      </div>
    </div>
  );
}
